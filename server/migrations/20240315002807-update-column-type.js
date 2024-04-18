'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('grants', 'daily_funding', {
      type: Sequelize.FLOAT,
      allowNull: false
    });
    await queryInterface.changeColumn('grants', 'monthly_funding', {
      type: Sequelize.FLOAT,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("grants", "daily_funding", {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn("grants", "monthly_funding", {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
