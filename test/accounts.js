'use strict';

var TravisCi = require('..');
require('should');
var _ = require('lodash');
var assert = require('assert');

describe('travis ci accounts api test suite', function () {
    this.timeout(10000);

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

            this.privateTravis.authenticate(token, function (err) {
                if (err) { return done(new Error(err)); }
                done();
            });
        }.bind(this));
    });

    it('exposes accounts', function () {
        this.publicTravis.accounts.should.be.a('function');
        this.privateTravis.accounts.should.be.a('function');
    });

    it('does not have permission to view accounts without authenticating', function (done) {
        this.publicTravis.accounts({}, function (err) {
            if (!err) { return done(new Error('expected an error')); }

            this.privateTravis.accounts({}, function (err) {
                if (err) { return done(new Error(err)); }

                done();
            });
        }.bind(this));
    });

    it('gets accounts after authenticating', function (done) {
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
});
