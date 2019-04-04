
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Setting = new Schema({
    pollingRate: {
        type: Number,
        default: 1800000
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Setting', Setting);
