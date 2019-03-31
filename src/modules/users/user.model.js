const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailRegex = new RegExp('^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$')


let User = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        maxlength: 256,
    },
    phone: {
        type: String,
        maxlength: 50
    },
    passwordHash: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', User);
