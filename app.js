require('dotenv').config()

const express = require('express'),
    PORT = process.env.PORT || 8000;

// Initializing express
const app = express();


// APIs
app.get('/', (req, res) => {
  res.send('Hello, World');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
