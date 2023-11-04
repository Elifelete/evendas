const express = require('express')
const session = require('express-session')
const path = require('path')
const cors = require('cors')
const passport = require('./middlewares/auth')

const config = require('./config/configs')
const routes = require('./routes/routes')

const app = express()
app.use(cors())
app.use(
  session({
    secret: config.server.secretkey,
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', routes)

app.listen(config.server.port)
