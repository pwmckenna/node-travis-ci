'use strict';

var TravisCi = require('..');
require('should');

describe('travis ci authorization api test suite', function () {
    this.timeout(10000);

    it('exposes auth.github', function () {
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.auth.github.should.be.a('function');
    });

    it('fails auth.github call using bad github oauth token', function (done) {
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.auth.github({
            'asdf': 'asdf'
        }, function (err) {
            if (err) {
                done();
            } else {
                done(new Error('expected an error'));
            }
        });
    });

    it('successful auth.github call using valid github oauth token', function (done) {
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.auth.github({
            github_token: process.env.GITHUB_OAUTH_TOKEN
        }, function (err) {
            if (err) {
                done(new Error(err));
            } else {
                done();
            }
        });
    });
});
