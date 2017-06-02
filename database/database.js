/**
 * Created by user on 2017-05-25.
 */
var mongoose = require('mongoose');

var database = {};

// config.js는 config를 통해서
// express의 정보는 app을 통해서 import된다.

database.init = function(app, config){
    console.log("[[called]] database >> init()");

    //call connect
    if(app) {
        if(config){
            connect(app, config);
        }else{
            console.log("[[error]] not defined configuration");
        }
    }else{
        console.log("[[error]] not defined app");
    }
}

function connect(app, config){
    console.log("[[called]] database >> connect()");

    for(var i = 0; i< 10; i++) {
        console.log(">>>>>>>>>>>>>>>>>>>>Try to connect with DB<<<<<<<<<<<<<<<<<<<<<");
    }
    //DB Connect

    //mongoose connect with url
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);

    //db connect with mongoose
    database.db = mongoose.connection;
    database.db.on('error', console.error.bind(console, '[[error]] failure of DB connect'));
    database.db.on('open', function(){
        console.log('[[push]] url: ' + config.db_url  + ']');

        createSchema(app, config);
    });

    database.db.on('disconnected', connect);
}

function createSchema(app, config){
    console.log("[[called]] database >> createSchema()");

    var schemaLen = config.db_schemas.length;
    console.log('[[push]] num of schema: %d', schemaLen);

    for(var i =0; i<schemaLen; i++){
        var curItem = config.db_schemas[i];

        var curSchema = require(curItem.file).createSchema(mongoose);

        console.log(curItem.collection)
        var curModel = mongoose.model(curItem.collection, curSchema);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('[[push]] schema: [%s] Model: [%s]', curItem.schemaName, curItem.modelName);
    }

    app.set('database', database);
    console.log('[[push]] DB connected');
}

module.exports = database;
