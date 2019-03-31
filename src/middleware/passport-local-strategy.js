const LocalStrategy = require('passport-local').Strategy;
const userService = require('../modules/users/user.service');

module.exports = function (passport) {
    passport.serializeUser(function (user, done){
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(new LocalStrategy(function(username, password, done){
        userService.authenticate(username, password).then(user => {
            done(null, user);
        }).catch(err => {
            done(err)
        })
    }))
}
