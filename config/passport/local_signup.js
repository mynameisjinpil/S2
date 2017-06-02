/**
 * Created by user on 2017-05-07.
 */
var LocalStrategy = require('passport-local').Strategy;

// passport log-in set
module.exports =  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){

    var paramName = req.body.name || req.query.name;
    var paramAge = req.body.age || req.query.age;
    var paramSex = req.body.sex || req.query.sex;
    var paramAddress = req.body.address || req.query.address;

    console.log("[[called]] 'config >> passport >> local_signup'");
    console.log('email: ' + email);
    console.log('password: ' + password);
    console.log('name: '+ paramName);
    console.log('age: '+paramAge);
    console.log('sex: '+paramSex);
    console.log('address: '+paramAddress);

    process.nextTick(function(){
        var database = req.app.get('database');

        database.UserModel.findOne({'email':email}, function(err, user){
            if(err){return done(err);}

            if(user){
                console.log('[[error]] sign-in already');
                return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
            }else{

                var user = new database.UserModel({'email': email, 'password': password, 'name': paramName, 'age': paramAge, 'sex': paramSex, 'address': paramAddress});
                user.save(function(err){
                    if(err){throw err;}
                    console.log('[[success]] added user data');
                    return done(null, user);
                });
            }
        });
    });
});