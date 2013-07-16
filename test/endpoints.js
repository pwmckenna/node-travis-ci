'use strict';

// var assert = require('assert');
// var fs = require('fs');
// var request = require('supertest');
// var server = require('../server');


var TravisCi = require('..');
var _ = require('lodash');
require('should');

var travis = new TravisCi({
    version: '2.0.0'
});

describe('travis ci authorization api test suite', function () {
    this.timeout(10000);
    it('exposes endpoints', function () {
        travis.endpoints.should.be.a('function');
    });

    it('successfully calls endpoints', function (done) {
        travis.endpoints(function (err, res) {
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

    it('successfully calls endpoints with a prefix', function (done) {
        travis.endpoints({
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
});
