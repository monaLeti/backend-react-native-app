const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')
const Question = require('./question')
const Answer = require('./answer')

var validateEmail = (email) => {
  return(/\S+@\S+\.\S+/).test(email)
}

var userSchema = new Schema({
  email:{
    type:String,
    unique:true,
    lowercase:true,
    required: 'Email required',
    validate:[validateEmail, 'Please enter a valid email']
  },
  password:{
    type:String
  },
  facebook_id:{
    type: String,
    unique: true
  },
  name:{
    type:String
  },
  lastName:{
    type:String
  },
  loc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2dsphere'      // create the geospatial index
  },
  profile_picture: {
    type: String
  },
  sex:{
    type:String
  },
  questions:[{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  favQuestions:[{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  answers:[{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  favAnswers:[{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }]
})

//Incript the password before is saved
userSchema.pre('save', function(next){
  var user = this
  //Check if the user is new or the password is modified
  if(user.isNew || user.isModified('password')){
    //10 work factor the times of the data is processes
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, null, function(err, hash){
        if(err){
          return next(null)
        }
        user.password = hash
        next()
      })
    })
  }else{
    next()
  }
})

userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){
      callback(err)
    }
    callback(null, isMatch)
  })
}

module.exports = mongoose.model('user', userSchema)
