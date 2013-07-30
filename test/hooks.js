'use strict';

var TravisCi = require('..');
require('should');
var _ = require('lodash');

describe('travis ci hooks api test suite', function () {
    this.timeout(30000);

    before(function (done) {
        this.publicTravis = new TravisCi({
            version: '2.0.0'
        });
        this.privateTravis = new TravisCi({
            version: '2.0.0'
        });
        this.privateTravis.auth.github({
            github_token: process.env.GITHUB_OAUTH_TOKEN
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            var token = res.access_token;

            this.privateTravis.authenticate({
                access_token: token
            }, function (err) {
                if (err) { return done(new Error(err)); }
                done();
            });
        }.bind(this));
    });

    it('exposes hooks', function () {
        this.publicTravis.hooks.should.be.a('function');
        this.privateTravis.hooks.should.be.a('function');
    });

    it('does not have permission to view hooks without authenticating', function (done) {
        this.publicTravis.hooks({}, function (err) {
            if (!err) { return done(new Error('expected an error')); }

            this.privateTravis.hooks({}, function (err) {
                if (err) { return done(new Error(err)); }

                done();
            });
        }.bind(this));
    });

    it('gets hooks after authenticating', function (done) {
        this.privateTravis.hooks({}, function (err, res) {
            if (err) { return done(new Error(err)); }

            var hooks = res.hooks;

            var hook = _.findWhere(hooks, {
                name: 'node-travis-ci',
                owner_name: 'pwmckenna',
                description: 'node library to access the Travis-CI API',
                active: true,
                private: false,
                admin: true
            });

            if (!hook) {
                return done(new Error('hooks did not contain expected hook for node-travis-ci'));
            }

            done();
        });
    });

    it('toggles the hook active property', function (done) {
        this.privateTravis.hooks({}, function (err, res) {
            if (err) { return done(new Error(err)); }

            var hooks = res.hooks;

            var hook = _.findWhere(hooks, {
                name: 'node-travis-ci',
                owner_name: 'pwmckenna',
                description: 'node library to access the Travis-CI API',
                active: true,
                private: false,
                admin: true
            });

            if (!hook) {
                return done(new Error('hooks did not contain expected hook for node-travis-ci'));
            }

            this.privateTravis.hooks({
                id: hook.id,
                hook: {
                    active: false
                }
            }, function (err) {
                if (err) { return done(new Error(err)); }

                this.privateTravis.hooks(function (err, res) {
                    if (err) { return done(new Error(err)); }

                    var hooks = res.hooks;

                    var hook = _.findWhere(hooks, {
                        name: 'node-travis-ci',
                        owner_name: 'pwmckenna',
                        description: 'node library to access the Travis-CI API',
                        active: false,
                        private: false,
                        admin: true
                    });

                    if (!hook) {
                        return done(new Error('hooks did not contain expected hook for node-travis-ci'));
                    }

                    this.privateTravis.hooks({
                        id: hook.id,
                        hook: {
                            active: true
                        }
                    }, function (err) {
                        if (err) { return done(new Error(err)); }

                        this.privateTravis.hooks(function (err, res) {
                            if (err) { return done(new Error(err)); }

                            var hooks = res.hooks;

                            var hook = _.findWhere(hooks, {
                                name: 'node-travis-ci',
                                owner_name: 'pwmckenna',
                                description: 'node library to access the Travis-CI API',
                                active: true,
                                private: false,
                                admin: true
                            });

                            if (!hook) {
                                return done(new Error('hooks did not contain expected hook for node-travis-ci'));
                            }

                            done();
                        });
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });
});
