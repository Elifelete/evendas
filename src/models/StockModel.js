const { DataTypes } = require('sequelize')
const sequelize = require('../instances/mysql')

const User = require('./UserModel')
const Product = require('./ProductModel')

const Stock = sequelize.define(
  'Stock',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    qt: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0
    },
    cod: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    total: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    ProductId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Product,
        key: 'id'
      }
    },
    UserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    tableName: 'stocks',
    timestamps: true
  }
)

User.hasMany(Stock)
Stock.belongsTo(User)

Product.hasMany(Stock)
Stock.belongsTo(Product)

module.exports = Stock
