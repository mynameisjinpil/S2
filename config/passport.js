/**
 * Created by user on 2017-05-25.
 */

var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');

module.exports = function(app, passport){
    console.log('[[called]] config >> passport');

    passport.serializeUser(function(user, done){
        console.log('[[called]] config >> passport >>serializeUser()');

        done(null, user);
    });

    passport.deserializeUser(function(user, done){
        console.log('[[called]] config >> passport >>deserializeUser()');

        done(null, user);
    });

    passport.use('local-login', local_login);
    passport.use('local-signup', local_signup);
};