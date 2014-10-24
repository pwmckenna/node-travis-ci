'use strict';

require('should');
var _ = require('lodash');

module.exports = [
    {
        uri: '/hooks/',
        verb: 'GET',
        tests: function () {
            it('/hooks/ - does not have permission to view hooks without authenticating', function (done) {
                this.publicTravis.hooks.get(function (err) {
                    if (!err) { return done(new Error('expected an error')); }

                    this.privateTravis.hooks(function (err) {
                        if (err) { return done(new Error(err)); }

                        done();
                    });
                }.bind(this));
            });

            it('/hooks/', function (done) {
                this.privateTravis.hooks.get(function (err, res) {
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
        }
    },
    {
        uri: '/hooks/:id?',
        verb: 'PUT',
        tests: function () {
            it('/hooks/:id - toggles the hook active property', function (done) {
                this.privateTravis.hooks.get(function (err, res) {
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
                        console.warn(hooks);
                        return done(new Error('hooks did not contain expected hook for node-travis-ci'));
                    }

                    this.privateTravis.hooks(hook.id).put({
                        hook: {
                            active: false
                        }
                    }, function (err) {
                        if (err) { return done(new Error(err)); }

                        this.privateTravis.hooks.get(function (err, res) {
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

                            this.privateTravis.hooks(hook.id).put({
                                hook: {
                                    active: true
                                }
                            }, function (err) {
                                if (err) { return done(new Error(err)); }

                                this.privateTravis.hooks.get(function (err, res) {
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
        }
    }
];