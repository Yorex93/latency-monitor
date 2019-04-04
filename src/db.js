const mongoose = require('mongoose');
const config = require('./config');
const User = require('./modules/users/user.model');
const WatchedService = require('./modules/latency/models/wactched-services.model');
const ResponseTime = require('./modules/latency/models/response-time.model');
const Settings = require('./modules/latency/models/settings.model');

const connectionString = config.mongo.connectString;
mongoose.connect(connectionString, { useCreateIndex: true, useNewUrlParser: true }).then(resp => {
    console.log(`Connected to mongoDB`)
}).catch(err => {
    console.log(`Error connecting to Mongo DB with connection string`)
    process.exit()
});
mongoose.Promise = global.Promise;

module.exports = {
    User, WatchedService, Settings, ResponseTime
}
