const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Vercel!' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});