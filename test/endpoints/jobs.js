'use strict';

var assert = require('assert');
var _ = require('lodash');

var BUILD_ID = 13281947;
var JOB_ID = 13281948;

var BUILD_ID_2 = 9921073;

var STATIC_BUILD_ID = 9656943;
var STATIC_JOB_ID = 9656944;

module.exports = [
    {
        uri: '/jobs/',
        verb: 'GET',
        tests: function () {
            console.warn('/jobs/ - TOO INEFFICIENT FOR USE');
        }
    },
    {
        uri: '/jobs/:id',
        verb: 'GET',
        tests: function () {
            it('/jobs/:id', function (done) {
                this.timeout(60000);
                this.publicTravis.jobs({
                    id: STATIC_JOB_ID
                }, function (err, res) {
                    if (err) {
                        return done(new Error(err));
                    }
                    assert(_.isEqual(res, {
                        'job': {
                            'id': STATIC_JOB_ID,
                            'repository_id': 1095505,
                            'repository_slug': 'pwmckenna/node-travis-ci',
                            'build_id': STATIC_BUILD_ID,
                            'commit_id': 2845676,
                            'log_id': 4010707,
                            'number': '39.1',
                            'config': {
                                'language': 'node_js',
                                'node_js': '0.10.1',
                                'script': [
                                    './node_modules/grunt-cli/bin/grunt test'
                                ],
                                '.result': 'configured',
                                'global_env': 'GITHUB_OAUTH_TOKEN=[secure] GITHUB_USERNAME=[secure] GITHUB_PASSWORD=[secure]'
                            },
                            'state': 'passed',
                            'started_at': '2013-08-02T23:35:40Z',
                            'finished_at': '2013-08-02T23:36:40Z',
                            'queue': 'builds.linux',
                            'allow_failure': false,
                            'tags': ''
                        },
                        'commit': {
                            'id': 2845676,
                            'sha': '7d8c6b1e14041ed17b794d8453617e0992e09586',
                            'branch': 'master',
                            'message': '1.0.0',
                            'committed_at': '2013-07-30T16:54:56Z',
                            'author_name': 'Patrick Williams',
                            'author_email': 'pwmckenna@gmail.com',
                            'committer_name': 'Patrick Williams',
                            'committer_email': 'pwmckenna@gmail.com',
                            'compare_url': 'https://github.com/pwmckenna/node-travis-ci/compare/cf14e82161a1...7d8c6b1e1404'
                        }
                    }));

                    done();
                });
            });
        }
    },
    {
        uri: '/jobs/:job_id/log',
        verb: 'GET',
        tests: function () {
            it('/jobs/:job_id/log', function (done) {
                this.timeout(60000);
                this.publicTravis.jobs.log({
                    job_id: JOB_ID
                }, function (err) {
                    if (err) { return done(new Error(err)); }

                    done();
                });
            });
        }
    },
    {
        uri: '/jobs/:id/cancel',
        verb: 'POST',
        tests: function () {
            it('/jobs/:id/cancel', function (done) {
                // trigger a build
                this.privateTravis.requests({
                    build_id: BUILD_ID_2
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('result'));
                    assert(res.result === true);
                    assert(res.hasOwnProperty('flash'));
                    assert(_.isArray(res.flash));
                    assert(!_.any(res.flash, function (flash) {
                        return flash.hasOwnProperty('error');
                    }), 'build request should not return errors');

                    // verify that the build was successfully triggered
                    this.privateTravis.builds({
                        id: BUILD_ID_2
                    }, function (err, res) {
                        if (err) { return done(new Error(err)); }

                        assert(res.build.id === BUILD_ID_2);
                        assert(res.build.state === 'created');

                        // cancel the build
                        this.privateTravis.jobs.cancel({
                            id: res.jobs[0].id
                        }, function (err) {
                            if (err) { return done(new Error(err)); }

                            // verify that the build was succesfully canceled
                            this.privateTravis.builds({
                                id: BUILD_ID_2
                            }, function (err, res) {
                                if (err) { return done(new Error(err)); }
                                
                                assert(res.build.id === BUILD_ID_2);
                                assert(res.build.state === 'canceled');

                                done();
                            });
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            });
        }
    },
    {
        uri: '/jobs/:id/restart',
        verb: 'POST',
        tests: function () {
            it('/jobs/:id/restart', function (done) {
                // request the build to start it off...
                // we can only restart in progress jobs
                this.privateTravis.requests({
                    build_id: BUILD_ID
                }, function (err) {
                    if (err) { return done(new Error(err)); }

                    this.privateTravis.jobs.restart({
                        id: JOB_ID
                    }, function (err, res) {
                        if (err) { return done(new Error(err)); }

                        assert(res.hasOwnProperty('result'));
                        assert(res.result === true);
                        assert(res.hasOwnProperty('flash'));
                        assert(_.isArray(res.flash));
                        assert(!_.any(res.flash, function (flash) {
                            return flash.hasOwnProperty('error');
                        }), 'build request should not return errors');

                        // verify that the build was successfully triggered
                        this.privateTravis.builds({
                            id: BUILD_ID
                        }, function (err, res) {
                            if (err) { return done(new Error(err)); }
                            assert(res.build.id === BUILD_ID);
                            assert(res.build.state === 'created');

                            // cancel the build
                            this.privateTravis.builds.cancel({
                                id: BUILD_ID
                            }, function (err) {
                                if (err) { return done(new Error(err)); }

                                // verify that the build was succesfully canceled
                                this.privateTravis.builds({
                                    id: BUILD_ID
                                }, function (err, res) {
                                    if (err) { return done(new Error(err)); }
                                    
                                    assert(res.build.id === BUILD_ID);
                                    assert(res.build.state === 'canceled');

                                    done();
                                });
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            });
        }
    }
];
