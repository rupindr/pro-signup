const express = require('express');
const dbHanlder = require('./helpers/databaseHandler');

const app = express();

const port = 5000;

// connect to db
dbHanlder.connect();

app.get('/', (req, res) => {
	res.send('welcome!');
});

app.listen(port, () => {
	console.log('server running on port ' + port);
});