const ProductService = require('../services/ProductService')

module.exports = {
  index: async (req, res) => {
    const UserId = req.user.id

    try {
      const products = await ProductService.findAll(UserId)
      const countProducts = await ProductService.count(UserId)

      res.render('products', { countProducts, products })
    } catch (error) {
      console.log('Error', error)
      return res.redirect('/404')
    }
  },
  post: async (req, res) => {
    const UserId = req.user.id

    try {
      await ProductService.create(UserId, req.body)

      res.redirect('/produtos')
    } catch (error) {
      console.error('Error', error)
      return res.redirect('/404')
    }
  }
}
