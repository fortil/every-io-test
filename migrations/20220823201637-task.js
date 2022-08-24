"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      ownerId: Sequelize.DataTypes.INTEGER,
      title: Sequelize.DataTypes.STRING,
      description: Sequelize.DataTypes.STRING,
      status: Sequelize.DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  },
};
