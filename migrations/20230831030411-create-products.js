'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cod: {
        type: Sequelize.STRING,
        allowNull: true
      },
      purchase_price: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: false
      },
      sale_value: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: false
      },
      profit: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: false
      },
      profit_commission: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: false
      },
      commission: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: true
      },
      thumb: {
        type: Sequelize.STRING,
        allowNull: true
      },
      qt: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: 0
      },
      UserId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products')
  }
}
