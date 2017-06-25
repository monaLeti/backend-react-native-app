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
