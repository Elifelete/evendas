const { Op } = require('sequelize')
const ProductModel = require('../models/ProductModel')

const findAll = async (UserId) => {
  try {
    const products = await ProductModel.findAll({
      where: {
        UserId: UserId
      }
    })

    return products
  } catch (error) {
    console.error('error on service', error)
    return error
  }
}

const findByPk = async (UserId, id) => {
  try {
    const products = await ProductModel.findByPk(id, {
      where: {
        UserId: UserId
      }
    })

    return products
  } catch (error) {
    console.error('error on service', error)
    return error
  }
}

const findAvailable = async (UserId) => {
  try {
    const products = await ProductModel.findAll({
      where: {
        UserId: UserId,
        qt: {
          [Op.gt]: 0
        }
      }
    })

    return products
  } catch (error) {
    console.error('error on service', error)
    return error
  }
}

const count = async (UserId) => {
  try {
    const total = await ProductModel.count({
      where: {
        UserId: UserId
      }
    })

    return total
  } catch (error) {
    console.error('error on service', error)
    return error
  }
}

const create = async (UserId, data) => {
  let { name, purchase_price, sale_value, commission } = data

  purchase_price = Number(purchase_price.replace(/[^\d.]/g, '') / 100)
  sale_value = Number(sale_value.replace(/[^\d.]/g, '') / 100)

  const calcCommission = (sale_value * commission) / 100
  const profit = sale_value - purchase_price
  const profit_commission = profit - calcCommission
  const cod = Math.floor(Math.random() * 9000) + 1000

  try {
    await ProductModel.create({
      name,
      cod,
      purchase_price,
      sale_value,
      profit,
      profit_commission,
      commission,
      UserId
    })
  } catch (error) {
    console.error('error on service', error)
    return error
  }
}

module.exports = {
  findAll,
  findByPk,
  findAvailable,
  count,
  create
}
