'use strict';

var assert = require('assert');
var _ = require('lodash');

module.exports = [
    {
        uri: '/',
        verb: 'GET',
        tests: function () {
            console.warn('/ NOT USABLE VIA API');
        }
    },
    {
        uri: '/redirect',
        verb: 'GET',
        tests: function () {
            console.warn('/redirect NOT USABLE VIA API');
        }
    },
    {
        uri: '/config',
        verb: 'GET',
        tests: function () {
            it('/config', function (done) {
                this.publicTravis.config.get(function (err, res) {
                    if (err) { return done(new Error(err)); }
                    console.log(JSON.stringify(res, null, 4));
                    assert(_.isEqual(res, {
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
                    }));
                    done();
                });
            });
        }
    }
];