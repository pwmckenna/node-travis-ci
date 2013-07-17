'use strict';

var TravisCi = require('..');
var _ = require('lodash');
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
        this.travis.jobs(function (err, res) {
            if (err) {
                return done(new Error(err));
            }

            assert(res.hasOwnProperty('jobs'));
            assert(_.isArray(res.jobs));

            var job = res.jobs[0];
            assert(job.hasOwnProperty('log_id'));

            this.travis.logs({
                id: job.log_id
            }, function (err, res) {
                if (err) {
                    return done(new Error(err));
                }

                assert(res.hasOwnProperty('log'));
                var log = res.log;
                assert(log.hasOwnProperty('id'));
                assert(log.id === job.log_id);
                assert(log.job_id === job.id);
                assert(log.type === 'Log');
                assert(log.hasOwnProperty('body'));

                done();
            });
        }.bind(this));
    });
});
