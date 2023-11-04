const { Op } = require('sequelize')

const OrderModel = require('../models/OrderModel')
const ProductModel = require('../models/ProductModel')
const SellerModel = require('../models/SellerModel')

const findAll = async ({ UserId, date }) => {
  try {
    orders = await OrderModel.findAll({
      include: [{ model: ProductModel }, { model: SellerModel }],
      where: {
        UserId: UserId,
        createdAt: {
          [Op.between]: [date.initialDay, date.andDay]
        }
      },
      order: [['id', 'DESC']]
    })

    return orders
  } catch (error) {
    return error
  }
}

const findPk = async ({ UserId, id }) => {
  try {
    const order = await OrderModel.findByPk(id, {
      include: [{ model: ProductModel }, { model: SellerModel }],
      where: {
        UserId: UserId
      }
    })

    return order
  } catch (error) {
    return error
  }
}

const countQt = async ({ UserId, date }) => {
  try {
    let totalOrders = await OrderModel.sum('qt', {
      where: {
        UserId: UserId
      }
    })

    if (date) {
      totalOrders = await OrderModel.sum('qt', {
        where: {
          UserId: UserId,
          createdAt: {
            [Op.between]: [date.initialDay, date.andDay]
          }
        }
      })
    }

    return totalOrders
  } catch (error) {
    return error
  }
}

const countBilled = async ({ UserId, date }) => {
  try {
    let total = await OrderModel.sum('billed', {
      where: {
        UserId: UserId
      }
    })

    if (date) {
      total = await OrderModel.sum('billed', {
        where: {
          UserId: UserId,
          createdAt: {
            [Op.between]: [date.initialDay, date.andDay]
          }
        }
      })
    }

    return total
  } catch (error) {
    return error
  }
}

const bulkCreate = async (data) => {
  try {
    await OrderModel.bulkCreate(data)
  } catch (error) {
    return error
  }
}

const createOrders = async ({ UserId, seller, orders }) => {
  try {
    const findSeller = await SellerModel.findByPk(seller, {
      where: {
        UserId: UserId
      }
    })

    const isRetailer = findSeller.name == 'avulso'

    const listOrders = await Promise.all(
      orders.map(async (item) => {
        const product = await ProductModel.findByPk(item.productId, {
          where: {
            UserId: UserId
          }
        })

        const billed = (await product.sale_value) * item.qt
        const commission = (billed * product.commission) / 100

        let profit = ''
        let loose = false

        if (isRetailer) {
          profit = (await product.profit) * item.qt
          loose = true
        } else {
          profit = (await product.profit_commission) * item.qt
        }

        product.qt -= item.qt
        findSeller.commission += commission
        await product.save()
        await findSeller.save()

        return {
          qt: item.qt,
          profit,
          commission,
          billed,
          loose,
          ProductId: Number(item.productId),
          SellerId: Number(seller),
          UserId
        }
      })
    )

    await OrderModel.bulkCreate(listOrders)
  } catch (error) {
    return error
  }
}

module.exports = {
  findAll,
  findPk,
  countQt,
  countBilled,
  createOrders,
  bulkCreate
}
