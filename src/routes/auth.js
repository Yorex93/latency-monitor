const express = require('express');
const router = express.Router();
const userService = require('../modules/users/user.service');
const schemaValidator = require('../middleware/schema-validator');
const registerSchema = require('./../validators').register;
const loginSchema = require('./../validators').login;

module.exports = (passport) => {
    router.get('/', (req, res, next) => {
        res.redirect('/login');
    });
    
    router.get('/login', (req, res, next) => {
        res.render('login');
    });
    
    router.get('/register', (req, res, next) => {
        res.render('register');
    });

    router.post('/register', schemaValidator(registerSchema, 'register'), (req, res, next) => {
        userService.create(req.body).then(resp => {
            res.render('register', { success: true });
        }).catch(err => {
            res.render('register', { errors: [err], oldValues: req.body});
        });
    })

    router.post('/login', schemaValidator(loginSchema, 'login'), (req, res, next) => {
        passport.authenticate('local', (errorMsg, user, info) => {
            if(errorMsg){
                res.render('login', { errorMsg, oldValues: req.body });
            } else {
                req.logIn(user, function(err) {
                    if (err) { 
                        res.render('login', { errorMsg: err, oldValues: req.body });
                    } else {
                        res.redirect('/service-watcher');
                    }
                });
            }
        })(req, res, next);


    });

    router.post('/logout', (req, res) => {
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });

    return router;
}
