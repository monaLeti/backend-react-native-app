const passport = require('passport')

var AuthenticationController = require('../controllers/authentication_controller')
var QuestionController = require('../controllers/questions_controller')
var AnswerController = require('../controllers/answers_controller')

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

// Sign in routes
router.route('/signup')
  .post(AuthenticationController.singup)

router.route('/signin')
  .post([requireLogin, AuthenticationController.singin])

//Questions Routes
router.route('/createQuestion')
  .post(QuestionController.createQuestion)

router.route('/findAllQuestion/')
  .get(QuestionController.findAllQuestion)

router.route('/findQuestionByCategory/:category')
  .get(QuestionController.findQuestionByCategory)

router.route('/updateReaction/:questionId')
  .put(QuestionController.updateReaction)

router.route('/findNumberQuestion/:number')
  .get(QuestionController.findNumberQuestion)


//Answer Routes
router.route('/createAnswer/:questionId')
  .post(AnswerController.createAnswer)

router.route('/findAnswers/:questionId')
  .get(AnswerController.findAnswers)
  
module.exports = router
