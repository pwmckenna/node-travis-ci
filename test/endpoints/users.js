'use strict';

var q = require('q');
var assert = require('assert');
var _ = require('lodash');

module.exports = [
    {
        uri: '/users/',
        verb: 'GET',
        tests: function () {
            it('/users/', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.users.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    var user = res.user;
                    assert(user.id === 5186);
                    assert(user.name === 'Patrick Williams');
                    assert(user.login === 'pwmckenna');

                    assert(user, 'user did not contain expected info for pwmckenna');
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/users/permissions',
        verb: 'GET',
        tests: function () {
            it('/users/permissions', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.users.permissions.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('permissions'));
                    assert(_.isArray(res.permissions));
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/users/:id',
        verb: 'GET',
        tests: function () {
            it('/users/:id', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.users(5186).get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    var user = res.user;
                    assert(user.id === 5186);
                    assert(user.name === 'Patrick Williams');
                    assert(user.login === 'pwmckenna');

                    assert(user, 'user did not contain expected info for pwmckenna');
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/users/:id?',
        verb: 'PUT',
        tests: function () {
            console.warn('PUT /users/:id? - NO TESTS');
        }
    },
    {
        uri: '/users/sync',
        verb: 'POST',
        tests: function () {
            it('/users/sync', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.users.sync.post(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('result'));
                    assert(res.result === true);
                }).nodeify(done);
            });
        }
    }
];