// Controller which implements the questions operations
const Question = require('../models/question')
const User = require('../models/user')
var ObjectId = require('mongodb').ObjectID;
// Function to create a new question
exports.createQuestion = function (req, res, next){
  var user = req.body.user;
  var content = req.body.content;
  var category = req.body.category;
  var date = req.body.date;
  console.log('user', user);
  var question = new Question({
    user:user,
    content:content,
    category:category,
    date:date
  })
  question.save().then(response => {
    console.log('after save res', response);
    User.findOne({_id: new ObjectId(user)}).then(user => {
      console.log('user found', user);
      res.json({newQuestion:question})
    }).catch(err => {
      console.log('user found err',err);
      next(err)
    })
    // User.findOne({_id: new ObjectId(user)}, function (err, user) {
    //   if(err){
    //     console.log('userFoundErr', err);
    //     next(err)
    //   }else{
    //     console.log('userFound',user);
    //     res.json({newQuestion:question})
    //   }
    // });
    // User.findById(user).then(userFound => {
    //   console.log('userFound',userFound);
    //   res.json({newQuestion:question})
    // }).catch(err =>{
    //   console.log('userFound', err);
    //   next(err)
    // })
  }).catch(err => {
    console.log('after save res', err);
    next(err)
  })
}

// Get all de questions
exports.findAllQuestion = function (req, res, next){
  console.log('findAllQuestion');
  Question.find().then(response => {
    console.log('after find questions', response);
    res.json(response)
  })
  .catch(err => {
    console.log('after find questions', err);
    next(err)
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
