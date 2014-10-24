'use strict';

var q = require('q');
var assert = require('assert');
require('should');

var BUILD_ID = 13284153;

module.exports = [
    {
        uri: '/builds/',
        verb: 'GET',
        tests: function () {
            console.warn('GET /builds/ - TOO INEFFICIENT FOR USE');
        }
    },
    {
        uri: '/builds/:id',
        verb: 'GET',
        tests: function () {
            it('/builds/:id', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.builds(BUILD_ID).get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('build'));
                    assert(res.build.id === BUILD_ID);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/builds/:id/cancel',
        verb: 'POST',
        tests: function () {
            console.warn('POST /builds/:id/cancel - NO TESTS');
        }
    },
    {
        uri: '/builds/:id/restart',
        verb: 'POST',
        tests: function () {
            console.warn('POST /builds/:id/restart - NO TESTS');
        }
    }
];