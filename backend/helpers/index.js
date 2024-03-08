const { grants, keywords, sequelize } = require("../models");
const euService = require("../services/EU");
const gtrService = require("../services/GTR");
const nsfService = require("../services/NSF");

exports.euServiceFetchNewKeywordData = async (singleKeyword, k) => {
  let page = 1;
  const BATCH_SIZE = 10;
  const LIMIT = process.env.NODE_ENV === "development" ? 10 : 10000;

  // EU Service
  while (true) {
    // FETCH & SAVE FROM EU API
    let data = await euService.fetchKeywordData(
      singleKeyword,
      page,
      BATCH_SIZE
    );
    data.forEach(async (_data) => {
      if (parseFloat(_data.total_funding) > 0) {
        let exGrant = await grants.findOne({
          where: {
            unique_identifier: _data.unique_identifier,
          },
        });
        if (exGrant) {
          await exGrant.addKeyword(k.id);
        } else {
          let _grant = await grants.create(_data);
          await _grant.addKeyword(k.id);
        }
      }
    });
    page++;

    // RATE LIMITING & THROTTLING LOGIC HERE
    if (page > LIMIT) {
      break;
    }
    if (data && data.length < BATCH_SIZE) {
      break;
    }
  }
};

exports.nsfServiceFetchNewKeywordData = async (singleKeyword, k) => {
  let page = 1;
  const BATCH_SIZE = 20;
  const LIMIT = process.env.NODE_ENV === "development" ? 10 : 10000;

  // NSF Service
  while (true) {
    // FETCH & SAVE FROM NSF API
    let data = await nsfService.fetchKeywordData(
      singleKeyword,
      page,
      BATCH_SIZE
    );
    data.forEach(async (_data) => {
      try {
        if (parseFloat(_data.total_funding) > 0) {
          let exGrant = await grants.findOne({
            where: {
              unique_identifier: _data.unique_identifier,
            },
          });
          if (exGrant) {
            await exGrant.addKeyword(k.id);
          } else {
            let _grant = await grants.create(_data);
            await _grant.addKeyword(k.id);
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
    page++;

    // RATE LIMITING & THROTTLING LOGIC HERE
    if (page > LIMIT) {
      break;
    }
    if (data && data.length < BATCH_SIZE) {
      break;
    }
  }
};
