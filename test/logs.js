'use strict';

var TravisCi = require('..');
// var _ = require('lodash');
var assert = require('assert');
require('should');

describe('travis ci logs api test suite', function () {
    this.timeout(30000);

    before(function () {
        this.travis = new TravisCi({
            version: '2.0.0'
        });
    });

    it('exposes logs', function () {
        this.travis.logs.should.be.a('function');
    });

    it('successfully get log for random job', function (done) {
        this.travis.logs({
            id: 3986694
        }, function (err, res) {
            if (err) {
                return done(new Error(err));
            }

            assert(res.hasOwnProperty('log'));
            assert(res.log.hasOwnProperty('id'));
            assert(res.log.id === 3986694);
            assert(res.log.hasOwnProperty('job_id'));
            assert(res.log.job_id === 9624444);
            assert(res.log.hasOwnProperty('type'));
            assert(res.log.type === 'Log');
            assert(res.log.hasOwnProperty('body'));
            done();
        }.bind(this));
    });
});
