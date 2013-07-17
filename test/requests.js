'use strict';

var TravisCi = require('..');
var assert = require('assert');
require('should');

describe('travis ci requests api test suite', function () {
    this.timeout(10000);

    before(function (done) {
        this.travis = new TravisCi({
            version: '2.0.0'
        });

        this.travis.auth.github({
            github_token: process.env.GITHUB_OAUTH_TOKEN
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            var token = res.access_token;

            this.travis.authenticate(token, function (err) {
                if (err) { return done(new Error(err)); }
                done();
            });
        }.bind(this));
    });

    it('exposes requests', function () {
        this.travis.requests.should.be.a('function');
    });

    it('successfully calls requests', function (done) {
        this.travis.repos.builds({
            owner_name: 'pwmckenna',
            name: 'node-travis-ci'
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            assert(res.hasOwnProperty('builds'));
            assert(res.hasOwnProperty('commits'));

            var build_id = res.builds[0].id;

            this.travis.requests({
                build_id: build_id
            }, function (err, res) {
                if (err) {
                    return done(new Error(err));
                }
                assert(res.hasOwnProperty('result'));
                assert(res.hasOwnProperty('flash'));
                assert(res.result === true);

                done();
            });
        }.bind(this));
    });
});
