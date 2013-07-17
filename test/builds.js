'use strict';

var TravisCi = require('..');
var assert = require('assert');
require('should');

var travis = new TravisCi({
    version: '2.0.0'
});

describe('travis ci builds api test suite', function () {
    this.timeout(30000);
    it('exposes builds', function () {
        travis.builds.should.be.a('function');
    });

    it('successfully calls builds', function (done) {
        travis.builds(function (err, res) {
            if (err) {
                return done(new Error(err));
            }

            assert(res.hasOwnProperty('builds'));
            assert(res.hasOwnProperty('commits'));

            done();
        });
    });
});
