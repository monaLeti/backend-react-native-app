const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')
const axios = require('axios')

function tokenForUser(user){
  console.log('user');
  var timeStmp = new Date().getTime()
  return jwt.encode({
    sub: user.id,
    iat: timeStmp
  }, config.secret)
}

exports.singin = function(req, res, next){
  var user = req.user
  user['password'] = undefined
  console.log('user signin',user);
  res.send({user_id:user})
}

exports.singinFacebook = function(req, res, next){
  var token = req.body.token
  axios.get(`https://graph.facebook.com/v2.8/me?fields=id,name,email&access_token=${token}`).then(function(response){
    var facebook_id = response.data.id
    var name = response.data.name
    var email = response.data.email
    User.find({facebook_id: response.data.id}, {password:0}, function(err, users){
      user = users[0]
      if(err){
        return next(err)
      }
      if(!user){
        var user =  new User({
          facebook_id: facebook_id,
          email: email,
          name: name
        })
        user.save(function(err){
          if(err){
            next(err)
          }
          console.log('despues de save', user);
          res.send(user)
        })
      } else {
        console.log('user already created',user);
        res.send(user)
      }
    })
  })
}

exports.singup = function(req, res, next){
  console.log(req.body);
  var email= req.body.email
  var password = req.body.password
  var name = req.body.name
  var lastName = req.body.lastName
  var location = req.body.location
  var sex = req.body.sex
  if (!email || !password) {
    return res.status(422).json({error:'Provide an email or a password'})
  }
  // Check if the user already exists
  User.findOne({email:email}, function(err, existingUser){
    if(err){
      return next(err)
    }
    if(existingUser){
      return res.status(422).json({error:'Email taken'})
    }
    var user = new User({
      email:email,
      password: password,
      name:name,
      lastName:lastName,
      location:location,
      sex:sex
    })
    user.save(function(err){
      if(err){
        return next(err)
      }
      user['password'] = undefined
      res.json({user_id:user, token:tokenForUser(user)})
    })
  })
}
