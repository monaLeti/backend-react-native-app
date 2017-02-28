const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var questionSchema = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref: 'user',
    required: 'Please insert userId'
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
