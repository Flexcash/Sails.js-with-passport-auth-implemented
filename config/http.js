/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */

 var util = require('util');

module.exports.http = {

    /****************************************************************************
     *                                                                           *
     * Express middleware to use for every Sails request. To add custom          *
     * middleware to the mix, add a function to the middleware config object and *
     * add its key to the "order" array. The $custom key is reserved for         *
     * backwards-compatibility with Sails v0.9.x apps that use the               *
     * `customMiddleware` config option.                                         *
     *                                                                           *
     ****************************************************************************/

    // middleware: {

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP request. (the Sails *
     * router is invoked by the "router" middleware below.)                     *
     *                                                                          *
     ***************************************************************************/

    // order: [
    //   'startRequestTimer',
    //   'cookieParser',
    //   'session',
    //   'myRequestLogger',
    //   'bodyParser',
    //   'handleBodyParserError',
    //   'compress',
    //   'methodOverride',
    //   'poweredBy',
    //   '$custom',
    //   'router',
    //   'www',
    //   'favicon',
    //   '404',
    //   '500'
    // ],

    customMiddleware: function(app) {

        var passport = require('passport'),
            GitHubStrategy = require('passport-github').Strategy,
            FacebookStrategy = require('passport-facebook').Strategy,
            GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
            TwitterStrategy = require('passport-twitter').Strategy,
            LocalStrategy = require('passport-local').Strategy;

        passport.use(new GitHubStrategy({
            clientID: "YOUR_CLIENT_ID",
            clientSecret: "YOUR_CLIENT_SECRET",
            callbackURL: "http://localhost:1337/auth/github/callback"
        }, verifyHandler));

        passport.use(new FacebookStrategy({
            clientID: "add yours",
            clientSecret: "add yours",
            callbackURL: "http://localhost:1337/auth/facebook/callback"
        }, verifyHandler));

        passport.use(new GoogleStrategy({
            clientID: 'YOUR_CLIENT_ID',
            clientSecret: 'YOUR_CLIENT_SECRET',
            callbackURL: 'http://localhost:1337/auth/google/callback'
        }, verifyHandler));

        passport.use(new TwitterStrategy({
            consumerKey: 'YOUR_CLIENT_ID',
            consumerSecret: 'YOUR_CLIENT_SECRET',
            callbackURL: 'http://localhost:1337/auth/twitter/callback'
        }, verifyHandler));

        passport.use(new LocalStrategy({
            usernameField:'email'
        },
            function(username, password, done) {
                User.findOne({
                    email: username
                }, function(err, user) {
                    console.log('the user logged in: ' + util.inspect(user));
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
                    if (!user.verifyPassword(password)) {
                        return done(null, false);
                    }
                    return done(null, user);
                });

            }));

        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(function(user, done) {
            console.log('serialize: ' + util.inspect(user) + '\n user ID: ' + user.uid);
            done(null, user.uid);
        });

        passport.deserializeUser(function(uid, done) {
            console.log('deserialize user!');
            User.findOne({
                uid: uid
            }, function(err, user) {
                done(err, user);
            });
        });




    }




    /****************************************************************************
     *                                                                           *
     * Example custom middleware; logs each request to the console.              *
     *                                                                           *
     ****************************************************************************/



    // myRequestLogger: function (req, res, next) {
    //       console.log("Requested :: ", req.method, req.url);
    //       console.log('suuup');
    //       return next();
    //   }



    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests. By    *
     * default as of v0.10, Sails uses                                          *
     * [skipper](http://github.com/balderdashy/skipper). See                    *
     * http://www.senchalabs.org/connect/multipart.html for other options.      *
     *                                                                          *
     ***************************************************************************/

    // bodyParser: require('skipper')

    // },

    /***************************************************************************
     *                                                                          *
     * The number of seconds to cache flat files on disk being served by        *
     * Express static middleware (by default, these files are in `.tmp/public`) *
     *                                                                          *
     * The HTTP static cache is only active in a 'production' environment,      *
     * since that's the only time Express will cache flat-files.                *
     *                                                                          *
     ***************************************************************************/

    // cache: 31557600000
};


function verifyHandler(token, tokenSecret, profile, done) {
    process.nextTick(function() {

        User.findOne({
            uid: profile.id
        }, function(err, user) {
            if (user) {
                return done(null, user);
            } else {

                var data = {
                    provider: profile.provider,
                    uid: profile.id,
                    name: profile.displayName
                };

                if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                    data.email = profile.emails[0].value;
                }
                if (profile.name && profile.name.givenName) {
                    data.firstname = profile.name.givenName;
                }
                if (profile.name && profile.name.familyName) {
                    data.lastname = profile.name.familyName;
                }

                User.create(data, function(err, user) {
                    return done(err, user);
                });
            }
        });
    });
}