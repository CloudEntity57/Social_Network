var mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var schema = new mongoose.Schema({
  first_name:String,
  last_name:String,
  username:String,
  userid:String,
  photo:String,
  largephoto:String,
  affiliation:String,
  education:String,
  work:String,
  location:String,
  user_story:String,
  allies: { type : Array , default : '' },
  ally_requests_sent:[{
    type:String
  }],
  ally_invitations_received:[{
    type:String
  }]
});

var model = mongoose.model('User',schema);

module.exports = model;
