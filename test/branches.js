'use strict';

var TravisCi = require('..');
var assert = require('assert');
require('should');

var travis = new TravisCi({
    version: '2.0.0'
});

describe('travis ci branches api test suite', function () {
    this.timeout(30000);
    it('exposes branches', function () {
        travis.branches.should.be.a('function');
    });

    it('successfully calls branches', function (done) {
        travis.branches(function (err, res) {
            if (err) {
                return done(new Error(err));
            }

            assert(res.hasOwnProperty('branches'));
            assert(res.hasOwnProperty('commits'));

            done();
        });
    });
});
