const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Answer = require('./answer')

var questionSchema = new Schema({
  title: {
    type: String,
    default:'',
    trim:true
  },
  content: {
    type: String,
    default: '',
    required: 'Por favor introduce una pregunta'
  },
  category:{
    type:String
  },
  date:{
    type: Date,
    default: Date.now
  },
  nPositiveVotes: {
    type:Number
  },
  nNegativeVotes: {
    type:Number
  },
  answers:[{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }]
})


module.exports = mongoose.model('Question', questionSchema)
