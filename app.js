/**
 * 1. basic module import
 * */

//express
var express = require('express');
var path = require('path');
var http = require('http');

// Router
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

//midle ware(function)
var static = require('serve-static');

//errorHandler
var errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');

//passport(auth)
var passport = require('passport');
var flash = require('connect-flash');

// cors(sharing resource for another domain)
var cors = require('cors');

var fs = require('fs');

var firebase = require('firebase');

firebase.initializeApp({
    serviceAccount: "path/to/SaveS2-b478f248b92f.json",
    databaseURL: "https://saves2-2a99e.firebaseio.com"
})

var message = {
    to: '<>'
}

/**
 * 2. user module import
 * */
// server info
var config = require('./config/config');
// db info
var database = require('./database/database');
// route info
var router_loader = require('./routes/route_loader');
// passport config
var configPassport = require('./config/passport');
// passport route
var userPassport = require('./routes/route_passport');

/**
 * 3. Express setup
 * */
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// port setting
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || app.get('port'));

// router setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookie setup
app.use(cookieParser());

// resource sharing setup
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
  secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

// passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
 * 4. Router setup
 * */

var router = express.Router();
router_loader.init(app, router);
configPassport(app, passport);//sign_up, log_in setup
userPassport(router, passport);// get setting up passport


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * 5. Error Handler
 * */
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
* 6. Server start
* */
process.on('SIGTERM', function () {
    console.log("[Exit] Process exit.");
    app.close();
});

app.on('close', function () {
    console.log("[Exit] Express Server close.");
    if (database.db) {
        database.db.close();
    }
});

// Express server start
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("[On] Server start with 'PORT' : " + app.get('port'));

    // DB connect func
    database.init(app, config);
});