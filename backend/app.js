require('dotenv').config()

const express = require('express');
const { default: axios } = require("axios");
const PORT = process.env.PORT || 8000;
const cors = require('cors');

const apiRoutes = require('./routes/api');

// Initializing express
const app = express();

console.log(process.env.WHITELIST.split(','))

app.use(express.json());
app.use(cors({
  origin: process.env.WHITELIST,
  optionsSuccessStatus: 200,
}))


// APIs
app.get('/', (req, res) => {
  res.send('Hello, World');
});


app.use("/api", apiRoutes);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
