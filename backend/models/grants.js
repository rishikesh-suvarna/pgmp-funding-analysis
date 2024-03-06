'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class grants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      grants.belongsToMany(models.keywords, { through: 'grantkeywords' })
    }
  }
  grants.init({
    unique_identifier: DataTypes.STRING,
    title: DataTypes.STRING,
    abstract: DataTypes.TEXT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    total_funding: DataTypes.FLOAT,
    status: DataTypes.INTEGER,
    link: DataTypes.STRING,
    confirmation_status: DataTypes.INTEGER, // 0 - NOT YET CONFIRMED, 1 - CONFIRMED, 2 - REJECTED
    api_service: DataTypes.STRING,
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'grants',
  });
  return grants;
};