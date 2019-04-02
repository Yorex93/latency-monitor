const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ResponseTime = require('./response-time.model');

//const urlRegex = new RegExp("^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$");

let WatchedServiceSchema = new Schema({
    name: {
        type: String, required: true, max: 256
    },
    endPoint: {
        type: String, required: true
    },
    avrgResponseTime: {
        type: Number,
        default: 0
    },
    minResponseTime: {
        type: Number,
        default: 0
    },
    maxResponseTime: {
        type: Number,
        default: 0
    },
    responseTimes: {
        type: [ResponseTime.schema],
        default: []
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('WatchedService', WatchedServiceSchema);
