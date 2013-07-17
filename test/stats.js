'use strict';

var TravisCi = require('..');
var assert = require('assert');
require('should');

describe('travis ci stats api test suite', function () {
    this.timeout(10000);

    before(function () {
        this.travis = new TravisCi({
            version: '2.0.0'
        });
    });

    it('exposes stats', function () {
        this.travis.stats.repos.should.be.a('function');
        this.travis.stats.tests.should.be.a('function');
    });

    it('successfully calls stats.repos', function (done) {
        this.travis.stats.repos(function (err, res) {
            if (err) {
                return done(new Error(err));
            }

            assert(res.hasOwnProperty('stats'));
            assert(res.stats.hasOwnProperty('params'));
            assert(res.stats.hasOwnProperty('current_user'));

            done();
        });
    });

    it('successfully calls stats.tests', function (done) {
        this.travis.stats.tests(function (err, res) {
            if (err) {
                return done(new Error(err));
            }

            assert(res.hasOwnProperty('stats'));
            assert(res.stats.hasOwnProperty('params'));
            assert(res.stats.hasOwnProperty('current_user'));

            done();
        });
    });
});
