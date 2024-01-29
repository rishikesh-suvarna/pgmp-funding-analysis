'use strict'

const { default: axios } = require("axios");
const router = require('express').Router()



router.get('/', async (req, res) => {
    try {
        let query = req.query.q;
        query = encodeURI(query)
        let response = await axios(`https://cordis.europa.eu/search/en?q=contenttype%3D%27project%27%20AND%20${query}&num=20&srt=Relevance:decreasing&format=json&p=1`)
        let eUGrantArray = []
        // res.json(response.data.hits.hit[0].project)
        response.data.hits.hit.forEach(data => {
            eUGrantArray.push({
                title: data.project.title,
                teaser: data.project.teaser,
                keywords: data.project.keywords,
                totalFunding: data.project.totalCost ? parseFloat(data.project.totalCost)?.toLocaleString('en-us', {
                    style: 'currency',
                    currency: 'EUR',
                }) :  'Not Known',
                startDate: data.project.startDate,
                endDate: data.project.endDate,
                status: data.project.status,
                duration: data.project.duration + " Months",
            })
        })
        res.json({
            provider: 'EU',
            data: eUGrantArray
        });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;