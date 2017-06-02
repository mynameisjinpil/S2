/**
 * Created by user on 2017-04-27.
 */


// use crypto(hash)
var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {

    //Schema define

    var UserSchema = mongoose = mongoose.Schema({
        email: {type: String, required: true, unique: true, 'default': ''},
        hashed_password: {type: String, required: true, 'default': ''},
        salt: {type: String, required: true},
        name: {type: String, index: 'hashed', 'default': ''},
        address: {type: String, required: true,'default': ''},
        sex: {type: String, required: true, 'default': ''},
        age: {type: Number, required: true, 'default': ''},
        ecg: {type: String, 'default': '0'},
        interval: {type: String, 'default': '0'},
        heart_rate: {type: String, 'default': '0'},
        created_at: {type: Date, index: {unique: false}, 'default': Date.now},
        updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });

    UserSchema
        .virtual('password')
        .set(function(password){
            this._password = password;
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);

            console.log('called virtual password set :' + this.hashed_password);
        })
        .get(function(){
            console.log('called virtual password get.');
            return this._password;
        });

    // password encryption method
    UserSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }else{
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });

    // making salt method
    UserSchema.method('makeSalt', function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    // authenticate method
    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            console.log('called authenticate: %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt),hashed_password);
            return this.encryptPassword(plainText, inSalt) == hashed_password;
        }else{
            console.log('called authenticate: %s -> %s : %s', plainText, this.encryptPassword(plainText),this.hashed_password);
            return this.encryptPassword(plainText) == this.hashed_password;
        }
    });

    // is val availible?
    var validatePresenceOf = function(value){
        return value && value.length;
    };

    // UserSchema setting
    UserSchema.pre('save', function(next){
        if(!this.isNew)return next();

        if(!validatePresenceOf(this.password)){
            next(new Error('unavailible password field.'));
        }else {
            next();
        }
    })

    UserSchema.path('email').validate(function(email){
        return email.length;
    }, 'There is no email val');

    UserSchema.path('name').validate(function(name){
        return name.length;
    }, 'There is no name val');

    UserSchema.path('hashed_password').validate(function(hashed_password){
        return hashed_password.length;
    }, 'there is no hashed_password val');

    UserSchema.path('age').validate(function(age){
        return age.length;
    }, 'there is no age val');

    UserSchema.path('address').validate(function(address){
        return address.length;
    }, 'there is no address val');

    UserSchema.path('sex').validate(function(sex){
        return sex.length;
    }, 'there is no sex val');

    UserSchema.path('ecg').validate(function(ecg){
        return ecg.length;
    }, 'there is no ecg val');

    UserSchema.static('findByEmail', function(email, callback){
        return this.find({email:email}, callback);
    });

    UserSchema.static('findByName', function(name, callback){
        return this.find({name:name}, callback);
    });

    UserSchema.static('findAll', function(callback){
        return this.find({}, callback);
    });

    console.log('defined UserSchema');

    return UserSchema
};

module.exports = Schema;