const Product = require('../services/ProductService')
const Seller = require('../services/SellerService')
const Order = require('../services/OrderService')

module.exports = {
  index: async (req, res) => {
    const date = req.query.date
    const UserId = req.user.id

    const currentDay = new Date()

    let initialDay = new Date(
      currentDay.getFullYear(),
      currentDay.getMonth(),
      currentDay.getDate(),
      0,
      0,
      0
    )

    let andDay = new Date(
      currentDay.getFullYear(),
      currentDay.getMonth(),
      currentDay.getDate(),
      23,
      59,
      59
    )

    if (date) {
      const dateSplit = date.split('-')

      initialDay = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2])
      andDay = new Date(initialDay.getTime() + 24 * 60 * 60 * 1000)
    }

    try {
      const orders = await Order.findAll({
        UserId: UserId,
        date: { initialDay, andDay }
      })

      const totalOrdersQt = await Order.countQt({
        UserId: UserId,
        date: { initialDay, andDay }
      })

      const totalOrdersBilled = await Order.countBilled({
        UserId: UserId,
        date: { initialDay, andDay }
      })

      return res.render('sales', {
        orders,
        totalOrdersQt,
        totalOrdersBilled,
        initialDay
      })
    } catch (error) {
      console.log('Failed to find Sellers', error)

      return res.redirect('/404')
    }
  },
  show: async (req, res) => {
    const { id } = req.params

    const UserId = req.user.id

    try {
      const order = await Order.findPk({ UserId, id })

      if (!order) return res.redirect('/vendas')

      return res.render('sale', { order })
    } catch (error) {
      console.log('Failed to find Sellers', error)

      return res.redirect('/404')
    }
  },
  create: async (req, res) => {
    const UserId = req.user.id

    try {
      const sellers = await Seller.findAll(UserId)
      const products = await Product.findAvailable(UserId)

      return res.render('newSale', { sellers, products })
    } catch (error) {
      console.log('Failed to find Sellers', error)

      return res.redirect('/404')
    }
  },
  single: async (req, res) => {
    const UserId = req.user.id

    try {
      const independentSeller = await Seller.findOrCreate(UserId)
      const products = await Product.findAvailable(UserId)

      return res.render('singleSale', { products, independentSeller })
    } catch (error) {
      console.log('Failed to find Sellers or Products', error)

      return res.redirect('/404')
    }
  },
  post: async (req, res) => {
    const { seller, orders } = req.body
    const UserId = req.user.id

    try {
      await Order.createOrders({ UserId, seller, orders })

      return res.status(201).json({ success: 'success' })
    } catch (error) {
      return res.status(400).json({ error: error })
    }
  }
}
