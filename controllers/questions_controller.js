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
  question.save().then(response => {
    console.log('after save res', response);
    res.json({newQuestion:question})
  })
  .catch(err => {
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
