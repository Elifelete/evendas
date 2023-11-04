const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const UserModel = require('../models/UserModel')

const findUser = async (email) => {
  try {
    const user = await UserModel.findOne({
      where: {
        email: email
      }
    })

    return user
  } catch (error) {
    console.error('error', error)
    return error
  }
}

const findById = async (id) => {
  try {
    const user = await UserModel.findByPk(id, {
      attributes: {
        exclude: ['password']
      }
    })

    return user
  } catch (error) {
    console.error('error', error)
    return error
  }
}

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id)

    done(null, user)
  } catch (error) {
    done(null, error)
  }
})

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await findUser(email)

        if (!user) return done(null, false)

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if (!passwordIsValid) return done(null, false)

        return done(null, user)
      } catch (error) {
        return done(null, false)
      }
    }
  )
)

module.exports = passport
