const mongoose = require('mongoose');
const config = require('../config/config');
const time = 10; // seconds wait after each retry
const dbUrl = config.dbUrl;

const connect = (callback) => {
    mongoose
        .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Mongoose default connection open to ' + (dbUrl.split('@')[1] ? dbUrl.split('@')[1] : dbUrl.split('@')[0]));
            if (callback) {
                callback();
            }
        })
        .catch(err => {
            console.log(err);
            setTimeout(() => connect(callback), time * 10000);
        });
}

const disconnect = (callback) => {
    mongoose.connection.close()
        .then(() => {
            console.log('Mongoose default connection disconnected');
            if (callback) {
                callback();
            }
        })
        .catch(err => console.log(err));
}

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    disconnect(() => {
        console.log('Disconnected through app termination');
        process.exit(0);
    });
});

module.exports = {
    connect: connect,
    disconnect: disconnect,
}