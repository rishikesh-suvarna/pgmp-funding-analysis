'use strict'

const { grants, keywords, sequelize } = require('../models');
const { Op } = require('sequelize');
const { euServiceQueue, nsfServiceQueue, gtrServiceQueue } = require("../helpers");
const moment = require('moment');
const ExcelJS = require('exceljs');
const { logger } = require('../utils/logger');


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
                    keyword: singleKeyword
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
    
                await Promise.all(
                    [
                        euServiceQueue(singleKeyword, _keyword.id),
                        nsfServiceQueue(singleKeyword, _keyword.id),
                        gtrServiceQueue(singleKeyword, _keyword.id)
                        // Add More Services As Needed
                    ]
                )
            }
    
        })

    } catch (error) {
        console.log(error)
        logger.log({
            level: 'error',
            message: error.message
        })
        return res.sendStatus(500)
    }
}

exports.fetchFreshKeywordData = async (req, res) => {
    try {
        let query = req.body.keyword?.split(',');
        let responseSent = false;

        if(!query || query.length < 1) {
            return res.sendStatus(500)
        }

        query.forEach(async (singleKeyword) => {
            //EXISTING KEYWORD DELETE
            let existingKeyword = await keywords.destroy({
                where: {
                    keyword: singleKeyword
                }
            })
            // CREATE NEW KEYWORD
            let _keyword = await keywords.create({
                keyword: singleKeyword
            })
            res.sendStatus(200)
            await Promise.all(
                [
                    euServiceQueue(singleKeyword, _keyword.id),
                    nsfServiceQueue(singleKeyword, _keyword.id),
                    gtrServiceQueue(singleKeyword, _keyword.id)
                    // Add More Services As Needed
                ]
            )
              
        })
    } catch (error) {
        logger.log({
            level: 'error',
            message: error.message
        })
        console.log(error)
        return res.sendStatus(500)
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

        let queryBuilder = {
            where: {
                confirmation_status: req.query.status || 0
            },
            include: [{
                model: keywords,
                where: {
                    [Op.or]: queryKeywords
                }
            }],
            order: [['id', 'DESC']],
            offset: (page - 1) * LIMIT,
            limit: LIMIT
        }

        if(req.query.sort) {
            switch (req.query.sort) {
                case 'relevance':
                    queryBuilder.order = [['id', 'ASC']];
                    break;
                case 'funding_amount_asc':
                    queryBuilder.order = [['total_funding', 'ASC']];
                    break;
                case 'funding_amount_desc':
                    queryBuilder.order = [['total_funding', 'DESC']];
                    break;
                case 'date_started_asc':
                    queryBuilder.order = [['start_date', 'ASC']];
                    break;
                case 'date_started_desc':
                    queryBuilder.order = [['start_date', 'DESC']];
                    break;
                default: 
                    queryBuilder.order = [['id', 'DESC']]
                    break;
            }
        }

        if(req.query.source && req.query.source !== 'ALL') {
            queryBuilder.where['api_service'] = req.query.source
        }

        let { count, rows } = await grants.findAndCountAll(queryBuilder)

        return res.status(200).json({
            data: rows,
            page: page,
            total: Math.ceil(count/LIMIT),
        })
    } catch (error) {
        console.log(error)
        logger.log({
            level: 'error',
            message: error.message
        })
        return res.sendStatus(500)
    }
}

exports.exportKeywordData = async (req, res) => {
    try {

        let queryKeywords = req.query.keyword?.split(',');

        queryKeywords = queryKeywords.map(word => {
            return {
                'keyword':  word
            }
        })

        let queryBuilder = {
            where: {
                confirmation_status: req.query.status || 0
            },
            include: [{
                model: keywords,
                where: {
                    [Op.or]: queryKeywords
                }
            }],
            order: [['id', 'DESC']],
        }

        if(req.query.sort) {
            switch (req.query.sort) {
                case 'relevance':
                    queryBuilder.order = [['id', 'ASC']];
                    break;
                case 'funding_amount_asc':
                    queryBuilder.order = [['total_funding', 'ASC']];
                    break;
                case 'funding_amount_desc':
                    queryBuilder.order = [['total_funding', 'DESC']];
                    break;
                case 'date_started_asc':
                    queryBuilder.order = [['start_date', 'ASC']];
                    break;
                case 'date_started_desc':
                    queryBuilder.order = [['start_date', 'DESC']];
                    break;
                default: 
                    queryBuilder.order = [['id', 'DESC']]
                    break;
            }
        }

        if(req.query.source && req.query.source !== 'ALL') {
            queryBuilder.where['api_service'] = req.query.source
        }

        let data = await grants.findAll(queryBuilder)

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Grant Data');

        worksheet.addRow([
            'ID', 
            'Title', 
            'Start Date',
            'End Date',
            'Total Funding',
            'Daily Funding',
            'Monthly Funding',
            'Status',
            'Keyword',
            'Data Source'
        ]);
        
        data.forEach((data) => {
            worksheet.addRow([
                data.id,
                data.title,
                moment(data.start_date).format('YYYY-MM-DD'),
                moment(data.end_date).format('YYYY-MM-DD'),
                data.total_funding,
                parseFloat((data.daily_funding).toFixed(2)),
                parseFloat((data.monthly_funding).toFixed(2)),
                data.status === 1 ? 'SIGNED' : 'CLOSED',
                data.keywords[0].keyword,
                data.api_service?.toString()
            ]);
        });

        // Set content type and disposition
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=export.xlsx`);

        // Serialize the workbook to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Send the buffer as the response
        res.send(buffer);

        // return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        logger.log({
            level: 'error',
            message: error.message
        })
        return res.sendStatus(500)
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
        logger.log({
            level: 'error',
            message: error.message
        })
        return res.sendStatus(500)
    }
}