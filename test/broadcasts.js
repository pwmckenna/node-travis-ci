'use strict';

var TravisCi = require('..');
require('should');
var assert = require('assert');

describe('travis ci broadcasts api test suite', function () {
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

    it('exposes broadcasts', function () {
        this.publicTravis.broadcasts.should.be.a('function');
        this.privateTravis.broadcasts.should.be.a('function');
    });

    it('does not have permission to view broadcasts without authenticating', function (done) {
        this.publicTravis.broadcasts({}, function (err) {
            if (!err) { return done(new Error('expected an error')); }

            this.privateTravis.broadcasts({}, function (err) {
                if (err) { return done(new Error(err)); }

                done();
            });
        }.bind(this));
    });

    it('gets broadcasts after authenticating', function (done) {
        this.privateTravis.broadcasts({}, function (err, res) {
            if (err) { return done(new Error(err)); }

            assert(res.hasOwnProperty('broadcasts'));

            done();
        });
    });
});
