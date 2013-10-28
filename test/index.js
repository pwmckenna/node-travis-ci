'use strict';

var fs = require('fs');
var path = require('path');
var TravisCi = require('..');
var _ = require('lodash');
require('should');

describe('travis ci api test suite', function () {
    this.timeout(30000);

    it('expects an api version', function () {
        var thrower = function () {
            new TravisCi();
        };
        thrower.should.throw();
    });

    it('only supports version 2.0.0', function () {
        var thrower = function () {
            new TravisCi({
                version: '3.0.0'
            });
        };
        thrower.should.throw();

        new TravisCi({
            version: '2.0.0'
        });
    });

    it('has up to date route definitions', function (done) {
        var travis = new TravisCi({
            version: '2.0.0'
        });
        var routesPath = path.resolve(__dirname, '../api/v2.0.0/routes.json');
        var routes = JSON.parse(fs.readFileSync(routesPath).toString());

        travis.endpoints(function (err, res) {
            if (!_.isEqual(routes, res)) {
                return done(new Error('stale route definitions'));
            }
            done();
        });
    });
});
