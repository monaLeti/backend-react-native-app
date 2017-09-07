// Controller which implements the user operations
var storage = require('azure-storage');
// var config = require('../confFiles/config');

const User = require('../models/user')
var ObjectId = require('mongodb').ObjectID;


// function saveBlobProfile (img, callback) {
//   console.log('saveBlobProfile');
//   var blobService = storage.createBlobService(config.connectionString);
//   // var imageToUpload = "HelloWorld.png";
//   var imageToUpload = img;
//   var blockBlobContainerName = 'Profile';
//   var blockBlobName = imageToUpload + guid.v1();
//   blobService.createContainerIfNotExists(blockBlobContainerName, {publicAccessLevel : 'blob'}, function (error, result, response) {
//     if (error) return callback(error);
//     blobService.createBlockBlobFromLocalFile(blockBlobContainerName, blockBlobName, imageToUpload, function (error, result, response) {
//       console.log('After create block');
//     })
//   })
// }

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
      console.log('after findUserMessages', user);
      if (err) {
        console.log('err findUserMessages');
        next(err)
      } else {
        res.json({user})
      }
    })
}

// Update profile picture
exports.updateProfilePicture = function(req, res, next){
  console.log('findUserMessages',req);
  User.findByIdAndUpdate(
    {_id:req.params.user},
    {profile_picture: req.body.img},
    {new : true}
  ).then(response =>{
    console.log('after updateProfilePicture',response);
    res.json(response)
  }).catch(err =>{
    console.log('after updateProfilePicture err',err);
    next(err)
  })
}
