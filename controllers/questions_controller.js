// Controller which implements the questions operations
const Question = require('../models/question')
const User = require('../models/user')
const Answer = require('../models/answer')
var ObjectId = require('mongodb').ObjectID;

//Function to get all the comments with the user joins(is not used now)
function aggregateQuestions(res){
  Question.aggregate([
    {
      $lookup:{
        "from":"users",
        "localField":"user",
        "foreignField":"_id",
        "as":"user_join"
      }
    }
  ], function(err, questions){
    if(err){
      return new Error (err)
    }else{
      res.json({
        questions
      })
    }
  })
}

// Function to create a new question
exports.createQuestion = function (req, res, next){
  var user = new ObjectId(req.body.user)
  var content = req.body.content;
  var category = req.body.category;
  var date = req.body.date;
  var question = new Question({
    user: user,
    content:content,
    category:category,
  })
  question.save().then(questionSaved => {
    Question.find()
      .sort({date: -1})
      .populate('user')
      .exec(function(err, questions){
        if (err) {
          console.log('err findAnswers');
          next(err)
        } else {
          console.log('answers', questions);
          res.json({questions})
        }
      })
  }).catch(err => {
    next(err)
  })
}

// Get all de questions
exports.findAllQuestion = function (req, res, next){
  // Query sroting by population
  if(req.query.popular){
    Question.find()
      .sort({nPositiveVotes:req.query.popular, date: -1})
      .populate('user')
      .exec(function(err, questions){
        if (err) {
          console.log('err findAnswers');
          next(err)
        } else {
          console.log('answers', questions);
          res.json({questions})
        }
      })
  } else {
    Question.find()
      .sort({date: -1})
      .populate('user')
      .exec(function(err, questions){
        if (err) {
          console.log('err findAnswers');
          next(err)
        } else {
          console.log('answers', questions);
          res.json({questions})
        }
      })
  }
}


// Function to find a number of questions. It is used to load the questions
exports.findNumberQuestion = function (req, res, next){
  console.log('findNumberQuestion');
  var number = parseInt(req.params.number)
  Question.find().limit(number).then(response => {
    console.log('after find', response);
  })
  .catch(err => {
    console.log('after find', err);
    next(err)
  })
}

//Function to find questions by category
exports.findQuestionByCategory = function (req, res, next){
  console.log(req.query.popular);
  var categorySearch = req.params.category
  // Query sroting by population
  if(req.query.popular){
    Question.find({category:categorySearch})
      .sort({nPositiveVotes:req.query.popular,date:-1})
      .populate('user')
      .then(questions => {
        res.json({questions})
      }).catch(err =>{
        next(err)
      })
  }else{
    Question.find({category:categorySearch})
      .sort({date:-1})
      .populate('user')
      .then(questions => {
        res.json({questions})
      }).catch(err =>{
        next(err)
      })
  }
}

//Function to update the positiveVotes and n0egativeVotes properties
exports.updateReaction = function (req, res, next){
  Question.find({_id:req.params.questionId}).then( response =>{
    var modelToUse = Question
    if(response.length === 0){
      modelToUse = Answer
    }
    if (req.body.nPositiveVotes === 1) {
      modelToUse.update(
        {_id:req.params.questionId},
        {
          $inc : {
            nPositiveVotes:req.body.nPositiveVotes,
            nNegativeVotes:req.body.nNegativeVotes
          },
          $push: {
            positiveVotes: new ObjectId(req.body.user)
          },
          $pull: {
            negativeVotes: new ObjectId(req.body.user)
          }
        }
      ).then(response =>{
          console.log('after update',response);
          res.json(response)
        })
        .catch(err =>{
          console.log('after update err',err);
          next(err)
        })
    } else {
      modelToUse.update(
        {_id:req.params.questionId},
        {
          $inc : {
            nPositiveVotes:req.body.nPositiveVotes,
            nNegativeVotes:req.body.nNegativeVotes
          },
          $push: {
            negativeVotes: new ObjectId(req.body.user)
          },
          $pull: {
            positiveVotes: new ObjectId(req.body.user)
          }
        }
      )
        .then(response =>{
          console.log('after update',response);
          res.json(response)
        })
        .catch(err =>{
          console.log('after update err',err);
          next(err)
        })
    }
  }).catch(error => {
    console.log('FIND ERROR',error);
  })
}
