'use strict';

var TravisCi = require('..');
require('should');

describe('travis ci documentation api test suite', function () {
    this.timeout(30000);

    before(function () {
        this.travis = new TravisCi({
            version: '2.0.0'
        });
    });

    it('exposes docs', function () {
        this.travis.broadcasts.should.be.a('function');
    });

    it('successfully calls docs', function (done) {
        this.travis.docs(function (err) {
            if (err) {
                return done(new Error(err));
            }

            done();
        });
    });

});