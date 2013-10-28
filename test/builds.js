'use strict';

var TravisCi = require('..');
var assert = require('assert');
require('should');

var BUILD_ID = 10380000;

describe('travis ci builds api test suite', function () {
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

    it('exposes builds', function () {
        this.travis.builds.should.be.a('function');
    });

    it('successfully calls builds', function (done) {
        this.travis.builds(function (err, res) {
            if (err) { return done(new Error(err)); }

            assert(res.hasOwnProperty('builds'));
            assert(res.hasOwnProperty('commits'));

            done();
        });
    });

    it('successfully calls builds for a specific build', function (done) {
        this.travis.builds({
            id: BUILD_ID
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            assert(res.hasOwnProperty('build'));
            assert(res.build.id === BUILD_ID);

            done();
        });
    });

    it('successfully cancels a build request', function (done) {
        // trigger a build
        this.travis.requests({
            build_id: BUILD_ID
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            assert(res.hasOwnProperty('result'));
            assert(res.hasOwnProperty('flash'));
            assert(res.result === true);

            // verify that the build was successfully triggered
            this.travis.builds({
                id: BUILD_ID
            }, function (err, res) {
                if (err) { return done(new Error(err)); }

                assert(res.build.id === BUILD_ID);
                assert(res.build.state === 'created');

                // cancel the build
                this.travis.builds.cancel({
                    id: BUILD_ID
                }, function (err) {
                    if (err) { return done(new Error(err)); }

                    // verify that the build was succesfully canceled
                    this.travis.builds({
                        id: BUILD_ID
                    }, function (err, res) {
                        if (err) { return done(new Error(err)); }
                        
                        assert(res.build.id === BUILD_ID);
                        assert(res.build.state === 'canceled');

                        done();
                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });
});
