'use strict';

var q = require('q');
var assert = require('assert');
var _ = require('lodash');

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
                q.resolve().then(function () {

                    var jobs = q.defer();
                    this.publicTravis.jobs({
                        id: STATIC_JOB_ID
                    }, jobs.makeNodeResolver());
                    return jobs.promise;

                }.bind(this)).then(function (res) {

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

                }).then(function () {
                    done();
                }).fail(function (err) {
                    done(new Error(err));
                });
            });
        }
    },
    {
        uri: '/jobs/:job_id/log',
        verb: 'GET',
        tests: function () {
            var JOB_ID = 13291449;

            it('/jobs/:job_id/log', function (done) {
                this.timeout(60000);
                q.resolve().then(function () {

                    var log = q.defer();
                    this.publicTravis.jobs.log({
                        job_id: JOB_ID
                    }, log.makeNodeResolver());
                    return log.promise;

                }.bind(this)).then(function () {
                    done();
                }).fail(function (err) {
                    done(new Error(err));
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
                q.resolve().then(function () {

                    // trigger the build
                    var requests = q.defer();
                    this.privateTravis.requests({
                        build_id: BUILD_ID_2
                    }, requests.makeNodeResolver());
                    return requests.promise;

                }.bind(this)).then(function (res) {

                    // verify that the build request succeeded
                    assert(res.hasOwnProperty('result'));
                    assert(res.result === true);
                    assert(res.hasOwnProperty('flash'));
                    assert(_.isArray(res.flash));
                    assert(!_.any(res.flash, function (flash) {
                        return flash.hasOwnProperty('error');
                    }), 'build request should not return errors');

                }).then(function () {

                    // verify that the build was successfully triggered
                    var builds = q.defer();
                    this.privateTravis.builds({
                        id: BUILD_ID_2
                    }, builds.makeNodeResolver());
                    return builds.promise;

                }.bind(this)).then(function (res) {

                    assert(res.build.id === BUILD_ID_2);
                    assert(res.build.state === 'created');

                    // cancel the build
                    var cancel = q.defer();
                    this.privateTravis.jobs.cancel({
                        id: res.jobs[0].id
                    }, cancel.makeNodeResolver());
                    return cancel.promise;

                }.bind(this)).then(function () {

                    // verify that the build was succesfully canceled
                    var builds = q.defer();
                    this.privateTravis.builds({
                        id: BUILD_ID_2
                    }, builds.makeNodeResolver());
                    return builds.promise;

                }.bind(this)).then(function (res) {

                    assert(res.build.id === BUILD_ID_2);
                    assert(res.build.state === 'canceled');

                }).then(function () {
                    done();
                }).fail(function (err) {
                    done(new Error(err));
                });
            });
        }
    },
    {
        uri: '/jobs/:id/restart',
        verb: 'POST',
        tests: function () {
            // var BUILD_ID = 16675161;
            // var JOB_ID = 16675162;

            it('/jobs/:id/restart', function (done) {
                var BUILD_ID = 16675161;

                q.resolve().then(function () {
                    var builds = q.defer();
                    this.privateTravis.repos.builds({
                        owner_name: 'pwmckenna',
                        name: 'node-travis-ci'
                    }, builds.makeNodeResolver());
                    return builds.promise;
                }.bind(this)).then(function (res) {

                    assert(res.hasOwnProperty('builds'));
                    assert(res.hasOwnProperty('commits'));

                    var build = _.findWhere(res.builds, {
                        id: BUILD_ID
                    });

                    assert(build);
                    assert(_.isArray(build.job_ids));
                    assert(build.job_ids.length);
                    var jobId = build.job_ids[0];
                    
                    var restart = q.defer();
                    this.privateTravis.jobs.restart({
                        id: jobId
                    }, restart.makeNodeResolver());
                    return restart.promise;

                }.bind(this)).then(function (res) {

                    assert(res.hasOwnProperty('result'));
                    assert(res.result === true);
                    assert(res.hasOwnProperty('flash'));
                    assert(_.isArray(res.flash));
                    assert(!_.any(res.flash, function (flash) {
                        return flash.hasOwnProperty('error');
                    }), 'build request should not return errors');

                }).fin(function () {
                    // cancel the build to keep our tests tidy
                    var cancel = q.defer();
                    this.privateTravis.builds.cancel({
                        id: BUILD_ID
                    }, cancel.makeNodeResolver());
                    return cancel.promise;

                }.bind(this)).then(function () {
                    done();
                }).fail(function (err) {
                    done(new Error(err));
                });
            });
        }
    }
];
