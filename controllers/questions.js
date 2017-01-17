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
  question.save().then(res => {
    console.log('after save res', res);
  })
  .catch(err => {
    console.log('after save res', err);
  })
}

// Function to find a number of questions. It is used to load the questions
exports.findNumberQuestion = function (req, res, next){
  console.log('findNumberQuestion');
  var number = parseInt(req.params.number)
  console.log(req.params.number);
  Question.find().limit(number).then(res => {
    console.log('after find', res);
  })
  .catch(err => {
    console.log('after find', err);
  })
}
