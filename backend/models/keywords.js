'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class keywords extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      keywords.belongsToMany(models.grants, { through: 'grantkeywords' })
    }
  }
  keywords.init({
    unique_identifier: DataTypes.STRING,
    keyword: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'keywords',
  });
  return keywords;
};