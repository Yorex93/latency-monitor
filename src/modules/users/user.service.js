const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./../../db');
require('dotenv').config();

const Exceptions = require('../../exceptions/api-error');
const ApiError = Exceptions.ApiError;

const User = db.User;


async function authenticate(username, password) {
    const user = await User.findOne({ email: username.trim().toLowerCase() });
    if(!user){
        return Promise.reject("User does not exist");
    }
    const isPassword = await bcrypt.compare(password, user.passwordHash);
    if(!isPassword){
        return Promise.reject("Username or password incorrect");
    }

    const userObj = { 
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    };
    return Promise.resolve(userObj);
}

async function getById(id) {
    return await User.findById(id).select('-passwordHash');
}

async function getByUsername(username) {
    return User.findOne({ username });
}

async function create(userCreateRequest) {
    if (await User.findOne({ email: userCreateRequest.email })) {
        return Promise.reject(new ApiError('Email "' + userCreateRequest.email + '" is already registered'));
    }
    const user = new User({
        firstName: userCreateRequest.firstName.trim().toLowerCase(),
        lastName: userCreateRequest.lastName.trim().toLowerCase(),
        email: userCreateRequest.email.trim().toLowerCase()
    });
    user.passwordHash = bcrypt.hashSync(userCreateRequest.password, 10);
    try{
        await user.save();
        return Promise.resolve(user);
    } catch (err) {
        return Promise.reject(new ApiError(err.message));
    }
}

async function changePassword(id, passwordChangeRequest) {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError('User not found');
    }
    user.passwordHash = bcrypt.hashSync(passwordChangeRequest.password, 10);
    await user.save();
}

module.exports = {
    authenticate,
    getById,
    create,
    changePassword,
    getByUsername
};
