const { default: axios } = require("axios")

const gtrService = {}

gtrService.fetchKeywordData = async (keyword, page, num, sortBy='Relevance:decreasing', format='json') => {
    try {
        console.log(keyword, page, num, sortBy, format)
        console.log("========================================================================================================================")
        let response = await axios(`https://gtr.ukri.org/gtr/api/projects?q=${encodeURI(keyword)}&p=${page}&s=${num}`)
        let gtrGrantArray = []
        response.data.project.forEach(data => {
            gtrGrantArray.push({
                unique_identifier: data.id,
                title: data.title,
                abstract: data.abstractText,
                // start_date: data.startDate,
                // end_date: data.endDate,
                // total_funding: data.project.totalCost,
                status: data.status === 'CLOSED' ? 0 : 1,
                link: data.href,
                api_service: 'GTR'
            })
        })
        return gtrGrantArray
    } catch (error) {
        console.log(error)
    }
}

module.exports = gtrService