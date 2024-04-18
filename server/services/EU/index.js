// This service functions to structure the data receieved from differnt APIs according to our database schema.

const { default: axios } = require("axios")
const moment = require('moment')
const { logger } = require("../../utils/logger")


const euService = {}

euService.fetchKeywordData = async (keyword, page, num, sortBy='Relevance:decreasing', format='json') => {
    try {
        // console.log(keyword, page, num, sortBy, format)
        let response = await axios.get(`https://cordis.europa.eu/search/en?q=contenttype%3D%27project%27%20AND%20${encodeURI(keyword)}&num=${num}&srt=${sortBy}&format=${format}&p=${page}`)
        let eUGrantArray = []
        response.data.hits.hit.forEach(data => {
            eUGrantArray.push({
                unique_identifier: data.project.id,
                title: data.project.title,
                abstract: data.project.objective,
                start_date: data.project.startDate,
                end_date: data.project.endDate,
                total_funding: data.project.totalCost,
                daily_funding: parseFloat(data.project.totalCost) / parseFloat(moment(data.project.endDate).diff(moment(data.project.startDate), 'days')),
                monthly_funding: parseFloat(data.project.totalCost) / parseFloat(moment(data.project.endDate).diff(moment(data.project.startDate), 'days') / 30.42),
                status: data.project.status === 'SIGNED' ? 1 : 0,
                link: null,
                api_service: 'EU',
            })
        })
        return eUGrantArray
    } catch (error) {
        // console.log(error)
        logger.log({
            level: 'error',
            message: `EU API Error for page: ${page} on keyword: ${keyword}, Error Stack Trace: ${error}`,
        })
        console.log("EU API Error")
    }
}

module.exports = euService