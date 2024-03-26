'use strict'

const { grants, keywords, search_history } = require('../models');
const router = require('express').Router()
const { requestKeywordData, fetchKeywordData, setGrantStatus, exportKeywordData } = require("../controllers/grantController");
const { fetchKeywords } = require('../controllers/keywordController');




router.get('/')

router.post('/request-keyword-data', requestKeywordData)

router.get('/fetch-keyword-data', fetchKeywordData)

router.post('/export-keyword-data', exportKeywordData)

router.put('/set-grant-status', setGrantStatus)

router.get('/fetch-keywords', fetchKeywords)


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
        await search_history.destroy({
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