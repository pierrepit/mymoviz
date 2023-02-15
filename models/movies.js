var mongoose = require('mongoose');

var movieSchema = mongoose.Schema({
	movieName: String,
	movieImg: String,
});

module.exports = mongoose.model('movies', movieSchema);
