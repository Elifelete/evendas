const routes = require('express').Router()
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

const ProductController = require('../controllers/ProductController')
const SellerController = require('../controllers/SellerController')
const StockController = require('../controllers/StockController')
const SaleController = require('../controllers/SaleController')
const LossController = require('../controllers/LossController')
const dashController = require('../controllers/dashController')
const LoginController = require('../controllers/LoginController')
const AccountController = require('../controllers/AccountController')

routes.get('/', ensureLoggedIn('/login'), dashController.index)

routes.get('/billed', ensureLoggedIn('/login'), dashController.billed)

routes.get('/vendas', ensureLoggedIn('/login'), SaleController.index)
routes.get('/vendas/show/:id', ensureLoggedIn('/login'), SaleController.show)
routes.get('/vendas/nova', ensureLoggedIn('/login'), SaleController.create)
routes.get('/vendas/avulsa', ensureLoggedIn('/login'), SaleController.single)
routes.post('/vendas/', ensureLoggedIn('/login'), SaleController.post)

routes.get('/perdas', ensureLoggedIn('/login'), LossController.index)
routes.get('/perdas/show/:id', ensureLoggedIn('/login'), LossController.show)
routes.get('/perdas/nova', ensureLoggedIn('/login'), LossController.create)
routes.post('/perdas/', ensureLoggedIn('/login'), LossController.post)

routes.get('/estoque', ensureLoggedIn('/login'), StockController.index)
routes.post('/estoque', ensureLoggedIn('/login'), StockController.post)

routes.get('/produtos', ProductController.index)
routes.post('/produtos', ensureLoggedIn('/login'), ProductController.post)

routes.get('/vendedores', ensureLoggedIn('/login'), SellerController.index)
routes.get('/vendedores/:id', ensureLoggedIn('/login'), SellerController.show)
routes.post('/vendedores', ensureLoggedIn('/login'), SellerController.post)

routes.get('/conta', ensureLoggedIn('/login'), AccountController.index)
routes.post('/reset', ensureLoggedIn('/login'), AccountController.reset)

routes.get('/login', LoginController.index)
routes.post('/login', LoginController.auth)
routes.get('/logout', LoginController.logout)

routes.get('/404', (req, res) => {
  res.render('error')
})

module.exports = routes
