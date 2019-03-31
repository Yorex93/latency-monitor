const express = require('express');
const router = express.Router();
const userService = require('../modules/users/user.service');
const Joi = require('joi');
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

    router.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            console.log(user);
            if (err) { 
              return next(err); 
            }
            if(!user) {
               return res.redirect('/login'); 
            }
            
            req.logIn(user, function(err) {
                if (err) { 
                    return next(err); 
                }
                return res.redirect('/users/' + user.username);
            });
        })(req, res, next);
      });

    router.post('/login', schemaValidator(loginSchema, 'login'), passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/dashboard'
    }), (req, res) => {
        res.send('Logged In');
    })

    return router;
}
