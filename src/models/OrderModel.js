const { DataTypes } = require('sequelize')
const sequelize = require('../instances/mysql')

const User = require('./UserModel')
const Product = require('./ProductModel')
const Seller = require('./SellerModel')

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    qt: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    profit: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    commission: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    billed: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    loose: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ProductId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Product, // 'Movies' would also work
        key: 'id'
      }
    },
    SellerId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: Seller, // 'Movies' would also work
        key: 'id'
      }
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
    tableName: 'orders',
    timestamps: true
  }
)

User.hasMany(Order)
Order.belongsTo(User)

Product.hasMany(Order)
Order.belongsTo(Product)

Seller.hasMany(Order)
Order.belongsTo(Seller)

module.exports = Order
