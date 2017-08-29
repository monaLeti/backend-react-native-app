const Answer = require('../models/answer')
const Question = require('../models/question')
const User = require('../models/user')
var ObjectId = require('mongodb').ObjectID;

exports.createAnswer = (req, res, next) => {
  var answer = new Answer({
    user: new ObjectId(req.body.user),
    content:req.body.content,
    category:req.body.category,
  })
  answer.save().then((answer) => {
    //Save the answerID into the user
    User.findOne({_id: ObjectId(req.body.user)}).then(user => {
      if(user){
        user.answers.push(answer._id)
        user.save().then(userUpdate =>{
          console.log('userUpdate', userUpdate);
        }).catch(err =>{
          console.log('Error saving user updating', err);
        })
      }
    }).catch(err=>{
      console.log('Error updating user model', err);
    })
    //Save the answerID into its question parent
    var questionID = req.params.questionId
    Question.findOne({_id: new ObjectId(questionID)}).then((question) => {
      if(question){
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
                res.json({question})
              }
            })
        }).catch(err =>{
          next(err)
        })
      } else {
        res.json({})
      }
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
      console.log('findAnswers',question);
      if (err) {
        console.log('err findAnswers');
        next(err)
      } else {
        res.json({question})
      }
    })
}

//Function to update the favourites
exports.updateFavourite = function (req, res, next){
  console.log('updateFavourite');
  Answer.find({_id:req.params.answerId}).then( response =>{
    if (req.body.favourite === 1) {
      Answer.update(
        {_id:req.params.answerId},
        {$push: {favorites: new ObjectId(req.body.user)}}
      ).then(response =>{
        console.log('after update favorites',response);
        res.json(response)
      }).catch(err =>{
        console.log('after update favorites err',err);
        next(err)
      })
    } else if (req.body.favourite === -1){
      Answer.update(
        {_id:req.params.answerId},
        {$pull: {favorites: new ObjectId(req.body.user)}}
      ).then(response =>{
        console.log('after update favorites',response);
        res.json(response)
      }).catch(err =>{
        console.log('after update err favorites',err);
        next(err)
      })
    }
  }).catch(error => {
    console.log('FIND ERROR favorites',error);
  })
}
