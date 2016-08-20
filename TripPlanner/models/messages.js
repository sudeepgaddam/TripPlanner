
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageSchema   = new Schema({
    timeStamp: String,
    text: String,
    user:String

});

module.exports = mongoose.model('Message', MessageSchema);
