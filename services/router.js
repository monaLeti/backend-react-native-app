const passport = require('passport')

var AuthenticationController = require('../controllers/authentication_controller')
var UserController = require('../controllers/user_controller')
var QuestionController = require('../controllers/questions_controller')
var AnswerController = require('../controllers/answers_controller')

var passportService = require('./passport')

var requireAuth= passport.authenticate('jwt', {session:false})
var requireLogin= passport.authenticate('local', {session:false})

var router = require('express').Router()


// Sign in routes
router.route('/signup')
  .post(AuthenticationController.singup)

router.route('/signin')
  .post([requireLogin, AuthenticationController.singin])

router.route('/facebook_auth')
  .post(AuthenticationController.singinFacebook);


// User routes
router.route('/updateUserLocation')
  .put(UserController.updateUserLocation)


// Questions Routes
router.route('/createQuestion')
  .post(QuestionController.createQuestion)

router.route('/findAllQuestion/')
  .get(QuestionController.findAllQuestion)

router.route('/findQuestionByCategory/:category')
  .get(QuestionController.findQuestionByCategory)

router.route('/updateReaction/:questionId')
  .put(QuestionController.updateReaction)

router.route('/updateFavourite/:questionId')
  .put(QuestionController.updateFavourite)

router.route('/findNumberQuestion/:number')
  .get(QuestionController.findNumberQuestion)

router.route('/findQuestionByLocation')
  .get(QuestionController.findQuestionByLocation)

router.route('/findQuestionByUser/:user')
  .get(QuestionController.findQuestionByUser)



router.route('/searchByWord/:search')
  .get(QuestionController.searchByWord)


// Answer Routes
router.route('/createAnswer/:questionId')
  .post(AnswerController.createAnswer)

router.route('/findAnswers/:questionId')
  .get(AnswerController.findAnswers)

router.route('/updateFavouriteAnswer/:answerId')
  .put(AnswerController.updateFavourite)
module.exports = router
