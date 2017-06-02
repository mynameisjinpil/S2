/**
 * Created by user on 2017-05-07.
 */
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');

// passport log-in set
module.exports =  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    console.log("[[called]] config >> passport >>local login'");
    console.log('email: ' + email);
    console.log('password: ' + password);

    var database = req.app.get('database');

    database.UserModel.findOne({'email':email}, function(err, user){
        if(err){return done(err);}

        if(!user) {
            console.log('[[error]] No matching email');
            return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
        }
        var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);

        if(!authenticated){
            console.log('[[error]] Password not correct');
            return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
        }

        console.log('[[success]] **********log-in**********');
        return done(null, user);
    });
});