const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RequestTime = require('./request-time.model');

//const urlRegex = new RegExp("^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$");

let WatchedServiceSchema = new Schema({
    name: {
        type: String, required: true, max: 256
    },
    url: {
        type: String, required: true
    },
    requestTimes: {
        type: [RequestTime.schema],
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('WatchedService', WatchedServiceSchema);
