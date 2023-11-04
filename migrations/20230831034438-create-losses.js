'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('losses', {
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
      comission: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: false
      },
      billed: {
        type: Sequelize.DOUBLE(8, 2),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ProductId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'products',
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
    await queryInterface.dropTable('losses')
  }
}
