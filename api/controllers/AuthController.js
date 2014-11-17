/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {

  index: function(req, res) {
    res.view();
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },

  // http://developer.github.com/v3/
  // http://developer.github.com/v3/oauth/#scopes
  github: function(req, res) {
    passport.authenticate('github', { failureRedirect: '/login' }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

  // https://developers.facebook.com/docs/
  // https://developers.facebook.com/docs/reference/login/
  facebook: function(req, res) {
    passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

  // https://developers.google.com/
  // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
  google: function(req, res) {
    passport.authenticate('google', { failureRedirect: '/login', scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

  // https://apps.twitter.com/
  // https://apps.twitter.com/app/new
  twitter: function(req, res) {
    passport.authenticate('twitter', { failureRedirect: '/login' }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

  local: function(req, res) {
    passport.authenticate('local', { failureRedirect: '/login' }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  },

  register: function(req,res) {
    var body = req.body;

    // if any of these are missing
    if(!(body.first_name && body.password && body.email && body.last_name)){
      req.flash('error', 'please complete all fields');
      return res.redirect('/register');
    }

    User.create({
      email: body.email,
      firstname: body.first_name,
      lastname: body.last_name,
      password: body.password,
      provider: 'local'
    }).exec(createCB);

    function createCB(err, doc){

      console.log(err + doc + 'from createCB')


      if (err){
        req.flash('error', err);
        res.redirect('/register');
      }

      req.flash('success', 'user created! Log in!');
      res.redirect('/login');


    }
    

  }
};
