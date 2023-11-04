'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      qt: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      profit: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: false
      },
      commission: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: false
      },
      billed: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: false
      },
      loose: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      ProductId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      SellerId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'sellers',
          key: 'id'
        }
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
    await queryInterface.dropTable('orders')
  }
}
