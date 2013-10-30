'use strict';

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
                this.publicTravis.endpoints(function (err, res) {
                    var homeRoutes = _.findWhere(res, {
                        name: 'Home'
                    });

                    if (!homeRoutes || !homeRoutes.hasOwnProperty('prefix') || homeRoutes.prefix !== '/') {
                        return done('invalid endpoints response');
                    }

                    if (err) {
                        return done(new Error(err));
                    }

                    done();
                });
            });
        }
    },
    {
        uri: '/endpoints/:prefix',
        verb: 'GET',
        tests: function () {
            it('/endpoints/:prefix', function (done) {
                this.publicTravis.endpoints({
                    prefix: 'endpoints'
                }, function (err, res) {
                    if (err) {
                        return done(new Error(err));
                    }

                    if (!res || !res.hasOwnProperty('prefix') || res.prefix !== '/endpoints') {
                        return done('invalid endpoints response');
                    }

                    done();
                });
            });
        }
    }
];