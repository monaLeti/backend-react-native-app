const passport = require('passport')

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

//Passport-local will authenticate the user by the username and the password send to the user
const LocalStrategy = require('passport-local')

const User = require('../models/user')
const config = require('../config')

var localOptions = {
  usernameField: 'email'
}

var localStrategy = new LocalStrategy(localOptions, function(email, password, done){
  //First look for the user in the database
  User.findOne({email:email}, function(err, user){
    if(err){
      done(err,null)
    }
    if(!user){
      done(null, false)
    }
    user.comparePassword(password, function(err, isMatch){
      if(err){
        done(err,null)
      }
      if(!isMatch){
        done(null, false)
      }
      done(null, user)
    })
  })
})

var jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest : ExtractJwt.fromHeader('authorization')
}

//Protects our routes
var jwtStrategy = new JwtStrategy(jwtOptions, function(payload, done){
  User.findById(payload.sub, function(err,user){
    if(err){
      done(err, false)
    }
    if(user){
      done(false, user)
    }
    else{
      done(null, false)
    }
  })
})

passport.use(jwtStrategy)
passport.use(localStrategy)
