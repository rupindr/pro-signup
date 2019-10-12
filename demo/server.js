const express = require('express');
const bodyParser = require('body-parser');
const dbHanlder = require('./helpers/databaseHandler');

const app = express();

const port = 5000;

// connect to db
dbHanlder.connect();

// body parser middleware
app.use(bodyParser.json());

//routes
app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
	res.send('welcome!');
});

app.listen(port, () => {
	console.log('server running on port ' + port);
});