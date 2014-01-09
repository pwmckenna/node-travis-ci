'use strict';

var assert = require('assert');
var _ = require('lodash');

module.exports = [
    {
        uri: '/requests/',
        verb: 'POST',
        tests: function () {
            it('/requests/', function (done) {
                this.privateTravis.repos.builds({
                    owner_name: 'pwmckenna',
                    name: 'node-travis-ci'
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('builds'));
                    assert(res.hasOwnProperty('commits'));

                    var BUILD_ID = 9635080;
                    assert(_.findWhere(res.builds, {
                        id: BUILD_ID
                    }));
                    this.privateTravis.requests({
                        build_id: BUILD_ID
                    }, function (err, res) {
                        if (err) { return done(new Error(err)); }

                        assert(res.hasOwnProperty('result'));
                        assert(res.result === true);
                        assert(res.hasOwnProperty('flash'));
                        assert(_.isArray(res.flash));
                        assert(!_.any(res.flash, function (flash) {
                            console.warn(JSON.stringify(flash, null, 4));
                            return flash.hasOwnProperty('error');
                        }), 'build request should not return errors');

                        // cancel the build to keep our tests tidy
                        this.privateTravis.builds.cancel({
                            id: BUILD_ID
                        }, function (err) {
                            if (err) { return done(new Error(err)); }

                            done();
                        });
                    }.bind(this));
                }.bind(this));
            });
        }
    }
];