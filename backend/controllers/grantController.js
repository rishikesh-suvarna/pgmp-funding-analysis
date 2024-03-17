'use strict'

const { grants, keywords, sequelize } = require('../models');
const { Op } = require('sequelize');
const { euServiceQueue, nsfServiceQueue, gtrServiceQueue } = require("../helpers");
const moment = require('moment');
const ExcelJS = require('exceljs');


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
    
                Promise.allSettled(
                    [
                        euServiceQueue(singleKeyword, _keyword),
                        nsfServiceQueue(singleKeyword, _keyword),
                        gtrServiceQueue(singleKeyword, _keyword)
                        // Add More Services As Needed
                    ]
                )
            }
    
        })

    } catch (error) {
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

        let data = await grants.findAll({
            where: {
                confirmation_status: req.query.status || 0
            },
            include: [{
                model: keywords,
                where: {
                    [Op.or]: queryKeywords
                }
            }],
            order: [['id', 'ASC']]
        })

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        worksheet.addRow([
            'ID', 
            'Title', 
            'Start Date',
            'End Date',
            'Total Funding',
            'Daily Funding',
            'Monthly Funding',
            'Status',
            'Keyword'
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
                data.keywords[0].keyword
            ]);
        });

        // Set content type and disposition
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');

        // Serialize the workbook to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Send the buffer as the response
        res.send(buffer);

        // return res.status(200).json(data)
    } catch (error) {
        console.log(error)
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
        return res.sendStatus(500)
    }
}