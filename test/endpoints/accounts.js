'use strict';

require('should');
var _ = require('lodash');
var assert = require('assert');

module.exports = [
    {
        uri: '/accounts/',
        verb: 'GET',
        tests: function () {
            it('/accounts/', function () {
                this.publicTravis.accounts.should.be.a('function');
                this.privateTravis.accounts.should.be.a('function');
            });

            it('/accounts/', function (done) {
                this.publicTravis.accounts({}, function (err) {
                    if (!err) { return done(new Error('expected an error')); }

                    this.privateTravis.accounts({}, function (err) {
                        if (err) { return done(new Error(err)); }

                        done();
                    });
                }.bind(this));
            });

            it('/accounts/', function (done) {
                this.privateTravis.accounts({}, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    var accounts = res.accounts;

                    var hook = _.findWhere(accounts, {
                        id: 5186,
                        name: 'Patrick Williams',
                        login: 'pwmckenna',
                        type: 'user',
                    });
                    assert(hook.hasOwnProperty('repos_count'));

                    if (!hook) {
                        return done(new Error('accounts did not contain expected account for pwmckenna'));
                    }

                    done();
                });
            });
        }
    }
];