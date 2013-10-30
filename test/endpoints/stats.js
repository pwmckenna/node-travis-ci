'use strict';

var assert = require('assert');

module.exports = [
    {
        uri: '/stats/repos',
        verb: 'GET',
        tests: function () {
            it('/stats/repos', function (done) {
                this.publicTravis.stats.repos(function (err, res) {
                    if (err) {
                        return done(new Error(err));
                    }

                    assert(res.hasOwnProperty('stats'));
                    assert(res.stats.hasOwnProperty('params'));
                    assert(res.stats.hasOwnProperty('current_user'));

                    done();
                });
            });
        }
    },
    {
        uri: '/stats/tests',
        verb: 'GET',
        tests: function () {
            it('/stats/tests', function (done) {
                this.publicTravis.stats.tests(function (err, res) {
                    if (err) {
                        return done(new Error(err));
                    }

                    assert(res.hasOwnProperty('stats'));
                    assert(res.stats.hasOwnProperty('params'));
                    assert(res.stats.hasOwnProperty('current_user'));

                    done();
                });
            });
        }
    }
];