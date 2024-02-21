'use strict'

const { default: axios } = require("axios");
const euService = require("../services/EU");
const { grants, keywords } = require('../models');
const router = require('express').Router()

router.get('/add', async (req, res) => {
    try {
        let data = {
            unique_identifier: "123456789",
            title: "Test Title",
            abstract: "Test Title",
            start_date: new Date(),
            end_date: new Date(),
            total_funding: 12000000.50,
            status: 0,
            link: "https://link.com",
            deleted: false,
        }
        let _grant = await grants.create(data)
        await _grant.addKeyword(6)
        return res.redirect('/test/view')
    } catch (error) {
        console.log(error)
    }
})

router.get('/add-keyword', async (req, res) => {
    try {
        let keyword_data = {
            unique_identifier: "123456789",
            keyword: "IOT",
        }
        await keywords.create(keyword_data)
        return res.redirect('/test/view-keywords')
    } catch (error) {
        console.log(error)
    }
})

router.get('/view', async (req, res) => {
    try {
        let grantData = await grants.findAll({
            order: [['id', 'ASC']],
            include: [keywords]
        });
        res.json(grantData)
    } catch (error) {
        console.log(error)
    }
})

router.get('/view-keywords', async (req, res) => {
    try {
        let keywordsData = await keywords.findAll({
            where: {
                keyword: req.query.q
            },
            include: [grants],
            order: [[grants, 'id', 'DESC']]
        });
        res.json(keywordsData)
    } catch (error) {
        console.log(error)
    }
})

router.get('/delete', async (req, res) => {
    try {
        await grants.destroy({
            where: {},
            // truncate: true
        })
        await keywords.destroy({
            where: {},
            // truncate: true
        })
        return res.redirect('/test/view')
    } catch (error) {
        console.log(error)
    }
})

router.get('/delete-keyword', async (req, res) => {
    try {
        let data = await keywords.destroy({
            where: {
                id: 7
            },
            returning: true
        })
        return res.redirect('/test/view-keywords')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;