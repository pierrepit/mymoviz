var mongoose = require('mongoose');

var options = {
	connectTimeoutMS: 5000,
	useUnifiedTopology: true,
	useNewUrlParser: true,
};

mongoose.connect(process.env.DATABASE_URL, options, function (err) {
	err ? console.error(err) : console.log('connexion ok');
});

module.exports = mongoose;
