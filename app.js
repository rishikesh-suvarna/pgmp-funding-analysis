require('dotenv').config()

const express = require('express');
const { default: axios } = require("axios");
const PORT = process.env.PORT || 8000;

const apiRoutes = require('./routes/api');

// Initializing express
const app = express();

app.use(express.json());


// APIs
app.get('/', (req, res) => {
  res.send('Hello, World');
});


app.use("/api", apiRoutes);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
