const express = require('express');
const dbHanlder = require('./helpers/databaseHandler');
const cookieParser = require('cookie-parser');
const proSignup = require('../index');

const app = express();

const port = 5000;

// connect to db
dbHanlder.connect();

//cookie parser middleware
app.use(cookieParser());

// body parser middleware
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/auth', proSignup.router);
app.use('/main', proSignup.ensureAuthenticated, require('./routes/main'));

app.listen(port, () => {
	console.log('server running on port ' + port);
});