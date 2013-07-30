'use strict';

var TravisCi = require('..');
require('should');

describe('travis ci authentication test suite', function () {
    this.timeout(30000);

    it('exposes authenticate', function () {
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.authenticate.should.be.a('function');
    });

    it('successful authenticate call using valid github oauth token generated access token', function (done) {
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.auth.github({
            github_token: process.env.GITHUB_OAUTH_TOKEN
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            travis.authenticate({
                access_token: res.access_token
            }, function (err) {
                if (err) { return done(new Error(err)); }

                done();
            });
        });
    });
    
    it('successful authenticate call using valid github oauth token', function (done) {
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.authenticate({
            github_token: process.env.GITHUB_OAUTH_TOKEN
        }, function (err) {
            if (err) { return done(new Error(err)); }

            done();
        });
    });

    it('successful authenticate call using valid github username and password', function (done) {
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.authenticate({
            username: process.env.GITHUB_USERNAME,
            password: process.env.GITHUB_PASSWORD
        }, function (err) {
            if (err) { return done(new Error(err)); }

            done();
        });
    });

    it('successful pro authenticate call using valid github username and password', function (done) {
        var travis = new TravisCi({
            version: '2.0.0',
            pro: true
        });
        travis.authenticate({
            username: process.env.GITHUB_USERNAME,
            password: process.env.GITHUB_PASSWORD
        }, function (err) {
            if (err) { return done(new Error(err)); }

            done();
        });
    });
});