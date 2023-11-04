const { DataTypes } = require('sequelize')
const sequelize = require('../instances/mysql')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'users',
    timestamps: true
  }
)

module.exports = User
