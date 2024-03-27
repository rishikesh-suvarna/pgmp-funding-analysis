'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

(async () => {
  try {
    await sequelize.authenticate();
    // let res = await sequelize.query('CREATE DATABASE funding_analysis;') //FETCH ALL TABLES
    // await sequelize.query('TRUNCATE TABLE admins;')
    // await sequelize.query('TRUNCATE TABLE donors;')
    // await sequelize.query('ALTER SEQUENCE admins_id_seq RESTART WITH 1;')
    // await sequelize.query('ALTER SEQUENCE donors_id_seq RESTART WITH 1;')
    // console.log(res)
    console.log('Database connected successfully!')
  } catch (error) {
    console.log(error)
    console.log('Database not connected')
  }
})()

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
