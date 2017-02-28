// User.findOne({_id: new ObjectId(user)}, {password:0}).then(user => {
//   console.log('user found', user);
//   res.json({
//     newQuestion:question,
//     userQuestion:user
//   })
// }).catch(err => {
//   console.log('user found err',err);
//   next(err)
// })

// Controller which implements the questions operations
const Question = require('../models/question')
const User = require('../models/user')
var ObjectId = require('mongodb').ObjectID;

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
    date:date
  })


  question.save().then(question => {
    console.log('after save res', question);
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
        console.log('aggregate err',err);
      }else{
        console.log('aggregate res', questions);
        res.json({
          questions
        })
      }
    })
  }).catch(err => {
    console.log('after save res', err);
    next(err)
  })
}

// Get all de questions
exports.findAllQuestion = function (req, res, next){
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
      console.log('aggregate findAllQuestion err',err);
    }else{
      console.log('aggregate findAllQuestion res', questions);
      res.json({
        questions
      })
    }
  })
}


// Function to find a number of questions. It is used to load the questions
exports.findNumberQuestion = function (req, res, next){
  console.log('findNumberQuestion');
  var number = parseInt(req.params.number)
  console.log(req.params.number);
  Question.find().limit(number).then(response => {
    console.log('after find', response);
  })
  .catch(err => {
    console.log('after find', err);
    next(err)
  })
}
