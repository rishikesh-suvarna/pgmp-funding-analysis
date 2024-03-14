const { grants } = require("../models");
const euService = require("../services/EU");
const gtrService = require("../services/GTR");
const nsfService = require("../services/NSF");

const saveDatatoDatabase = async (data, k) => {
	try {
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
	} catch (error) {
		console.error(error)
	}
}

exports.euServiceQueue = async (singleKeyword, k) => {
  let page = 1;
  const BATCH_SIZE = 10;
  const LIMIT = process.env.NODE_ENV === "development" ? 10 : 10000;

  while(true) {

    const data = await Promise.race([
      euService.fetchKeywordData(singleKeyword,page,BATCH_SIZE),
      new Promise((_, reject) => setTimeout(() => {}, 500)) // Timeout promise for throttling
    ]);

    if(process.env.NODE_ENV === "development") {
      console.log(`Fetching from EU service for keyword: ${singleKeyword}, page: ${page}`)
    }

    await saveDatatoDatabase(data, k)
    
    page++;
  
    if (page > LIMIT || (data && data.length < BATCH_SIZE)) {
		console.log(`EU Service fetching completed for keyword: ${singleKeyword}`)
      	break;
    }
  }

};

exports.nsfServiceQueue = async (singleKeyword, k) => {
  let page = 1;
  const BATCH_SIZE = 20;
  const LIMIT = process.env.NODE_ENV === "development" ? 10 : 10000;

  while (true) {
    const data = await Promise.race([
      nsfService.fetchKeywordData(singleKeyword,page,BATCH_SIZE),
      new Promise((_, reject) => setTimeout(() => {}, 500)) // Timeout promise for throttling
    ]);

    if(process.env.NODE_ENV === "development") {
      console.log(`Fetching from NSF service for keyword: ${singleKeyword}, page: ${page}`)
    }

	await saveDatatoDatabase(data, k)

    page++;

    if (page > LIMIT || (data && data.length < BATCH_SIZE)) {
		console.log(`NSF Service fetching completed for keyword: ${singleKeyword}`)
		break;
	}
  }
};

exports.gtrServiceQueue = async (singleKeyword, k) => {
  let page = 1;
  const BATCH_SIZE = 10;
  const LIMIT = process.env.NODE_ENV === "development" ? 10 : 10000;

  // GTR Service
  while (true) {
    const data = await Promise.race([
      gtrService.fetchKeywordData(singleKeyword,page,BATCH_SIZE),
      new Promise((_, reject) => setTimeout(() => {}, 500)) // Timeout promise for throttling
    ]);

    if(process.env.NODE_ENV === "development") {
      console.log(`Fetching from GTR service for keyword: ${singleKeyword}, page: ${page}`)
    }

	await saveDatatoDatabase(data, k)

    page++;

    if (page > LIMIT || (data && data.length < BATCH_SIZE)) {
		console.log(`GTR Service fetching completed for keyword: ${singleKeyword}`)
		break;
	}
  }
};
