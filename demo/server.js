const express = require('express');
const dbHanlder = require('./helpers/databaseHandler');
const cookieParser = require('cookie-parser');

const ensureAuthenticated = require('../index').ensureAuthenticated;

const app = express();

const port = 5000;

// connect to db
dbHanlder.connect();

//cookie parser middleware
app.use(cookieParser());

// body parser middleware
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/auth', require('../index').router);
app.use('/main', ensureAuthenticated, require('./routes/main'));

app.listen(port, () => {
	console.log('server running on port ' + port);
});