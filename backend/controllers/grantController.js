'use strict'


const euService = require("../services/EU");
const nsfService = require("../services/NSF");
const { grants, keywords, sequelize } = require('../models');
const { Op } = require('sequelize');

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
                responseSent = true;
                return res.sendStatus(200)
            }
    
            // NEW KEYWORD
            let _keyword = await keywords.create({
                keyword: singleKeyword
            })

            let page = 1;
            const BATCH_SIZE = 10;
            const LIMIT = process.env.NODE_ENV === 'development' ? 10 : 10000;
            
            // EU Service
            while(true) {
                // FETCH & SAVE FROM EU API
                let data = await euService.fetchKeywordData(singleKeyword, page, BATCH_SIZE)
                data.forEach(async (_data) => {
                    if(parseFloat(_data.total_funding) > 0) {
                        let exGrant = await grants.findOne({
                            where: {
                                unique_identifier: _data.unique_identifier
                            }
                        })
                        if(exGrant) {
                            await exGrant.addKeyword(_keyword.id)
                        } else {
                            let _grant = await grants.create(_data)
                            await _grant.addKeyword(_keyword.id)
                        }
                    }
                })
                page++;
    
                // RATE LIMITING & THROTTLING LOGIC HERE 
                if(page > LIMIT){ 
                    break;
                }
                if(data && (data.length < BATCH_SIZE)) {
                    break;
                }
                if(!responseSent) {
                    responseSent = true;
                    res.sendStatus(200)
                }
            }
            // NSF Service
            while(true) {
                // FETCH & SAVE FROM NSF API
                let data = await nsfService.fetchKeywordData(singleKeyword, page, BATCH_SIZE)
                data.forEach(async (_data) => {
                    try {
                        if(parseFloat(_data.total_funding) > 0) {
                            let exGrant = await grants.findOne({
                                where: {
                                    unique_identifier: _data.unique_identifier
                                }
                            })
                            if(exGrant) {
                                await exGrant.addKeyword(_keyword.id)
                            } else {
                                let _grant = await grants.create(_data)
                                await _grant.addKeyword(_keyword.id)
                            }
                        }

                    } catch (err) {
                        console.log(err)
                    }
                })
                page++;

                // RATE LIMITING & THROTTLING LOGIC HERE 
                if(page > LIMIT){ 
                    break;
                }
                if(data && (data.length < BATCH_SIZE)) {
                    break;
                }
                if(!responseSent) {
                    responseSent = true;
                    res.sendStatus(200)
                }
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