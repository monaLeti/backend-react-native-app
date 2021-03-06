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
    required: 'Por favor introduce una pregunta',
    text: true
  },
  category:{
    type:Array
  },
  date:{
    type: Date,
    default: Date.now
  },
  likes:[{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  nLikes: {
    type:Number,
    default: 0
  },
  favorites:[{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  answers:[{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }]
})


module.exports = mongoose.model('Question', questionSchema)
