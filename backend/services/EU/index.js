const { default: axios } = require("axios")

const euService = {}

euService.fetchKeywordData = async (keyword, page, num, sortBy='Relevance:decreasing', format='json') => {
    try {
        console.log(keyword, page, num, sortBy, format)
        console.log("========================================================================================================================")
        let response = await axios(`https://cordis.europa.eu/search/en?q=contenttype%3D%27project%27%20AND%20${encodeURI(keyword)}&num=${num}&srt=${sortBy}&format=${format}&p=${page}`)
        let eUGrantArray = []
        response.data.hits.hit.forEach(data => {
            eUGrantArray.push({
                unique_identifier: data.project.identifiers?.grantDoi,
                title: data.project.title,
                abstract: data.project.objective,
                start_date: data.project.startDate,
                end_date: data.project.endDate,
                total_funding: data.project.totalCost,
                status: data.project.status === 'SIGNED' ? 1 : 0,
                link: null,
                api_service: 'EU'
            })
        })
        return eUGrantArray
    } catch (error) {
        console.log(error)
    }
}

module.exports = euService