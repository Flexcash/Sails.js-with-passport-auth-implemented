/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var crypto = require('crypto');
var bcrypt = require('bcrypt');

module.exports = {

    adapter: 'mongo',

    attributes: {
        provider: 'STRING',
        uid: {
            type: 'STRING',
            //this is guaranteed to be crazy to do
            defaultsTo: crypto.createHash('sha1').digest('hex')
        },
        name: 'STRING',
        email: {
            type: 'string',
            unique: true
        },
        firstname: 'STRING',
        lastname: 'STRING',
        password: {
            type: 'STRING',
            minLength: 6,
            required: true,
            columnName: 'encrypted_password'
        },


        verifyPassword: function(password){
            return bcrypt.compareSync(password, this.password);
        }


    },


    beforeCreate: function(values, cb) {

        if(!values.password){
            cb();
        }

        // Encrypt password
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) return cb(err);
            values.password = hash;
            //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
            cb();
        });
    }
};