'use strict';

var TravisCi = require('..');
var assert = require('assert');
var _ = require('lodash');
require('should');

describe('travis ci requests api test suite', function () {
    this.timeout(30000);

    before(function (done) {
        this.travis = new TravisCi({
            version: '2.0.0'
        });

        this.travis.auth.github({
            github_token: process.env.GITHUB_OAUTH_TOKEN
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            var token = res.access_token;

            this.travis.authenticate({
                access_token: token
            }, function (err) {
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

            var BUILD_ID = 10380000;
            assert(_.findWhere(res.builds, {
                id: BUILD_ID
            }));
            this.travis.requests({
                build_id: BUILD_ID
            }, function (err, res) {
                if (err) { return done(new Error(err)); }

                assert(res.hasOwnProperty('result'));
                assert(res.hasOwnProperty('flash'));
                assert(res.result === true);

                // cancel the build to keep our tests tidy
                this.travis.builds.cancel({
                    id: BUILD_ID
                }, function (err) {
                    if (err) { return done(new Error(err)); }

                    done();
                });
            }.bind(this));
        }.bind(this));
    });
});
