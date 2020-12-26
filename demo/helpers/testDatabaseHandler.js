const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
    const uri = await mongod.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
        
    await mongoose.connect(uri, mongooseOpts);
}

/**
 * Drop database, close the connection and stop mongod.
 */
const disconnect = callback => {
    mongoose.connection.dropDatabase().then(() => {
        mongoose.connection.close().then(() => {
            mongod.stop().then(() => callback());
        });
    });
}
module.exports.disconnect = disconnect;

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = callback => {
    const collections = mongoose.connection.collections;

    const promises = [];
    for (const key in collections) {
        const collection = collections[key];
        promises.push(collection.deleteMany());
    }
    Promise.all(promises).then(() => callback());
}

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    disconnect(() => {
        process.exit(0);
    });
});