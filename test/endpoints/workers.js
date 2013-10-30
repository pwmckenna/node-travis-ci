'use strict';

var assert = require('assert');
var _ = require('lodash');

module.exports = [
    {
        uri: '/workers/',
        verb: 'GET',
        tests: function () {
            it('/workers/', function (done) {
                this.publicTravis.workers(function (err, res) {
                    if (err) { return done(new Error(done)); }

                    assert(res.hasOwnProperty('workers'));
                    assert(_.isArray(res.workers));
                    done();
                });
            });
        }
    },
    {
        uri: '/workers/:id',
        verb: 'GET',
        tests: function () {
            console.log('/workers/:id - NO KNOWN WORKER ID USABLE FOR TESTING');
        }
    }
];