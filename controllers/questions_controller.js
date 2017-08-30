// Controller which implements the questions operations
const Question = require('../models/question')
const User = require('../models/user')
const Answer = require('../models/answer')
var ObjectId = require('mongodb').ObjectID;

//Function to get all the comments with the user joins(is not used now)
function aggregateQuestions(res){
  Question.aggregate([
    {
      $lookup:{
        "from":"users",
        "localField":"user",
        "foreignField":"_id",
        "as":"user_join"
      }
    }
  ], function(err, questions){
    if(err){
      return new Error (err)
    }else{
      res.json({
        questions
      })
    }
  })
}

// Function to create a new question
exports.createQuestion = function (req, res, next){
  console.log('createQuestion',req.body);
  var user = new ObjectId(req.body.user)
  var content = req.body.content;
  var category = req.body.category;
  var date = req.body.date;
  var question = new Question({
    user: user,
    content:content,
    category:category,
  })
  question.save().then(questionSaved => {
    console.log('questionSaved',questionSaved);
    User.findOne({_id: ObjectId(req.body.user)}).then(user => {
      if(user){
        console.log('user who created question',user);
        user.questions.push(questionSaved._id)
        user.save().then(userUpdate =>{
          console.log('userUpdate', userUpdate);
        }).catch(err =>{
          console.log('Error saving user updating', err);
        })
      }
    }).catch(err=>{
      console.log('Error updating user model', err);
    })
    Question.find()
      .sort({date: -1})
      .populate('user')
      .exec(function(err, questions){
        if (err || !questions) {
          console.log('err findAnswers');
          next(err)
        } else {
          res.json({questions})
        }
      })
  }).catch(err => {
    next(err)
  })
}

// Get all de questions
exports.findAllQuestion = function (req, res, next){
  // Query sroting by population
  if(req.query.popular){
    Question.find()
      .sort({nLikes:req.query.popular, date: -1})
      .populate('user')
      .exec(function(err, questions){
        if (err) {
          console.log('err findAnswers');
          next(err)
        } else {
          console.log('answers', questions);
          res.json({questions})
        }
      })
  } else {
    Question.find()
      .sort({date: -1})
      .populate('user')
      .exec(function(err, questions){
        if (err) {
          console.log('err findAnswers');
          next(err)
        } else {
          console.log('answers', questions);
          res.json({questions})
        }
      })
  }
}


// Function to find a number of questions. It is used to load the questions
exports.findNumberQuestion = function (req, res, next){
  console.log('findNumberQuestion');
  var number = parseInt(req.params.number)
  Question.find().limit(number).then(response => {
    console.log('after find', response);
  })
  .catch(err => {
    console.log('after find', err);
    next(err)
  })
}

//Function to find questions by category
exports.findQuestionByCategory = function (req, res, next){
  console.log('findQuestionByCategory',req.query.popular, req.params.category);
  var categorySearch = req.params.category
  categorySearch = categorySearch.split(',')
  console.log('categorySearch',categorySearch);
  // Query sorting by population
  if(req.query.popular){
    Question.find({category:{ $in:categorySearch }})
      .sort({nLikes:req.query.popular,date:-1})
      .populate('user')
      .then(questions => {
        console.log('findQuestionByCategory',questions);
        res.json({questions})
      }).catch(err =>{
        next(err)
      })
  }else{
    Question.find({category:{ $in:categorySearch }})
      .sort({date:-1})
      .populate('user')
      .then(questions => {
        console.log('findQuestionByCategory second',questions);
        res.json({questions})
      }).catch(err =>{
        next(err)
      })
  }
}

// Find Questions by User Location
exports.findQuestionByLocation = function(req, res, next){
  // Distance in km
  var searchRadius = req.query.distance || 2
  var categorySelected = req.query.category

  var coord = []
  coord[0] = req.query.longitude || 0
  coord[1] = req.query.latitude || 0

  User.find({
    loc:{
      $geoWithin:{
        $centerSphere: [coord, searchRadius/6371]
      }
    }
  }).then(users =>{
    var questionFound = []
    if(users.length == 0){
      res.json(questionFound)
    }
    users.forEach(function(user,index){
      var query = {
        user:user._id
      }
      if(categorySelected){
        query.category = categorySelected
      }
      Question.find(query).then(questions =>{
        if(questions.length > 0){
          questionFound = questionFound.concat(questions)
        }
        if(index==users.length-1){
          res.json(questionFound)
        }
      }).catch(err=>{
        next(err)
      })
    })
  }).catch(err=>{
    next(err)
  })
}

// Find Questions by User
exports.findQuestionByUser = function(req, res, next){
  Question.find({user:req.params.user}).populate('user').then(questions=>{
    res.json({questions})
  }).catch(err=>{
    next(err)
  })
}

// Find Favourites Questions by given the User
exports.findFavouritesQuestionByUser = function(req, res, next){
  Question.find({favorites:req.params.user}).populate('user').then(questions=>{
    res.json({questions})
  }).catch(err=>{
    next(err)
  })
}

//Find question by word
exports.searchByWord = function (req, res, next){
  var searchWord = req.params.search
  Question.find({$text: { $search: searchWord }}).populate('user').then(questions => {
    console.log('After searchByWord', questions);
    res.json({questions})
  }).catch(err =>
    next(err)
  )
}

//Function to update the likes
exports.updateReaction = function (req, res, next){
  Question.find({_id:req.params.questionId}).then( response =>{
    var modelToUse = Question
    // Method is used to update answers as well
    if(response.length === 0){
      modelToUse = Answer
    }
    if (req.body.like === 1) {
      modelToUse.update(
        {_id:req.params.questionId},
        {
          $inc : {
            nLikes:req.body.like
          },
          $push: {
            likes: new ObjectId(req.body.user)
          }
        }
      ).then(response =>{
        console.log('after update',response);
        res.json(response)
      }).catch(err =>{
        console.log('after update err',err);
        next(err)
      })
    } else if (req.body.like === -1){
      modelToUse.update(
        {_id:req.params.questionId},
        {
          $inc : {
            nLikes:req.body.like
          },
          $pull: {
            likes: new ObjectId(req.body.user)
          }
        }
      ).then(response =>{
        console.log('after update',response);
        res.json(response)
      }).catch(err =>{
        console.log('after update err',err);
        next(err)
      })
    }
  }).catch(error => {
    console.log('FIND ERROR updateReaction',error);
  })
}

//Function to update the favourites
exports.updateFavourite = function (req, res, next){
  Question.find({_id:req.params.questionId}).then( response =>{
    if (req.body.favourite === 1) {
      Question.update(
        {_id:req.params.questionId},
        {$push: {favorites: new ObjectId(req.body.user)}}
      ).then(response =>{
        console.log('after update favorites',response);
        res.json(response)
      }).catch(err =>{
        console.log('after update favorites err',err);
        next(err)
      })
    } else if (req.body.favourite === -1){
      Question.update(
        {_id:req.params.questionId},
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
