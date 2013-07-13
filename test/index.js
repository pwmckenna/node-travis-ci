'use strict';

// var assert = require('assert');
// var fs = require('fs');
// var request = require('supertest');
// var server = require('../server');


var TravisCi = require('..');
require('should');

describe('travis ci api test suite', function () {
    it('expects an api version', function () {
        var thrower = function () {
            new TravisCi();
        };
        thrower.should.throw();
    });

    it('only supports version 2.0.0', function () {
        var thrower = function () {
            new TravisCi({
                version: '3.0.0'
            });
        };
        thrower.should.throw();

        new TravisCi({
            version: '2.0.0'
        });
    });

    it('exposes auth.github', function () {
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.should.have.keys(['auth']);
        travis.auth.should.have.keys(['github']);
        travis.auth.github.should.be.a('function');
    });

    it('fails auth.github call using bad github oauth token', function (done) {
        this.timeout(60000);
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.auth.github('asdf', function (err) {
            if (err) {
                done();
            } else {
                done(new Error('expected an error'));
            }
        });
    });

    it('successful auth.github call using valid github oauth token', function (done) {
        this.timeout(60000);
        var travis = new TravisCi({
            version: '2.0.0'
        });
        travis.auth.github(process.env.GITHUB_OAUTH_TOKEN, function (err) {
            if (err) {
                done(new Error(err));
            } else {
                done();
            }
        });
    });
});
