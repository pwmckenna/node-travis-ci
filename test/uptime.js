'use strict';

var TravisCi = require('..');
require('should');

var travis = new TravisCi({
    version: '2.0.0'
});

describe('travis ci uptime api test suite', function () {
    this.timeout(30000);

    it('exposes uptime', function () {
        travis.uptime.should.be.a('function');
    });

    it('successfully calls uptime', function (done) {
        travis.uptime(function (err) {
            if (err) {
                return done(new Error(err));
            }
            done();
        });
    });
});
