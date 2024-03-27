const { search_history } = require('../models');
const { euServiceQueue, nsfServiceQueue, gtrServiceQueue } = require('../helpers');
const { logger } = require('./logger');
const { Op } = require('sequelize');

exports.fetchUnfinishedData = async () => {
    try {
        let data = await search_history.findAll({
            where: {
                is_completed: false,
                retries: {
                    [Op.lt]: 3
                }
            }
        })
        if(data.length) {
            data.forEach(async (history) => {
                history.increment({'retries': 1})
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
        logger.log({
            level: 'error',
            message: error.message
        })
    }
}