
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ImageCollectionSchema   = new Schema({
    title: String,
    collectionDescription: String,
    privacy: String,
    images: Array,
    owner: String,
    rating: Number,
    raters: Object
});

module.exports = mongoose.model('ImageCollection', ImageCollectionSchema);
