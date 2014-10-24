'use strict';

var assert = require('assert');
require('should');

module.exports = [
    {
        uri: '/branches/',
        verb: 'GET',
        tests: function () {
            it('/branches/', function () {
                this.publicTravis.branches.get.should.be.a('function');
            });

            it('/branches/', function (done) {
                this.publicTravis.branches.get(function (err, res) {
                    if (err) {
                        return done(new Error(err));
                    }

                    assert(res.hasOwnProperty('branches'));
                    assert(res.hasOwnProperty('commits'));

                    done();
                });
            });
        }
    }
];