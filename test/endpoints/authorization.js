'use strict';

var q = require('q');
var assert = require('assert');

module.exports = [
    {
        uri: '/auth/authorize',
        verb: 'GET',
        tests: function () {
            console.warn('GET /auth/authorize NOT IMPLEMENTED');
        }
    },
    {
        uri: '/auth/access_token',
        verb: 'POST',
        tests: function () {
            console.warn('POST /auth/access_token NOT IMPLEMENTED');
        }
    },
    {
        uri: '/auth/github',
        verb: 'POST',
        tests: function () {
            it('/auth/github', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.auth.github.post({
                        'asdf': 'asdf'
                    }, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function () {
                    throw new Error('expected an error');
                }, function () {}).nodeify(done);
            });

            it('/auth/github', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.auth.github.post({
                        github_token: process.env.GITHUB_OAUTH_TOKEN
                    }, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('access_token'));
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/auth/handshake',
        verb: 'GET',
        tests: function () {
            console.warn('GET /auth/handshake NOT USABLE VIA API');
        }
    },
    {
        uri: '/auth/post_message',
        verb: 'GET',
        tests: function () {
            console.warn('GET /auth/post_message NOT USABLE VIA API');
        }
    },
    {
        uri: '/auth/post_message/iframe',
        verb: 'GET',
        tests: function () {
            console.warn('GET /auth/post_message/iframe NOT USABLE VIA API');
        }
    }
];