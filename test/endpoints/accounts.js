'use strict';

require('should');
var _ = require('lodash');
var assert = require('assert');
var q = require('q');

module.exports = [
    {
        uri: '/accounts/',
        verb: 'GET',
        tests: function () {
            it('/accounts/', function () {
                this.publicTravis.accounts.get.should.be.a('function');
                this.privateTravis.accounts.get.should.be.a('function');
            });

            it('/accounts/', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.accounts.get({}, defer.makeNodeResolver());
                    return defer.promise.then(function () {
                        return q.reject('Expected an error');
                    }, function () {
                        return q.resolve();
                    });
                }.bind(this)).then(function () {
                    var defer = q.defer();
                    this.privateTravis.accounts.get({}, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).nodeify(done);
            });

            it('/accounts/', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.accounts.get({}, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    var accounts = res.accounts;
                    var hook = _.findWhere(accounts, {
                        id: 5186,
                        name: 'Patrick Williams',
                        login: 'pwmckenna',
                        type: 'user',
                    });
                    assert(hook);
                    assert(hook.hasOwnProperty('repos_count'));
                }).nodeify(done);
            });
        }
    }
];