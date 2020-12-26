const express = require('express');
const dbHandler = require('./helpers/databaseHandler');
const cookieParser = require('cookie-parser');
const proSignup = require('../index')({
	jwtSecret: 'thisisajwtsecretexample'
});

const app = express();

const port = 5000;

// connect to db
if(process.env.NODE_ENV !== 'test')
	dbHandler.connect();

//cookie parser middleware
app.use(cookieParser());

// body parser middleware
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

//routes
app.use('/auth', proSignup.router);
app.use('/main', proSignup.ensureAuthenticated, require('./routes/main'));
app.use('/private', proSignup.ensureAuthenticatedAndRedirect, require('./routes/main'));
app.get('/', (req, res) => res.send('This is some public data without authentication'));

app.listen(port, () => {
	console.log('server running on port ' + port);
});

module.exports = app; // for testing