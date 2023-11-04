const ProductService = require('../services/ProductService')
const StockService = require('../services/StockService')

module.exports = {
  index: async (req, res) => {
    const UserId = req.user.id

    try {
      const products = await ProductService.findAll(UserId)

      const stocks = await StockService.findAll(UserId)
      const stockCount = await StockService.count(UserId)
      const sumStockTotal = await StockService.totalQt(UserId)

      return res.render('stock', {
        stocks,
        products,
        sumStockTotal
      })
    } catch (error) {
      console.log('error rendering stocks', error)

      return res.redirect('/404')
    }
  },
  post: async (req, res) => {
    const { ProductId, qt } = req.body
    const UserId = req.user.id

    try {
      await StockService.create(UserId, ProductId, qt)

      return res.redirect('/estoque')
    } catch (error) {
      console.error('error creating seller', error)
      return res.redirect('/404')
    }
  }
}
