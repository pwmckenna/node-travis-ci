'use strict';

var q = require('q');
require('should');
var assert = require('assert');

module.exports = [
    {
        uri: '/broadcasts/',
        verb: 'GET',
        tests: function () {
            it('exposes broadcasts', function () {
                this.publicTravis.broadcasts.should.be.a('object');
                this.publicTravis.broadcasts.get.should.be.a('function');
                this.privateTravis.broadcasts.should.be.a('object');
                this.privateTravis.broadcasts.get.should.be.a('function');
            });

            it('does not have permission to view broadcasts without authenticating', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.broadcasts.get({}, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function () {
                    throw new Error('expected an error');
                }, function () {}).then(function () {
                    var defer = q.defer();
                    this.privateTravis.broadcasts.get({}, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).nodeify(done);
            });

            it('gets broadcasts after authenticating', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.broadcasts.get({}, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('broadcasts'));
                }).nodeify(done);
            });
        }
    }
];