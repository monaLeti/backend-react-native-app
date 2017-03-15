const Answer = require('../models/answer')
const Question = require('../models/question')
var ObjectId = require('mongodb').ObjectID;

exports.createAnswer = (req, res, next) => {
  var answer = new Answer({
    user: new ObjectId(req.body.user),
    content:req.body.content,
  })
  answer.save().then((answer) => {
    //Save the answerID into its question parent
    var questionID = req.params.questionId
    Question.findOne({_id: new ObjectId(questionID)}).then((question) => {
      question.answers.push(answer)
      question.save().then((questionSaved)=>{
        Question.findOne({_id: new ObjectId(questionID)})
          .populate('user')
          .populate({
            path: 'answers',
            populate: {path:'user'}
          })
          .exec(function(err, question){
            if (err) {
              console.log('err findAnswers');
              next(err)
            } else {
              console.log('answers', question);
              res.json({question})
            }
          })
      }).catch(err =>{
        next(err)
      })
    }).catch((err)=>{
      next(err)
    })
  }).catch((err) =>{
    console.log('createAnswer',err);
    next(err)
  })
}

//Find the answer of a specific question
exports.findAnswers = function(req, res, next){
  Question.findOne({_id: new ObjectId(req.params.questionId)})
    .populate('user')
    .populate({
      path: 'answers',
      populate: {path:'user'}
    })
    .exec(function(err, question){
      if (err) {
        console.log('err findAnswers');
        next(err)
      } else {
        console.log('answers', question);
        res.json({question})
      }
    })
}
