'use strict';

var assert = require('assert');

module.exports = [
    {
        uri: '/auth/authorize',
        verb: 'GET',
        tests: function () {
            console.warn('/auth/authorize NOT IMPLEMENTED');
        }
    },
    {
        uri: '/auth/access_token',
        verb: 'POST',
        tests: function () {
            console.warn('/auth/access_token NOT IMPLEMENTED');
        }
    },
    {
        uri: '/auth/github',
        verb: 'POST',
        tests: function () {
            it('/auth/github', function (done) {
                this.publicTravis.auth.github({
                    'asdf': 'asdf'
                }, function (err) {
                    if (err) {
                        done();
                    } else {
                        done(new Error('expected an error'));
                    }
                });
            });

            it('/auth/github', function (done) {
                this.publicTravis.auth.github({
                    github_token: process.env.GITHUB_OAUTH_TOKEN
                }, function (err, res) {
                    if (err) {
                        done(new Error(err));
                    } else {
                        assert(res.hasOwnProperty('access_token'));
                        done();
                    }
                });
            });
        }
    },
    {
        uri: '/auth/handshake',
        verb: 'GET',
        tests: function () {
            console.warn('/auth/handshake NOT USABLE VIA API');
        }
    },
    {
        uri: '/auth/post_message',
        verb: 'GET',
        tests: function () {
            console.warn('/auth/post_message NOT USABLE VIA API');
        }
    },
    {
        uri: '/auth/post_message/iframe',
        verb: 'GET',
        tests: function () {
            console.warn('/auth/post_message/iframe NOT USABLE VIA API');
        }
    }
];