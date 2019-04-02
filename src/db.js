const mongoose = require('mongoose');
const config = require('./config');
const User = require('./modules/users/user.model');
const WatchedService = require('./modules/latency/models/wactched-services.model');
const ResponseTime = require('./modules/latency/models/response-time.model');

const connectionString = config.mongo.connectString;
mongoose.connect(connectionString, { useCreateIndex: true, useNewUrlParser: true }).then(resp => {

}).catch(err => {
    console.log(`Error connecting to Mongo DB with connection string ${connectionString || null}`)
    process.exit()
});
mongoose.Promise = global.Promise;

module.exports = {
    User, WatchedService, ResponseTime
}
