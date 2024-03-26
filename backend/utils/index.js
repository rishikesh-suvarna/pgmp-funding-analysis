const { grants, keywords, sequelize, search_history } = require('../models');
const { euServiceQueue, nsfServiceQueue, gtrServiceQueue } = require('../helpers');

exports.fetchUnfinishedData = async () => {
    try {
        let data = await search_history.findAll({
            where: {
                is_completed: false
            }
        })
        if(data.length) {
            data.forEach(async (history) => {
                switch(history.source) {
                    case 'EU': {
                        await euServiceQueue(history.keyword, history.keyword_id, history.last_fetched_page)
                        break;
                    }
                    case 'NSF': {
                        await nsfServiceQueue(history.keyword, history.keyword_id, history.last_fetched_page)
                        break;
                    }
                    case 'GTR': {
                        await gtrServiceQueue(history.keyword, history.keyword_id, history.last_fetched_page)
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
        } else {
            console.log('============================ No Unfinished Data to fetch ============================')
        }
    } catch (error) {
        console.log(error)
        this.logger.log({
            level: 'error',
            message: error.message
        })
    }
}