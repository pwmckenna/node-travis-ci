'use strict';

var TravisCi = require('..');
var assert = require('assert');
require('should');

describe('travis ci branches api test suite', function () {
    this.timeout(30000);

    before(function () {
        this.travis = new TravisCi({
            version: '2.0.0'
        });
    });
    
    it('exposes branches', function () {
        this.travis.branches.should.be.a('function');
    });

    it('successfully calls branches', function (done) {
        this.travis.branches(function (err, res) {
            if (err) {
                return done(new Error(err));
            }

            assert(res.hasOwnProperty('branches'));
            assert(res.hasOwnProperty('commits'));

            done();
        });
    });
});
