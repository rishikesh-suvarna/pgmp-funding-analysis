'use strict'

const { default: axios } = require("axios");
const euService = require("../services/EU");
const db = require('../models');
const router = require('express').Router()



router.get('/', async (req, res) => {
    try {
        let query = req.query.q;
        let response = await euService.fetchKeywordData(query, 1, 15)
        res.json(response)
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;