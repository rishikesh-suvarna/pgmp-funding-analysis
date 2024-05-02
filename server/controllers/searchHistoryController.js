
const { grants, keywords, grantkeyword, search_history, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.fetchAllSearchHistory = async (req, res) => {
    try {
        let page = req.query.page || 1;
        const LIMIT = 10;

        let { rows, count } = await search_history.findAndCountAll({
            include: [
                {
                    model: keywords,
                    as: 'searched_keyword'
                }
            ],
            order:[['created_at', 'DESC']],
            offset: (page - 1) * LIMIT,
            limit: LIMIT
        })

        return res.json({
            history: rows, 
            page: page,
            total: Math.ceil(count/LIMIT)
        })
    } catch (error) {
        console.log(error)
    }
}