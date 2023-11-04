const { Sequelize } = require('sequelize')

const orderModel = require('../models/OrderModel')
const LossModel = require('../models/LossModel')
const SellerModel = require('../models/SellerModel')

const actualDate = new Date()
const firstDayOfMonth = new Date(
  actualDate.getFullYear(),
  actualDate.getMonth(),
  1
)
const lastDayOfMonth = new Date(
  actualDate.getFullYear(),
  actualDate.getMonth() + 1,
  0
)

const metricsOrdersOfTheMonth = async (UserId) => {
  try {
    const metrics = await orderModel.findOne({
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('qt')), 'totalQt'],
        [Sequelize.fn('sum', Sequelize.col('billed')), 'totalBilled'],
        [Sequelize.fn('sum', Sequelize.col('profit')), 'totalProfit']
      ],
      where: {
        UserId: UserId,
        createdAt: {
          [Sequelize.Op.between]: [firstDayOfMonth, lastDayOfMonth]
        }
      }
    })

    return metrics
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const metricsLossesOfTheMonth = async (UserId) => {
  try {
    const metrics = await LossModel.findOne({
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('qt')), 'totalQt'],
        [Sequelize.fn('sum', Sequelize.col('billed')), 'totalBilled']
      ],
      where: {
        UserId: UserId,
        createdAt: {
          [Sequelize.Op.between]: [firstDayOfMonth, lastDayOfMonth]
        }
      }
    })

    return metrics
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const metricsSellersOfTheMonth = async (UserId) => {
  try {
    const sellers = await SellerModel.findAll({
      where: {
        UserId: UserId
      },
      include: {
        model: orderModel,
        where: {
          createdAt: {
            [Sequelize.Op.between]: [firstDayOfMonth, lastDayOfMonth]
          }
        }
      },
      attributes: [
        'id',
        'name',
        'commission',
        [Sequelize.fn('SUM', Sequelize.col('qt')), 'totalSales']
      ],
      group: ['Seller.id']
    })

    return sellers
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const commissionOfTheMonth = async (UserId) => {
  try {
    const commissionOfTheMonth = await orderModel.sum('commission', {
      where: {
        UserId: UserId,
        createdAt: {
          [Sequelize.Op.between]: [firstDayOfMonth, lastDayOfMonth]
        },
        loose: 0
      }
    })

    return commissionOfTheMonth
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const totalBilledOfYear = async (UserId) => {
  try {
    const billedPerMonth = await orderModel.findAll({
      where: {
        UserId: UserId
      },
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('billed')), 'total']
      ],
      group: ['month'],
      order: Sequelize.literal('month')
    })

    const datePeriods = []
    for (let i = 1; i <= 12; i++) {
      datePeriods.push(new Date(new Date().getFullYear(), i - 1, 1))
    }

    const salesPerMonth = {}
    billedPerMonth.forEach((item) => {
      const month = item.dataValues.month
      const total = item.dataValues.total
      salesPerMonth[month] = total
    })

    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez'
    ]

    const total = datePeriods.map((data) => {
      const month = data.getMonth() + 1
      return {
        month: monthNames[month - 1],
        total: salesPerMonth[month] || 0
      }
    })

    return total
  } catch (error) {
    console.error('error', error)
    return error
  }
}

module.exports = {
  metricsOrdersOfTheMonth,
  metricsLossesOfTheMonth,
  metricsSellersOfTheMonth,
  commissionOfTheMonth,
  totalBilledOfYear
}
