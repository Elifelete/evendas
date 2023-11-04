const { DataTypes } = require('sequelize')
const sequelize = require('../instances/mysql')

const User = require('./UserModel')

const Seller = sequelize.define(
  'Seller',
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
    commission: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    UserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User, // 'Movies' would also work
        key: 'id'
      }
    }
  },
  {
    tableName: 'sellers',
    timestamps: true
  }
)

User.hasMany(Seller)
Seller.belongsTo(User)

module.exports = Seller
