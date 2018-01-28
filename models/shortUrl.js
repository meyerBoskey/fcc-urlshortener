var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var schema = new Schema({
    originalUrl: String,
    shortenedUrl: String
}, {timestamp: true});

module.exports = mongoose.model('ShortUrl', schema);
