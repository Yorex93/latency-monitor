
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let RequestTime = new Schema({
    dataReceived: String,
    elapsedTime: Number,
    timings: {
        type : new Schema({
            socket: Number,
            lookup: Number,
            connect: Number,
            response: Number,
            end: Number,
        })
    },
    timingPhases: {
        type: new Schema({
            wait: Number,
            dns: Number,
            tcp: Number,
            firstByte: Number,
            download: Number,
            total: Number,
        })
    },
    error: {
        type: Boolean,
        default: false
    },
    errorDescription: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('RequestTime', RequestTime);
