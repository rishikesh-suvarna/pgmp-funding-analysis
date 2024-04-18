// This service functions to structure the data receieved from differnt APIs according to our database schema.

const { default: axios } = require("axios")
const moment = require("moment");
const { logger } = require("../../utils/logger");


const gtrService = {}

gtrService.fetchKeywordData = async (keyword, page, num) => {
    try {
        let response1 = await axios.get(`https://gtr.ukri.org/gtr/api/projects?q=${encodeURI(keyword)}&p=${page}&s=${num}`)
        let gtrGrantArray = await Promise.all(response1.data.project.map(async (data) => {
            const response2 = await axios.get(`http://gtr.ukri.org/gtr/api/projects/${data.id}/funds`)
            return {
                unique_identifier: data.id,
                title: data.title,
                abstract: data.abstractText,
                start_date: moment(response2.data.fund[0].start).format('YYYY-MM-DD'),
                end_date: moment(response2.data.fund[0].end).format('YYYY-MM-DD'),
                daily_funding: parseFloat(response2.data.fund[0].valuePounds?.amount) / parseFloat(moment(response2.data.fund[0].end).diff(moment(response2.data.fund[0].start), 'days')),
                monthly_funding: parseFloat(response2.data.fund[0].valuePounds?.amount) / parseFloat(moment(response2.data.fund[0].end).diff(moment(response2.data.fund[0].start), 'days') / 30.42),
                total_funding: response2.data.fund[0].valuePounds?.amount,
                status: data.status === 'Closed' ? 0 : 1,
                link: data.href,
                api_service: 'GTR'
            }
        }))
        return gtrGrantArray;
    } catch (error) {
        // console.log(error)
        logger.log({
            level: 'error',
            message: `GTR API Error for page: ${page} on keyword: ${keyword}, Error Stack Trace: ${error}`,
        })
        console.log("GTR API Error")
    }
}

module.exports = gtrService