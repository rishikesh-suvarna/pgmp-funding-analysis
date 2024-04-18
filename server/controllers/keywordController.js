'use strict'

const euService = require("../services/EU");
const nsfService = require("../services/NSF");
const { grants, keywords, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.fetchKeywords = async (req, res) => {
    try {
        let kwords = await keywords.findAll();
        res.json(kwords) 
    } catch (error) {
        console.log(error)
    }
}