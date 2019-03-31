const express = require('express');
const userRouter = express.Router();
const userService = require('./user.service');
const Joi = require('joi');

const authenticate = (req, res) => {
    userService.authenticate(req.body)
        .then(user => {
            if(user){
                res.json(user);
            } else {
                res.status(400).json({ message: 'Username or password is incorrect' });
            }
        }).catch(err => next(err));
}

const register = (req, res) => {
    
    userService.create(req.body)
        .then(() => res.json({ message: 'User created successfully' }))
        .catch(err => next(err));
}

const getCurrentUserDetails = (req, res) => {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

const changePassword = (req, res) => {

    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated successfully' }))
        .catch(err => next(err));
}

userRouter.post('/authenticate', authenticate);
userRouter.post('/register', register);
userRouter.get('/user-details', getCurrentUserDetails);
userRouter.get('/update', update);

export default userRouter;
