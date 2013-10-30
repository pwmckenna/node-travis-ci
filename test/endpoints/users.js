'use strict';

var assert = require('assert');
var _ = require('lodash');

module.exports = [
    {
        uri: '/users/',
        verb: 'GET',
        tests: function () {
            it('/users/', function (done) {
                this.privateTravis.users(function (err, res) {
                    if (err) { return done(new Error(err)); }

                    var user = res.user;
                    assert(user.id === 5186);
                    assert(user.name === 'Patrick Williams');
                    assert(user.login === 'pwmckenna');

                    if (!user) {
                        return done(new Error('user did not contain expected info for pwmckenna'));
                    }

                    done();
                });
            });
        }
    },
    {
        uri: '/users/permissions',
        verb: 'GET',
        tests: function () {
            it('/users/permissions', function (done) {
                this.privateTravis.users.permissions(function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('permissions'));
                    assert(_.isArray(res.permissions));

                    done();
                });
            });
        }
    },
    {
        uri: '/users/:id',
        verb: 'GET',
        tests: function () {
            it('/users/:id', function (done) {
                this.privateTravis.users({
                    id: 5186
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    var user = res.user;
                    assert(user.id === 5186);
                    assert(user.name === 'Patrick Williams');
                    assert(user.login === 'pwmckenna');

                    if (!user) {
                        return done(new Error('user did not contain expected info for pwmckenna'));
                    }

                    done();
                });

            });
        }
    },
    {
        uri: '/users/:id?',
        verb: 'PUT',
        tests: function () {
            console.warn('/users/:id? - NO WAY TO DISTINGUISH BETWEEN GET/PUT ROUTES');
        }
    },
    {
        uri: '/users/sync',
        verb: 'POST',
        tests: function () {
            it('/users/sync', function (done) {
                this.privateTravis.users.sync(function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('result'));
                    assert(res.result === true);

                    done();
                });
            });
        }
    }
];