'use strict'

const { default: axios } = require("axios");
const euService = require("../services/EU");
const { grants, keywords, sequelize } = require('../models');
const router = require('express').Router()
const { Op } = require('sequelize');
const nsfService = require("../services/NSF");




router.get('/', async (req, res) => {
    try {
        const LIMIT = 10;
        let query = req.query.q;
        let page = 1;
        const BATCH_SIZE = 10;
        let _keyword = await keywords.create({
            keyword: query
        })
        while(true) {
            let data = await euService.fetchKeywordData(query, page, BATCH_SIZE)
            data.forEach(async (_data) => {
                let _grant = await grants.create(_data)
                await _grant.addKeyword(_keyword.id)
            })
            page++;

            /* 
                RATE LIMITING LOGIC HERE 
            */
            if(page > LIMIT){ 
                break;
            }
            if(response && (response.length < BATCH_SIZE)) {
                break;
            }
        }
        return res.sendStatus(200)
        
    } catch (error) {
        console.log(error)
    }
})

router.post('/request-keyword-data', async (req, res) => {
    try {
        let query = req.body.keyword?.split(',');
        let responseSent = false;

        // return console.log(req.body.keyword)

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
            let page = 1;
            const BATCH_SIZE = 10;
            const LIMIT = process.env.NODE_ENV === 'development' ? 10 : 10000;
            let _keyword = await keywords.create({
                keyword: singleKeyword
            })
            // EU Service
            // while(true) {
            //     // FETCH & SAVE FROM EU API
            //     let data = await euService.fetchKeywordData(singleKeyword, page, BATCH_SIZE)
            //     data.forEach(async (_data) => {
            //         if(parseFloat(_data.total_funding) > 0) {
            //             let exGrant = await grants.findOne({
            //                 where: {
            //                     title: _data.title
            //                 }
            //             })
            //             if(exGrant) {
            //                 await exGrant.addKeyword(_keyword.id)
            //             } else {
            //                 let _grant = await grants.create(_data)
            //                 await _grant.addKeyword(_keyword.id)
            //             }
            //         }
            //     })
            //     page++;
    
            //     // RATE LIMITING & THROTTLING LOGIC HERE 
            //     if(page > LIMIT){ 
            //         break;
            //     }
            //     if(data && (data.length < BATCH_SIZE)) {
            //         break;
            //     }
            //     if(!responseSent) {
            //         responseSent = true;
            //         res.sendStatus(200)
            //     }
            // }
            // NSF Service
            while(true) {
                // FETCH & SAVE FROM EU API
                let data = await nsfService.fetchKeywordData(singleKeyword, page, BATCH_SIZE)
                data.forEach(async (_data) => {
                    try {
                        if(parseFloat(_data.total_funding) > 0) {
                            let exGrant = await grants.findOne({
                                where: {
                                    title: _data.title
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
})

router.get('/fetch-keyword-data', async (req, res) => {
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
        console.log(rows.map(r => r.title))
        return res.status(200).json({
            data: rows,
            page: page,
            total: count
        })




    } catch (error) {
        console.log(error)
        res.status(500).json({
            error
        })
    }
})

router.put('/set-grant-status', async (req, res) => {
    try {
        console.log(req.body)
        let updatedRecord = {
            confirmation_status: req.body.status
        }
        let grantData = await grants.update(updatedRecord, {
            where: {
                id: req.body.id
            }
        })

        res.sendStatus(200);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error
        })
    }
})

router.get('/fetch-keywords', async (req, res) => {
    try {
        let kwords = await keywords.findAll();
        res.json(kwords)        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error
        })
    }
})


router.get('/delete-all', async (req, res) => {
    try {
        await grants.destroy({
            where: {},
            truncate: true,
            cascade: true
        })
        await keywords.destroy({
            where: {},
            truncate: true,
            cascade: true
        })
        return res.sendStatus(200)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
})

module.exports = router;