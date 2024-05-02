'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class search_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      search_history.belongsTo(models.keywords, { as: 'searched_keyword', foreignKey: 'keyword_id' })
    }
  }
  search_history.init({
    keyword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    keyword_id: {
      type: DataTypes.INTEGER,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    last_fetched_page: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    last_fetched_timestamp: {
      type: DataTypes.DATE,
    },
    retries: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'search_history',
    tableName: 'search_histories',
    paranoid: true,
    underscored: true,
  });
  return search_history;
};