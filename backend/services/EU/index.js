const { default: axios } = require("axios")

const euService = {}

euService.fetchKeywordData = async (keyword, page, num, sortBy='Relevance:decreasing', format='json') => {
    try {
        console.log(keyword, page, num, sortBy, format)
        let response = await axios(`https://cordis.europa.eu/search/en?q=contenttype%3D%27project%27%20AND%20${encodeURI(keyword)}&num=${num}&srt=${sortBy}&format=${format}&p=${page}`)
        let eUGrantArray = []
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
        return eUGrantArray
    } catch (error) {
        console.log(error)
    }
}

module.exports = euService