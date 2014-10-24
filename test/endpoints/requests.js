'use strict';

var assert = require('assert');
var _ = require('lodash');
var q = require('q');

module.exports = [
    {
        uri: '/requests/',
        verb: 'GET',
        tests: function () {
            console.warn('/requests/ - UNKNOWN PURPOSE. LIKES TO RETURN ERRORS.');
        }
    },
    {
        uri: '/requests/:id',
        verb: 'GET',
        tests: function () {
            console.warn('/requests/ - UNKNOWN PURPOSE. LIKES TO RETURN ERRORS.');
        }
    },
    {
        uri: '/requests/',
        verb: 'POST',
        tests: function () {
            it('/requests/', function (done) {
                var BUILD_ID = 16675161;

                q.resolve().then(function () {
                    var builds = q.defer();
                    this.privateTravis.repos('pwmckenna', 'node-travis-ci').builds.get(builds.makeNodeResolver());
                    return builds.promise;
                }.bind(this)).then(function (res) {

                    assert(res.hasOwnProperty('builds'));
                    assert(res.hasOwnProperty('commits'));

                    assert(_.findWhere(res.builds, {
                        id: BUILD_ID
                    }));

                    var defer = q.defer();
                    this.privateTravis.requests(BUILD_ID).get(defer.makeNodeResolver());
                    return defer.promise;

                }.bind(this)).then(function (res) {

                    assert(res.hasOwnProperty('result'));
                    assert(res.result === true);
                    assert(res.hasOwnProperty('flash'));
                    assert(_.isArray(res.flash));
                    assert(!_.any(res.flash, function (flash) {
                        return flash.hasOwnProperty('error');
                    }), 'build request should not return errors');

                }).fin(function () {
                    // cancel the build to keep our tests tidy
                    var defer = q.defer();
                    this.privateTravis.builds(BUILD_ID).cancel.post(defer.makeNodeResolver());
                    return defer.promise;

                }.bind(this)).nodeify(done);
            });
        }
    }
];