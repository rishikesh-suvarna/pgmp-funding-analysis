require('dotenv').config()

const express = require('express');
const { default: axios } = require("axios");
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const winston = require('winston');

const db = require('./models')
const apiRoutes = require('./routes/api');
const testRoutes = require('./routes/test');
const { logger } = require('./utils/logger');
const { fetchUnfinishedData } = require('./utils');

// Initializing express
const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.WHITELIST,
  optionsSuccessStatus: 200,
}))


// API Routes
app.use("/api", apiRoutes);
app.use("/test", testRoutes);

// To Fetch all unfinished data, will run when application is restarts
fetchUnfinishedData()

// CRON job to fetch unfinished data.
require('./cron')

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
