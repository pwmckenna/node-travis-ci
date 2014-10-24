'use strict';

// var _ = require('lodash');
var assert = require('assert');

module.exports = [
    {
        uri: '/logs/:id',
        verb: 'GET',
        tests: function () {
            it('/logs/:id', function (done) {
                this.publicTravis.logs(3986694).get(function (err, res) {
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
        }
    }
];