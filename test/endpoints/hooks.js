'use strict';

var assert = require('assert');
var q = require('q');
require('should');
var _ = require('lodash');

module.exports = [
    {
        uri: '/hooks/',
        verb: 'GET',
        tests: function () {
            it('/hooks/ - does not have permission to view hooks without authenticating', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.hooks.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function () {
                    throw new Error('expected an error');
                }, function () {}).then(function () {
                    var defer = q.defer();
                    this.privateTravis.hooks.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).nodeify(done);
            });

            it('/hooks/', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.hooks.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    var hooks = res.hooks;

                    var hook = _.findWhere(hooks, {
                        name: 'node-travis-ci',
                        owner_name: 'pwmckenna',
                        description: 'node library to access the Travis-CI API',
                        active: true,
                        private: false,
                        admin: true
                    });

                    assert(hook, 'hooks did not contain expected hook for node-travis-ci');
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/hooks/:id?',
        verb: 'PUT',
        tests: function () {
            it('/hooks/:id - toggles the hook active property', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.hooks.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    var hooks = res.hooks;

                    var hook = _.findWhere(hooks, {
                        name: 'node-travis-ci',
                        owner_name: 'pwmckenna',
                        description: 'node library to access the Travis-CI API',
                        active: true,
                        private: false,
                        admin: true
                    });

                    assert(hook, 'hooks did not contain expected hook for node-travis-ci');
                    return hook;
                }).then(function (hook) {
                    var defer = q.defer();
                    this.privateTravis.hooks(hook.id).put({
                        hook: {
                            active: false
                        }
                    }, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function () {
                    var defer = q.defer();
                    this.privateTravis.hooks.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    var hooks = res.hooks;

                    var hook = _.findWhere(hooks, {
                        name: 'node-travis-ci',
                        owner_name: 'pwmckenna',
                        description: 'node library to access the Travis-CI API',
                        active: false,
                        private: false,
                        admin: true
                    });

                    assert(hook, 'hooks did not contain expected hook for node-travis-ci');
                    return hook;
                }).then(function (hook) {
                    var defer = q.defer();
                    this.privateTravis.hooks(hook.id).put({
                        hook: {
                            active: true
                        }
                    }, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function () {
                    var defer = q.defer();
                    this.privateTravis.hooks.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    var hooks = res.hooks;

                    var hook = _.findWhere(hooks, {
                        name: 'node-travis-ci',
                        owner_name: 'pwmckenna',
                        description: 'node library to access the Travis-CI API',
                        active: true,
                        private: false,
                        admin: true
                    });

                    assert(hook, 'hooks did not contain expected hook for node-travis-ci');
                }).nodeify(done);
            });
        }
    }
];