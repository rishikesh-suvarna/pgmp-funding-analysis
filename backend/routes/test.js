'use strict'

const { default: axios } = require("axios");
const euService = require("../services/EU");
const { grants } = require('../models');
const { keywords } = require('../models');
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
            deleted: false
        }
        await grants.create(data)
        return res.redirect('/test/view')
    } catch (error) {
        console.log(error)
    }
})

router.get('/add-keyword', async (req, res) => {
    try {
        let keyword_data = {
            unique_identifier: "123456789",
            keyword: "Test Keyword",
        }
        await keywords.create(keyword_data)
        return res.redirect('/test/view')
    } catch (error) {
        console.log(error)
    }
})

router.get('/view', async (req, res) => {
    try {
        let grantData = await grants.findAll();
        res.json(grantData)
    } catch (error) {
        console.log(error)
    }
})

router.get('/delete', async (req, res) => {
    try {
        let data = await grants.destroy({
            where: {
                id: 2
            },
            returning: true
        })
        return res.redirect('/test/view')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;