'use strict';

var TravisCi = require('..');
require('should');
var assert = require('assert');

describe('travis ci user api test suite', function () {
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

    it('exposes users', function () {
        this.publicTravis.users.should.be.a('function');
        this.privateTravis.users.should.be.a('function');
    });

    it('does not have permission to view users without authenticating', function (done) {
        this.publicTravis.users({}, function (err) {
            if (!err) { return done(new Error('expected an error')); }

            this.privateTravis.users({}, function (err) {
                if (err) { return done(new Error(err)); }

                done();
            });
        }.bind(this));
    });

    it('gets user info after authenticating', function (done) {
        this.privateTravis.users({}, function (err, res) {
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
});
