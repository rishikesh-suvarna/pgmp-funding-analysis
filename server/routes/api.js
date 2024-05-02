'use strict'
const router = require('express').Router()

const { grants, keywords, search_history } = require('../models');
const { requestKeywordData, fetchKeywordData, setGrantStatus, exportKeywordData, fetchFreshKeywordData } = require("../controllers/grantController");
const { fetchKeywords } = require('../controllers/keywordController');
const { fetchAllSearchHistory } = require('../controllers/searchHistoryController');




router.get('/')

router.post('/request-keyword-data', requestKeywordData)

router.get('/fetch-keyword-data', fetchKeywordData)

router.post('/export-keyword-data', exportKeywordData)

router.put('/set-grant-status', setGrantStatus)

router.get('/fetch-keywords', fetchKeywords)

router.post('/request-fresh-keyword-data', fetchFreshKeywordData)

router.get('/fetch-history', fetchAllSearchHistory)

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