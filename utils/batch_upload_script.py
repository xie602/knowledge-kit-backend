"""
批量上传脚本 - 用于处理管理员手动复制的网盘链接文本
并生成标准化的JSON数据文件和预览图
"""

import re
import json
import os
from urllib.parse import urlparse, parse_qs


def extract_baidu_pan_info(text):
    """
    从文本中提取百度网盘链接信息
    """
    # 匹配百度网盘链接
    pan_re = r'(https?://pan\.baidu\.com/s/[a-zA-Z0-9\-_]+)[\s\n]*(提取码[:：]?\s*([a-zA-Z0-9]{4}))?'
    matches = re.findall(pan_re, text)
    
    results = []
    for match in matches:
        url = match[0]
        pwd = match[2] if match[2] else None
        
        # 解析链接获取文件信息
        parsed = urlparse(url)
        path_parts = parsed.path.split('/')
        file_code = path_parts[-1] if len(path_parts) > 1 else 'unknown'
        
        results.append({
            'url': url,
            'password': pwd,
            'file_code': file_code,
            'type': 'baidu_pan'
        })
    
    return results


def extract_alipan_info(text):
    """
    从文本中提取阿里云盘链接信息
    """
    # 匹配阿里云盘链接
    alipan_re = r'(https?://www\.alipan\.com/s/[a-zA-Z0-9\-_/]+)'
    matches = re.findall(alipan_re, text)
    
    results = []
    for match in matches:
        url = match
        
        # 解析链接获取文件信息
        parsed = urlparse(url)
        path_parts = parsed.path.split('/')
        file_code = path_parts[-1] if len(path_parts) > 2 else 'unknown'
        
        results.append({
            'url': url,
            'password': None,
            'file_code': file_code,
            'type': 'alipan'
        })
    
    return results


def parse_text_to_structured_data(text):
    """
    解析文本并生成结构化的数据
    """
    # 尝试匹配文档标题（通常在链接前面）
    title_re = r'(.+?)\n.*?(https?://(?:pan\.baidu\.com|www\.alipan\.com)/s/.+)'
    matches = re.findall(title_re, text)
    
    structured_data = []
    
    for match in matches:
        title = match[0].strip()
        link_part = match[1]
        
        # 提取链接信息
        baidu_links = extract_baidu_pan_info(link_part)
        alipan_links = extract_alipan_info(link_part)
        
        all_links = baidu_links + alipan_links
        
        for link_info in all_links:
            # 尝试从标题中解析分类信息
            classification = parse_classification_from_title(title)
            
            structured_data.append({
                'title': title,
                'download_url': link_info['url'],
                'password': link_info['password'],
                'classification': classification,
                'link_info': link_info
            })
    
    # 如果没有找到标题-链接对，直接提取所有链接
    if not structured_data:
        all_baidu_links = extract_baidu_pan_info(text)
        all_alipan_links = extract_alipan_info(text)
        all_links = all_baidu_links + all_alipan_links
        
        for link_info in all_links:
            # 这种情况下我们无法获取标题，需要用户手动输入或从链接中猜测
            title = f"未命名资料_{link_info['file_code']}"
            classification = {'grade': '', 'semester': '', 'subject': '', 'version': '', 'type': ''}
            
            structured_data.append({
                'title': title,
                'download_url': link_info['url'],
                'password': link_info['password'],
                'classification': classification,
                'link_info': link_info
            })
    
    return structured_data


def parse_classification_from_title(title):
    """
    从标题中解析分类信息
    """
    # 年级匹配
    grades = [
        ('幼小衔接', r'幼小衔接'),
        ('一年级', r'一[年\s]?级'), 
        ('二年级', r'二[年\s]?级'),
        ('三年级', r'三[年\s]?级'),
        ('四年级', r'四[年\s]?级'),
        ('五年级', r'五[年\s]?级'),
        ('六年级', r'六[年\s]?级'),
        ('七年级', r'[初七][年\s]?级'),
        ('八年级', r'[初二]?[年\s]?级'),
        ('九年级', r'[初三九][年\s]?级'),
        ('高一', r'[高一][年\s]?级'),
        ('高二', r'[高二][年\s]?级'),
        ('高三', r'[高三][年\s]?级')
    ]
    
    grade = ''
    for grade_name, pattern in grades:
        if re.search(pattern, title):
            grade = grade_name
            break
    
    # 学期匹配
    semesters = [
        ('上学期', r'[上下][期学期]'),
        ('下学期', r'下[期学期]')
    ]
    
    semester = ''
    for sem_name, pattern in semesters:
        if re.search(pattern, title):
            semester = sem_name
            break
    
    # 科目匹配
    subjects = [
        ('语文', r'语文|Chinese'),
        ('数学', r'数学|Math'),
        ('英语', r'英语|English'),
        ('物理', r'物理|Physics'),
        ('化学', r'化学|Chemistry'),
        ('生物', r'生物|Biology'),
        ('历史', r'历史|History'),
        ('地理', r'地理|Geography'),
        ('政治', r'政治|思想政治|Politics'),
        ('道德与法治', r'道德与法治|品德|Morality')
    ]
    
    subject = ''
    for subj_name, pattern in subjects:
        if re.search(pattern, title):
            subject = subj_name
            break
    
    # 版本匹配
    versions = [
        ('人教版', r'人教版|人民教育出版社'),
        ('北师大版', r'北师大版|北京师范大学出版社'),
        ('苏教版', r'苏教版|江苏教育出版社'),
        ('统编版', r'统编版|统编'),
        ('沪教版', r'沪教版|上海教育出版社')
    ]
    
    version = ''
    for ver_name, pattern in versions:
        if re.search(pattern, title):
            version = ver_name
            break
    
    # 类型匹配
    types = [
        ('单元测试卷', r'单元[测考][试卷]'),
        ('期中试卷', r'期中[测考][试卷]'),
        ('期末试卷', r'期末[测考][试卷]'),
        ('中考试卷', r'中考[试卷]'),
        ('高考试卷', r'高考[试卷]'),
        ('模拟试卷', r'模拟[测考][试卷]'),
        ('竞赛试卷', r'竞赛[试卷]'),
        ('同步练习册', r'同步练习|课时练'),
        ('专项练习题', r'专项练习'),
        ('课后作业', r'课后作业'),
        ('错题集', r'错题集'),
        ('思维导图', r'思维导图'),
        ('课本同步资料', r'课本同步'),
        ('课堂笔记', r'课堂笔记'),
        ('知识点汇总', r'知识点[汇总整]'),
        ('学习方法指导', r'学习方法'),
        ('解题技巧', r'解题技巧'),
        ('寒假作业', r'寒假作业'),
        ('寒假预习', r'寒假预习'),
        ('寒假复习', r'寒假复习'),
        ('暑假作业', r'暑假作业'),
        ('暑假预习', r'暑假预习'),
        ('暑假复习', r'暑假复习')
    ]
    
    type_ = ''
    for type_name, pattern in types:
        if re.search(pattern, title):
            type_ = type_name
            break
    
    return {
        'grade': grade,
        'semester': semester,
        'subject': subject,
        'version': version,
        'type': type_
    }


def save_to_json(data, output_dir='output'):
    """
    将数据保存为JSON文件
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 生成唯一的文件名
    import time
    timestamp = str(int(time.time()))
    filename = f'data_{timestamp}.json'
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"数据已保存到 {filepath}")
    return filepath


def main():
    print("知识锦囊批量上传脚本")
    print("="*30)
    print("请粘贴包含网盘链接的文本内容（支持百度网盘和阿里云盘）:")
    print("格式示例:")
    print("三年级语文期末试卷  https://pan.baidu.com/s/xxxxxx 提取码: abcd")
    print("或者直接粘贴链接也可以")
    print("-"*30)
    
    # 读取用户输入
    text = []
    while True:
        try:
            line = input()
            if line.strip() == "":
                break
            text.append(line)
        except EOFError:
            break
    
    full_text = "\n".join(text)
    
    if not full_text.strip():
        print("未检测到输入内容，退出...")
        return
    
    # 解析文本
    structured_data = parse_text_to_structured_data(full_text)
    
    if structured_data:
        print(f"\n成功解析出 {len(structured_data)} 条资料信息:")
        for i, item in enumerate(structured_data, 1):
            print(f"{i}. {item['title']}")
            print(f"   链接: {item['download_url']}")
            print(f"   分类: {item['classification']}")
            print()
        
        # 询问是否保存
        save_choice = input("是否保存为JSON文件? (y/n): ").lower()
        if save_choice == 'y' or save_choice == 'yes':
            filepath = save_to_json(structured_data)
            print(f"文件已保存至: {filepath}")
        else:
            print("未保存文件")
    else:
        print("未能解析出任何有效信息，请检查输入格式")


if __name__ == "__main__":
    main()