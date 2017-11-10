const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  image: String,
  participants: [String],
  messages: [{user:String, message:String}] //[{user:"Some User",time:"Time Sent",message:"Some Message"},{...},{...}]
})

const ModelClass = mongoose.model('conversations', conversationSchema);

module.exports = ModelClass;
