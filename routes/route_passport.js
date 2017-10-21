/**
 * Created by user on 2017-05-25.
 */

module.exports = function(router, passport){
    console.log('[[called]] routes >> routes_passport')

    // home page render
    router.route('/').get(function(req, res){
        console.log("[[req]] routes >> passport >>home");
        //render html
        console.log('[push] need login');
        res.render('index.ejs', {login_success:false});
    });

    // log in page render
    router.route('/login').get(function(req, res){
        console.log("[[req]] routes >> passport >>login");
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    // sign-up page render
    router .route('/signup').get(function(req, res) {
        console.log("[[req]] routes >> passport >> signup");
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    //profile page render
    router.route('/profile').get(function(req, res){
        console.log("[[req]] routes >> passport >> profile");

       if(!req.user){
           console.log('[[push]] log in failed');
           res.redirect('/login');
           return;
       }else{
           console.log('[[push]] log in');
           console.dir(req.user);

           if (Array.isArray(req.user)) {
               res.render('profile.ejs', {user: req.user[0]._doc});
           } else {
               res.render('profile.ejs', {user: req.user});
           }
       }
    });

    //log-out
    router.route('/logout').get(function(req, res) {
        console.log("[[req]] routes >> passport >> log out");
        req.logout();
        res.redirect('/');
    });

    // log in
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // sign up
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));
}