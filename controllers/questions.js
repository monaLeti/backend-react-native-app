// Controller which implements the questions operations
const Question = require('../models/question')


// Function to create a new question
exports.createQuestion = function (req, res, next){
  console.log('createQuestion', req.body);
  var title = req.body.title;
  var content = req.body.content;
  var category = req.body.category;
  var date = req.body.date;

  var question = new Question({
    title:title,
    content:content,
    category:category,
    date:date
  })
  question.save(function(err, res){
    console.log('after save err', err);
    console.log('after save res', res);
    if(err){
      return next(err)
    } else {
      // After save the question we should save the id question in the array of the user
      return next(res)
    }
  })
}

// Function to find a number of questions. It is used to load the questions
exports.findNumberQuestion = function (req, res, next){
  console.log('findNumberQuestion');
  var number = parseInt(req.params.number)
  console.log(req.params.number);
  Question.find(function(err, res){
    console.log('after find', err);
    console.log('after find', res);
  }).limit(number)
}
