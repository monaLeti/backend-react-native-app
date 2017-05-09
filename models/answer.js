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
  date:{
    type: Date,
    default: Date.now
  },
  nPositiveVotes: {
    type:Number
  },
  positiveVotes:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  nNegativeVotes: {
    type:Number
  },
  negativeVotes:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})


module.exports = mongoose.model('Answer', answerSchema)
