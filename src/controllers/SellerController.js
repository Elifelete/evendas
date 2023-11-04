const SellerService = require('../services/SellerService')

module.exports = {
  index: async (req, res) => {
    const UserId = req.user.id

    try {
      const sellers = await SellerService.findAll(UserId)
      const countSellers = await SellerService.count(UserId)

      return res.render('sellers', { countSellers, sellers })
    } catch (error) {
      console.error('error rendering sellers', error)

      return res.redirect('/404')
    }
  },
  show: async (req, res) => {
    const { id } = req.params
    const UserId = req.user.id

    const date = req.query.date

    const initialDay = date
      ? new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2])
      : null

    try {
      const findSeller = await SellerService.findByPk(UserId, id)

      if (!findSeller) return res.redirect('/vendedores')

      const sellerOrders = await SellerService.findOrders(UserId, id, date)
      const orderTotal = await SellerService.ordersTotal(UserId, id)
      const commissionTotal = await SellerService.commissionsTotal(UserId, id)

      return res.render('seller', {
        seller: findSeller,
        sellerOrders,
        orderTotal,
        commissionTotal,
        initialDay
      })
    } catch (error) {
      console.error('error find sellers', error)
      return res.redirect('/404')
    }
  },
  post: async (req, res) => {
    const UserId = req.user.id

    try {
      await SellerService.create(UserId, req.body)

      return res.redirect('/vendedores')
    } catch (error) {
      console.error('error creating seller', error)

      return res.redirect('/404')
    }
  }
}
