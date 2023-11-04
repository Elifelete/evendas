require('dotenv').config()

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    secretkey: process.env.SECRET_KEY
  },
  database: {
    dbname: process.env.DB_NAME,
    dbuser: process.env.DB_USER,
    dbpassword: process.env.DB_PASSWORD,
    dbhost: process.env.DB_HOST,
    dbport: process.env.DB_PORT || 3306,
    dbdialect: process.env.DB_DIALECT
  },
  ambient: process.env.NODE_ENV
}
