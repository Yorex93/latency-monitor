const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./modules/users/user.model');
const WatchedService = require('./modules/latency/models/wactched-services.model');
const RequestTime = require('./modules/latency/models/request-time.model');

const connectionString = process.env.MONGODB_URI;
mongoose.connect(connectionString, { useCreateIndex: true, useNewUrlParser: true }).then(resp => {

}).catch(err => {
    console.log(`Error connecting to Mongo DB with connection string ${connectionString || null}`)
    process.exit()
});
mongoose.Promise = global.Promise;

module.exports = {
    User, WatchedService, RequestTime
}