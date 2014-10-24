'use strict';

var q = require('q');
var assert = require('assert');
var _ = require('lodash');
require('should');

module.exports = [
    {
        uri: '/endpoints/',
        verb: 'GET',
        tests: function () {
            it('/endpoints/', function () {
                this.publicTravis.endpoints.should.be.a('function');
            });

            it('/endpoints/', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.endpoints.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    var homeRoutes = _.findWhere(res, {
                        name: 'Home'
                    });
                    var validResponse = homeRoutes && homeRoutes.hasOwnProperty('prefix') && homeRoutes.prefix === '/';
                    assert(validResponse, 'invalid endpoints response');
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/endpoints/:prefix',
        verb: 'GET',
        tests: function () {
            it('/endpoints/:prefix', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.endpoints('endpoints').get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    var validResponse = res && res.hasOwnProperty('prefix') && res.prefix === '/endpoints';
                    assert(validResponse, 'invalid endpoints response');
                }).nodeify(done);
            });
        }
    }
];