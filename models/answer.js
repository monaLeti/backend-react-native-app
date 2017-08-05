const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Think to include the user of the answer
var answerSchema = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref: 'user',
    required: 'Please insert userId'
  },
  content: {
    type: String,
    default: ''
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
  favorites:[{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }]
})


module.exports = mongoose.model('Answer', answerSchema)
