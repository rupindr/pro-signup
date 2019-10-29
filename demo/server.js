const express = require('express');
const dbHanlder = require('./helpers/databaseHandler');
const cookieParser = require('cookie-parser')

const app = express();

const port = 5000;

// connect to db
dbHanlder.connect();

//cookie parser middleware
app.use(cookieParser());

// body parser middleware
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
	res.send('welcome!');
});

app.listen(port, () => {
	console.log('server running on port ' + port);
});