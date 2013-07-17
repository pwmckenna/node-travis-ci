'use strict';

var TravisCi = require('..');
var assert = require('assert');
require('should');

describe('travis ci workers api test suite', function () {
    this.timeout(30000);

    before(function () {
        this.travis = new TravisCi({
            version: '2.0.0'
        });
    });

    it('exposes workers', function () {
        this.travis.workers.should.be.a('function');
    });

    it('successfully calls workers', function (done) {
        this.travis.builds(function (err, res) {
            if (err) {
                return done(new Error(err));
            }

            assert(res.hasOwnProperties('builds'));
            assert(res.hasOwnProperties('commits'));

            done();
        });
    });
});
