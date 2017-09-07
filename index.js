const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport');


var app = express()

var router = require('./services/router')

mongoose.connect('mongodb://localhost:backend/backend')

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use('/v1', router)


var PORT = process.env.PORT || 3000
var HOST = process.env.host || '127.0.0.1'

console.log('Listening at', PORT, HOST)
app.listen(PORT, HOST)

// var multer  = require('multer');
// var upload = multer({ dest: 'upload/'});
// var fs = require('fs');
//
// /** Permissible loading a single file,
//     the value of the attribute "name" in the form of "recfile". **/
// var type = upload.single('recfile');
//
// app.post('/upload', type, function (req,res) {
//
//   /** When using the "single"
//       data come in "req.file" regardless of the attribute "name". **/
//   var tmp_path = req.file.path;
//
//   /** The original name of the uploaded file
//       stored in the variable "originalname". **/
//   var target_path = 'uploads/' + req.file.originalname;
//
//   /** A better way to copy the uploaded file. **/
//   var src = fs.createReadStream(tmp_path);
//   var dest = fs.createWriteStream(target_path);
//   src.pipe(dest);
//   src.on('end', function() { res.render('complete'); });
//   src.on('error', function(err) { res.render('error'); });
//
// });
