const StockModel = require('../models/StockModel')
const ProductModel = require('../models/ProductModel')

const ProductService = require('../services/ProductService')

const findAll = async (UserId) => {
  try {
    const stocks = await StockModel.findAll({
      include: ProductModel,
      where: {
        UserId: UserId
      },
      order: [['id', 'DESC']]
    })

    return stocks
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const count = async (UserId) => {
  try {
    const stockCount = await StockModel.count({
      where: {
        UserId: UserId
      }
    })

    return stockCount
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const totalQt = async (UserId) => {
  try {
    const total = await ProductModel.sum('qt', {
      where: {
        UserId: UserId
      }
    })
    return total
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const create = async (UserId, ProductId, qt) => {
  try {
    const product = await ProductService.findByPk(UserId, ProductId)
    const total = Number(product.sale_value) * Number(qt)

    StockModel.create({
      qt,
      cod: product.cod,
      total,
      ProductId,
      UserId
    })

    product.qt = Number(product.qt) + Number(qt)
    product.save()
  } catch (error) {
    console.error('Failed to create', error)
    return error
  }
}

module.exports = {
  findAll,
  count,
  totalQt,
  create
}
