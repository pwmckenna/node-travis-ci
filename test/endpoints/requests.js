'use strict';

var assert = require('assert');
var _ = require('lodash');
var q = require('q');

module.exports = [
    {
        uri: '/requests/',
        verb: 'POST',
        tests: function () {
            it('/requests/', function (done) {
                var BUILD_ID = 16675161;

                q.resolve().then(function () {
                    var builds = q.defer();
                    this.privateTravis.repos.builds({
                        owner_name: 'pwmckenna',
                        name: 'node-travis-ci'
                    }, builds.makeNodeResolver());
                    return builds.promise;
                }.bind(this)).then(function (res) {

                    assert(res.hasOwnProperty('builds'));
                    assert(res.hasOwnProperty('commits'));

                    assert(_.findWhere(res.builds, {
                        id: BUILD_ID
                    }));

                    var requests = q.defer();
                    this.privateTravis.requests({
                        build_id: BUILD_ID
                    }, requests.makeNodeResolver());
                    return requests.promise;

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
                    var cancel = q.defer();
                    this.privateTravis.builds.cancel({
                        id: BUILD_ID
                    }, cancel.makeNodeResolver());
                    return cancel.promise;

                }.bind(this)).then(function () {
                    done();
                }).fail(function (err) {
                    done(new Error(err));
                });
            });
        }
    }
];