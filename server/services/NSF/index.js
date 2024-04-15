// This service functions to structure the data receieved from differnt APIs according to our database schema.

const { default: axios } = require("axios");
const moment = require("moment");

const nsfService = {}

nsfService.fetchKeywordData = async (keyword, page=1, num=25) => {
    try {
        // console.log(keyword, page, num)
        let response = await axios.get(`https://www.research.gov/awardapi-service/v1/awards.json?keyword=${keyword}&rpp=${num}&offset=${(num * page) + 1}&printFields=title,abstractText,id,agency,date,startDate,expDate,estimatedTotalAmt,fundsObligatedAmt,fundProgramName,awardee,publicationResearch`)
        let nsfGrantArray = [];
        response.data.response.award.forEach(award => {
            let startDate = moment(`${award.startDate.split('/')[2]}-${award.startDate.split('/')[0]}-${award.startDate.split('/')[1]}`);
            let endDate = moment(`${award.expDate.split('/')[2]}-${award.expDate.split('/')[0]}-${award.expDate.split('/')[1]}`);
            nsfGrantArray.push({
                unique_identifier: award.id,
                title: award.title,
                abstract: award.abstractText,
                start_date: startDate,
                end_date: endDate,
                total_funding: award.estimatedTotalAmt,
                daily_funding: parseFloat(award.estimatedTotalAmt) / parseFloat(moment(endDate).diff(moment(startDate), 'days')),
                monthly_funding: parseFloat(award.estimatedTotalAmt) / parseFloat(moment(endDate).diff(moment(startDate), 'days') / 30.42),
                // status: award.status === 'SIGNED' ? 1 : 0,
                link: null,
                api_service: award.agency ? award.agency : 'NSF'
            })
        })
        return nsfGrantArray;

    } catch (error) {
        console.log(error)
    }
}

module.exports = nsfService;