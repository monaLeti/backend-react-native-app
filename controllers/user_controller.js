// Controller which implements the user operations
const User = require('../models/user')
var ObjectId = require('mongodb').ObjectID;

exports.updateUserLocation = function(req, res, next){
  var user = req.body.user
  var coord = req.body.coord
  User.update(
    {_id:user},
    {loc:coord}
  ).then(user=>{
    console.log('User update', user);
    res.json(user)
  }).catch(err=>{
    next(err)
  })
}

exports.findUserMessages = function(req, res, next){
  console.log('findUserMessages',req.params.user);
  User.findOne({_id:req.params.user})
    .populate({
      path: 'questions',
      populate: {path:'user'}
    })
    .populate({
      path: 'answers',
      populate: {path:'user'}
    })
    .exec(function(err, user){
      if (err) {
        console.log('err findUserMessages');
        next(err)
      } else {
        res.json({user})
      }
    })
}
