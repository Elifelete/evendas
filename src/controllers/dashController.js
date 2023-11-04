const DashService = require('../services/DashService')

module.exports = {
  index: async (req, res) => {
    const UserId = req.user.id

    try {
      const ordersMetrics = await DashService.metricsOrdersOfTheMonth(UserId)
      const lossesMetrics = await DashService.metricsLossesOfTheMonth(UserId)
      const sellersMetrics = await DashService.metricsSellersOfTheMonth(UserId)
      const commissionMetrics = await DashService.commissionOfTheMonth(UserId)

      return res.render('index', {
        ordersMetrics,
        lossesMetrics,
        sellersMetrics,
        commissionMetrics
      })
    } catch (error) {
      console.log('error loading index', error)

      return res.redirect('/404')
    }
  },
  billed: async (req, res) => {
    const UserId = req.user.id

    try {
      const totalBilledOfYear = await DashService.totalBilledOfYear(UserId)

      // res.header('Content-Type', 'application/json')
      // res.send(JSON.stringify(totalBilledOfYear))

      return res.status(200).json(totalBilledOfYear)
    } catch (error) {
      console.log(error)

      return res.status(400).json({ message: error })
    }
  }
}
