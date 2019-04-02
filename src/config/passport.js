const LocalStrategy = require('passport-local').Strategy;
const userService = require('../modules/users/user.service');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        userService.authenticate(username, password).then(user => {
            done(null, user);
        }).catch(err => {
            done(err, null, { message: err });
        })
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    userService.getById(id).then(user => {
        done(null, user);
    }).catch(err => {
        done(err, null)
    })
  });
};