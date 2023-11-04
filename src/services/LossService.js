const { Op } = require('sequelize')

const LossModel = require('../models/LossModel')
const ProductModel = require('../models/ProductModel')
const ProductService = require('../services/ProductService')

const findAll = async ({ UserId, date }) => {
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

    const losses = await LossModel.findAll({
      include: [{ model: ProductModel }],
      where: {
        UserId: UserId,
        ...dataFilter
      }
    })

    return losses
  } catch (error) {
    console.error('Failed find losses', error)

    return error
  }
}

const findByPk = async ({ UserId, id }) => {
  try {
    const loss = await LossModel.findByPk(id, {
      include: [{ model: ProductModel }],
      where: {
        UserId: UserId
      }
    })

    return loss
  } catch (error) {
    return error
  }
}

const countQt = async ({ UserId, date }) => {
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

    const totalQt = await LossModel.sum('qt', {
      where: {
        UserId: UserId,
        ...dataFilter
      }
    })

    return totalQt
  } catch (error) {
    return error
  }
}

const countBilled = async ({ UserId, date }) => {
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

    const totalBilled = await LossModel.sum('billed', {
      where: {
        UserId: UserId,
        ...dataFilter
      }
    })

    return totalBilled
  } catch (error) {
    return error
  }
}

const createLosses = async ({ UserId, losses, description }) => {
  try {
    const listLosses = await Promise.all(
      losses.map(async (item) => {
        const product = await ProductService.findByPk(UserId, item.productId)

        const billed = (await product.sale_value) * item.qt
        const comission = (billed * product.commission) / 100
        const profit = (await product.profit) * item.qt

        product.qt -= item.qt
        product.save()

        return {
          qt: item.qt,
          profit,
          comission,
          billed,
          description,
          ProductId: Number(item.productId),
          UserId
        }
      })
    )

    await LossModel.bulkCreate(listLosses)
  } catch (error) {
    return error
  }
}

module.exports = {
  findAll,
  findByPk,
  countQt,
  countBilled,
  createLosses
}
