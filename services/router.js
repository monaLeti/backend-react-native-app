const passport = require('passport')

var AuthenticationController = require('../controllers/authentication_controller')
var passportService = require('./passport')

var requireAuth= passport.authenticate('jwt', {session:false})
var requireLogin= passport.authenticate('local', {session:false})
var router = require('express').Router()

function protected(req, res, next){
  res.send("Here's the secret")
  next()
}

router.route('/protected')
  .get(requireAuth,protected)


router.route('/signup')
  .post(AuthenticationController.singup)

router.route('/signin')
  .post([requireLogin, AuthenticationController.singin])
module.exports = router
