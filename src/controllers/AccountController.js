const UserModel = require('../models/UserModel')
const bcrypt = require('bcrypt')

module.exports = {
  index: async (req, res) => {
    const fail = req.query.fail || false
    const success = req.query.success || false

    return res.render('account', { fail, success })
  },
  reset: async (req, res) => {
    const { oldPass, newPass } = req.body
    const UserId = req.user.id

    try {
      const user = await UserModel.findByPk(UserId)

      const verifyOldPass = await bcrypt.compare(oldPass, user.password)
      const newPassHash = await bcrypt.hash(newPass, 8)

      if (!verifyOldPass) return res.redirect('/conta?fail=incorrect_password')

      user.password = newPassHash
      user.save()

      return res.redirect('/conta?success=success')
    } catch (error) {}

    return req.redirect('/account')
  }
}
