const { Sequelize } = require('sequelize')
const config = require('../config/configs').database

const sequelize = new Sequelize(
  config.dbname,
  config.dbuser,
  config.dbpassword,
  {
    host: config.dbhost,
    port: config.port,
    dialect: config.dbdialect,
    timezone: '-03:00'
  }
)

module.exports = sequelize
