var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PolicySchema   = new Schema({
    name: String,
    text: String
});

module.exports = mongoose.model('Policy', PolicySchema);