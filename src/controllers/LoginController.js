const passport = require('passport')

module.exports = {
  index: async (req, res) => {
    const fail = req.query.fail

    let message = fail ? true : false

    return res.render('login', { message })
  },
  auth: passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?fail=true'
  }),
  logout: async (req, res) => {
    req.logout((err) => {
      if (err) return err

      return res.redirect('/login')
    })
  }
}
