const Answer = require('../models/answer')

exports.createAnswer = (req, res, next) => {
  console.log('createAnswer',req.body);
  var answer = new Answer({
    user:req.body.user,
    content:req.body.content,
    date:req.body.date,
  })
  answer.save().then(response => {
    console.log('createAnswer',response);
  }).catch(err =>{
    console.log('createAnswer',err);
  })
}
