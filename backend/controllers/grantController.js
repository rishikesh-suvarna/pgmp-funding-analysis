'use strict'


const euService = require("../services/EU");
const nsfService = require("../services/NSF");
const { grants, keywords, sequelize } = require('../models');
const { Op } = require('sequelize');
const { euServiceFetchNewKeywordData, nsfServiceFetchNewKeywordData, gtrServiceFetchNewKeywordData } = require("../helpers");

exports.requestKeywordData = async (req, res) => {
    try {
        let query = req.body.keyword?.split(',');
        let responseSent = false;

        if(!query || query.length < 1) {
            return res.sendStatus(500)
        }

        query.forEach(async (singleKeyword) => {
        
            //EXISTING KEYWORD CHECK
            let existingKeyword = await keywords.findOne({
                where: {
                    keyword: {
                        [Op.iRegexp]: sequelize.literal(`'${singleKeyword}'`),
                    }
                }
            })
            if(existingKeyword) {
                if(!responseSent) {
                    responseSent = true;
                    res.sendStatus(200)
                }
            } else {
                if(!responseSent) {
                    responseSent = true;
                    res.sendStatus(200)
                }
                // NEW KEYWORD
                let _keyword = await keywords.create({
                    keyword: singleKeyword
                })
    
                // EU Service
                await euServiceFetchNewKeywordData(singleKeyword, _keyword)
                // NSF Service
                await nsfServiceFetchNewKeywordData(singleKeyword, _keyword)
                // GTR Service
                await gtrServiceFetchNewKeywordData(singleKeyword, _keyword)
            }
    
        })

    } catch (error) {
        console.log(error)
    }
}

exports.fetchKeywordData = async (req, res) => {
    try {
        let page = req.query.page || 1;
        const LIMIT = 12;

        if(!req.query.keyword) {
            return res.sendStatus(500)
        }

        let queryKeywords = req.query.keyword?.split(',');

        queryKeywords = queryKeywords.map(word => {
            return {
                'keyword':  word
            }
        })

        let { count, rows } = await grants.findAndCountAll({
            where: {
                confirmation_status: req.query.status || 0
            },
            include: [{
                model: keywords,
                where: {
                    [Op.or]: queryKeywords
                }
            }],
            order: [['id', 'ASC']],
            offset: (page - 1) * LIMIT,
            limit: LIMIT
        })
        return res.status(200).json({
            data: rows,
            page: page,
            total: count
        })
    } catch (error) {
        console.log(error)
    }
}

exports.setGrantStatus = async (req, res) => {
    try {
        if(req.body.id) {
            let updatedRecord = {
                confirmation_status: req.body.status
            }
            let grantData = await grants.update(updatedRecord, {
                where: {
                    id: req.body.id
                }
            })
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
    }
}