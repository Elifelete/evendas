const LossService = require('../services/LossService')
const ProductService = require('../services/ProductService')

module.exports = {
  index: async (req, res) => {
    const date = req.query.date
    const UserId = req.user.id

    const initialDay = date
      ? new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2])
      : null

    try {
      const losses = await LossService.findAll({ UserId, date })
      const totalLossQt = await LossService.countQt({ UserId, date })
      const totalLossBilled = await LossService.countBilled({ UserId, date })

      return res.render('losses', {
        losses,
        totalLossQt,
        totalLossBilled,
        initialDay
      })
    } catch (error) {
      console.error('Failed to find losses', error)
      return res.redirect('/404')
    }
  },
  create: async (req, res) => {
    const UserId = req.user.id

    try {
      const products = await ProductService.findAvailable(UserId)

      return res.render('newLoss', { products })
    } catch (error) {
      console.error('Failed to find products', error)

      return res.redirect('/404')
    }
  },
  show: async (req, res) => {
    const { id } = req.params
    const UserId = req.user.id

    try {
      const loss = await LossService.findByPk({ UserId, id })

      if (!loss) return res.redirect('/perdas')

      return res.render('loss', { loss })
    } catch (error) {
      console.error('Failed to find loss', error)

      return res.redirect('/404')
    }
  },
  post: async (req, res) => {
    const { description, losses } = req.body
    const UserId = req.user.id

    try {
      await LossService.createLosses({ UserId, losses, description })

      return res.status(201).json({ success: 'success' })
    } catch (error) {
      return res.status(400).json({ error: error })
    }
  }
}
