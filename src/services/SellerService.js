const { Op, Sequelize } = require('sequelize')
const bcrypt = require('bcrypt')

const SellerModel = require('../models/SellerModel')
const OrderModel = require('../models/OrderModel')
const ProductModel = require('../models/ProductModel')

const findAll = async (UserId) => {
  try {
    const sellers = await SellerModel.findAll({
      include: OrderModel,
      attributes: [
        'id',
        'name',
        'email',
        'commission',
        'status',
        [Sequelize.fn('SUM', Sequelize.col('qt')), 'totalSales']
      ],
      group: ['Seller.id'],
      where: {
        UserId: UserId
      }
    })

    return sellers
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const findByPk = async (UserId, id) => {
  try {
    const seller = await SellerModel.findByPk(id, {
      include: {
        model: OrderModel,
        include: ProductModel
      },
      where: {
        UserId: UserId
      }
    })

    return seller
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const findOrCreate = async (UserId) => {
  try {
    const password = await bcrypt.hash('password', 8)

    const [independentSeller, created] = await SellerModel.findOrCreate({
      where: { name: 'avulso', UserId: UserId },
      defaults: {
        email: `avulso-${UserId}@admin.com`,
        password: password,
        commission: 0,
        status: 'active'
      }
    })

    return independentSeller
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const findOrders = async (UserId, SellerId, date) => {
  const dateSplit = date ? date.split('-') : null
  const initialDay = dateSplit
    ? new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2])
    : null
  const andDay = initialDay
    ? new Date(initialDay.getTime() + 24 * 60 * 60 * 1000)
    : null

  try {
    const dataFilter = date
      ? {
          createdAt: {
            [Op.between]: [initialDay, andDay]
          }
        }
      : {}

    const orders = await OrderModel.findAll({
      include: ProductModel,
      where: {
        UserId: UserId,
        SellerId: SellerId,
        ...dataFilter
      },
      order: [['id', 'DESC']]
    })

    return orders
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const count = async (UserId) => {
  try {
    const sellerCount = await SellerModel.count({
      where: {
        UserId: UserId
      }
    })

    return sellerCount
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const ordersTotal = async (UserId, SellerId) => {
  try {
    const qt = await OrderModel.sum('qt', {
      where: {
        UserId: UserId,
        SellerId: SellerId
      }
    })

    return qt
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const commissionsTotal = async (UserId, SellerId) => {
  try {
    const commissionsTotal = await OrderModel.sum('commission', {
      where: {
        UserId: UserId,
        SellerId: SellerId
      }
    })

    return commissionsTotal
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const create = async (UserId, data) => {
  const { name, email, password, status } = data
  const commission = 0

  const passwordHash = await bcrypt.hash(password, 8)

  try {
    await SellerModel.create({
      name,
      email,
      password: passwordHash,
      commission,
      status,
      UserId
    })
  } catch (error) {
    console.error('error', error)
    return error
  }
}

module.exports = {
  findAll,
  findByPk,
  findOrCreate,
  count,
  ordersTotal,
  commissionsTotal,
  create,
  findOrders
}
