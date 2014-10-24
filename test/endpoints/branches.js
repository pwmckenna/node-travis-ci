'use strict';

var q = require('q');
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
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.branches.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('branches'));
                    assert(res.hasOwnProperty('commits'));
                }).nodeify(done);
            });
        }
    }
];