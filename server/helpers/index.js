const axios = require('axios');

const { grants, search_history } = require("../models");
const euService = require("../services/EU");
const gtrService = require("../services/GTR");
const nsfService = require("../services/NSF");
const { logger } = require("../utils/logger");

const saveDatatoDatabase = async (singleKeyword, k, data) => {
  try {
    if(data?.length) {
      data.forEach(async (_data) => {
        if (parseFloat(_data.total_funding) > 0) {
          let exGrant = await grants.findOne({
            where: {
              unique_identifier: _data.unique_identifier,
            },
          });
          if (exGrant) {
            await exGrant.addKeyword(k);
          } else {
            let response = await calculateRelevance(singleKeyword, _data.abstract)
            _data.relevance_score = response
            let _grant = await grants.create(_data);
            await _grant.addKeyword(k);
          }
        }
      });
    } else {
      logger.log({
        level: "error",
        message: `Fetched data error ${error}`,
      });
      console.error(`Fetched data error ${error}`);
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: `Database save error ${error}`,
    });
    console.error(`Database save error ${error}`);
  }
};

const calculateRelevance = async (singleKeyword, abstract) => {
  try {
    let response = await axios.post(`${process.env.BACKEND_URL}/calculate_relevance`, {
      keyword: singleKeyword,
      description: abstract
    })
    return response.data?.relevance_score
  } catch (error) {
    logger.log({
      level: "error",
      message: `Relevance fetch error ${error}`,
    });
    console.error(`Relevance fetch error ${error}`);
    return null
  }
}

exports.euServiceQueue = async (singleKeyword, k, startPage = 1) => {
  try {
    let page = startPage; //Default 1 passed in params
    const BATCH_SIZE = 10;
    const LIMIT = process.env.NODE_ENV === "development" ? 10 : 10000;
  
    let [s_history, created] = await search_history.findOrCreate({
      where: {
        keyword: singleKeyword,
        source: "EU",
        keyword_id: k,
        is_completed: false,
      }
    });
  
    while (true) {
      const [{status, value}, _] = await Promise.allSettled([
        euService.fetchKeywordData(singleKeyword, page, BATCH_SIZE),
        new Promise((_, reject) => setTimeout(() => {_()}, process.env.THROTTLING_TIME)), // Timeout promise for throttling
      ]);

      if (process.env.NODE_ENV === "development") {
        console.log(`Fetching from EU service for keyword: ${singleKeyword}, page: ${page}`);
      }
      logger.log({
        level: 'info',
        message: `Fetching from EU service for keyword: ${singleKeyword}, page: ${page}`
      })
  
      await saveDatatoDatabase(singleKeyword, k, value);
      s_history.last_fetched_page = page;
      s_history.last_fetched_timestamp = new Date();
      s_history.save()
  
      page++;
  
      if (page > LIMIT || (value && value.length < BATCH_SIZE)) {
        console.log(`EU Service fetching completed for keyword: ${singleKeyword}`);
        s_history.is_completed = true;
        s_history.save();
        logger.log({
          level: 'info',
          message: `EU Service fetching completed for keyword: ${singleKeyword}`
        })
        break;
      }
    }
  } catch (error) {
    console.log(error)
    logger.log({
      level: 'error',
      message: error.message
    })
  }
};

exports.nsfServiceQueue = async (singleKeyword, k, startPage = 1) => {
  try {
    let page = startPage;
    const BATCH_SIZE = 20;
    const LIMIT = process.env.NODE_ENV === "development" ? 10 : 10000;
  
    let [s_history, created] = await search_history.findOrCreate({
      where: {
        keyword: singleKeyword,
        source: "NSF",
        keyword_id: k,
        is_completed: false,
      }
    });
  
    while (true) {
      const [{status, value}, _] = await Promise.allSettled([
        nsfService.fetchKeywordData(singleKeyword, page, BATCH_SIZE),
        new Promise((_, reject) => setTimeout(() => {_()}, process.env.THROTTLING_TIME)), // Timeout promise for throttling
      ]);
  
      if (process.env.NODE_ENV === "development") {
        console.log(
          `Fetching from NSF service for keyword: ${singleKeyword}, page: ${page}`
        );
      }
      logger.log({
        level: 'info',
        message: `Fetching from NSF service for keyword: ${singleKeyword}, page: ${page}`
      })
  
      await saveDatatoDatabase(singleKeyword, k, value);
      s_history.last_fetched_page = page;
      s_history.last_fetched_timestamp = new Date();
      s_history.save()
  
      page++;
  
      if (page > LIMIT || (value && value.length < BATCH_SIZE)) {
        console.log(
          `NSF Service fetching completed for keyword: ${singleKeyword}`
        );
        s_history.is_completed = true;
        s_history.save();
        logger.log({
          level: 'info',
          message: `NSF Service fetching completed for keyword: ${singleKeyword}`
        })
        break;
      }
    }
  } catch (error) {
    console.log(error)
    logger.log({
      level: 'error',
      message: error.message
    })
  }
};

exports.gtrServiceQueue = async (singleKeyword, k, startPage = 1) => {
  try {
    let page = startPage;
    const BATCH_SIZE = 10;
    const LIMIT = process.env.NODE_ENV === "development" ? 10 : 10000;
  
    let [s_history, created] = await search_history.findOrCreate({
      where: {
        keyword: singleKeyword,
        source: "GTR",
        keyword_id: k,
        is_completed: false,
      }
    });
  
    // GTR Service
    while (true) {
      const [{status, value}, _] = await Promise.allSettled([
        gtrService.fetchKeywordData(singleKeyword, page, BATCH_SIZE),
        new Promise((_, reject) => setTimeout(() => {_()}, process.env.THROTTLING_TIME)), // Timeout promise for throttling
      ]);
  
      if (process.env.NODE_ENV === "development") {
        console.log(
          `Fetching from GTR service for keyword: ${singleKeyword}, page: ${page}`
        );
      }
      logger.log({
        level: 'info',
        message: `Fetching from GTR service for keyword: ${singleKeyword}, page: ${page}`
      })
  
      await saveDatatoDatabase(singleKeyword, k, value);
      s_history.last_fetched_page = page;
      s_history.last_fetched_timestamp = new Date();
      s_history.save()
  
      page++;
  
      if (page > LIMIT || (value && value.length < BATCH_SIZE)) {
        console.log(
          `GTR Service fetching completed for keyword: ${singleKeyword}`
        );
        s_history.is_completed = true;
        s_history.save();
        logger.log({
          level: 'info',
          message: `GTR Service fetching completed for keyword: ${singleKeyword}`
        })
        break;
      }
    }
  } catch (error) {
    console.log(error)
    logger.log({
      level: 'error',
      message: error.message
    })
  }
};

// Add new service queue here.
