var mongoose     = require('mongoose');
var jwt = require('jsonwebtoken');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    email: String,
    pw: String,
    token: String
});

module.exports = mongoose.model('User', UserSchema);