const passport = require('passport')

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const FacebookStrategy = require('passport-facebook').Strategy;

//Passport-local will authenticate the user by the username and the password send to the user
const LocalStrategy = require('passport-local')

const User = require('../models/user')
const config = require('../config')

passport.serializeUser(function(user, done) {
  console.log('serializeUser',user);
  done(null, user);
})
// used to deserialize the user
passport.deserializeUser(function(user, done) {
  console.log('deserializeUser',user);
  done(err, user);
});


var localOptions = {
  usernameField: 'email'
}

var localStrategy = new LocalStrategy(localOptions, function(email, password, done){
  console.log('localStrategy');
  //First look for the user in the database
  User.findOne({email:email}, function(err, user){
    console.log(err,user);
    if(err){
      done(err,null)
    }
    if(!user){
      done(null, false)
    }else{
      user.comparePassword(password, function(err, isMatch){
        if(err){
          done(err,null)
        }
        if(!isMatch){
          done(null, false)
        }
        done(null, user)
      })
    }
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
var facebookStrategy = new FacebookStrategy({
    clientID: '1772376096337848',
    clientSecret: '78f0a8f958d3fb2102e072d0e78dd04e',
    callbackURL: "http://localhost:3000/v1/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, done){
    var email = profile.emails[0].value
    User.findOne({email: email}, function(err, userFromFacebook){
      if(err){
        done(err, null)
      }
      if(userFromFacebook){
        console.log('userFromFacebook', userFromFacebook);
        done(null, userFromFacebook)
      }else{
        var user = new User({
          email:email,
          password:'leticia'
        }).save(function(err, newUser){
          console.log('save user',err, newUser);
          if(err){
            done(err, null)
          }
          done(null, newUser)
        })
      }
    })
  })


passport.use(jwtStrategy)
passport.use(localStrategy)
passport.use(facebookStrategy)
