'use strict';

var TravisCi = require('..');
var assert = require('assert');
require('should');

describe('travis ci jobs api test suite', function () {
    this.timeout(30000);

    before(function () {
        this.travis = new TravisCi({
            version: '2.0.0'
        });
    });

    it('exposes jobs', function () {
        this.travis.jobs.should.be.a('function');
    });

    it('successfully calls jobs', function (done) {
        this.travis.jobs(function (err, res) {
            if (err) {
                return done(new Error(err));
            }

            assert(res.hasOwnProperty('jobs'));
            assert(res.hasOwnProperty('commits'));
            done();
        });
    });
});
