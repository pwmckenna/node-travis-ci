'use strict';

var q = require('q');
var assert = require('assert');
var _ = require('lodash');

var EXPECTED_CONFIG = {
    config: {
        host: 'travis-ci.org',
        shorten_host: 'trvs.io',
        assets: {
            host: 'travis-ci.org'
        },
        pusher: {
            key: '5df8ac576dcccf4fd076'
        },
        github: {
            api_url: 'https://api.github.com',
            scopes: [
                'read:org',
                'user:email',
                'repo_deployment',
                'repo:status',
                'write:repo_hook'
            ]
        }
    }
};

module.exports = [
    {
        uri: '/',
        verb: 'GET',
        tests: function () {
            console.warn('GET / NOT USABLE VIA API');
        }
    },
    {
        uri: '/redirect',
        verb: 'GET',
        tests: function () {
            console.warn('GET /redirect NOT USABLE VIA API');
        }
    },
    {
        uri: '/config',
        verb: 'GET',
        tests: function () {
            it('/config', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.config.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(_.isEqual(res, EXPECTED_CONFIG), 'expect config to be a very specific object');
                }).nodeify(done);
            });
        }
    }
];