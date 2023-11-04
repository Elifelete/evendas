const { DataTypes } = require('sequelize')
const sequelize = require('../instances/mysql')

const User = require('./UserModel')
const Product = require('./ProductModel')

const Loss = sequelize.define(
  'Loss',
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
    comission: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    billed: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ProductId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Product, // 'Movies' would also work
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
    tableName: 'losses',
    timestamps: true
  }
)

User.hasMany(Loss)
Loss.belongsTo(User)

Product.hasMany(Loss)
Loss.belongsTo(Product)

module.exports = Loss
