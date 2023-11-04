const { DataTypes, Op } = require('sequelize')
const sequelize = require('../instances/mysql')

const User = require('./UserModel')

const Product = sequelize.define(
  'Product',
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
    cod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    purchase_price: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    sale_value: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    profit: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    profit_commission: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    commission: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: true
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: true
    },
    qt: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
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
    tableName: 'products',
    timestamps: true
  }
)

User.hasMany(Product)
Product.belongsTo(User)

module.exports = Product
