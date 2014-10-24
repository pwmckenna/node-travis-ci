'use strict';

var q = require('q');
var assert = require('assert');
var _ = require('lodash');

var BUILD_ID_2 = 9921073;

var STATIC_BUILD_ID = 9656943;
var STATIC_JOB_ID = 9656944;

var EXPECTED_JOB_DATA = {
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
        'tags': '',
        'annotation_ids': []
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
    },
    'annotations': []
};

module.exports = [
    {
        uri: '/jobs/',
        verb: 'GET',
        tests: function () {
            console.warn('GET /jobs/ - TOO INEFFICIENT FOR USE');
        }
    },
    {
        uri: '/jobs/:id',
        verb: 'GET',
        tests: function () {
            it('/jobs/:id', function (done) {
                this.timeout(60000);
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.jobs(STATIC_JOB_ID).get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(_.isEqual(res, EXPECTED_JOB_DATA), 'expect job data to match existing data');
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/jobs/:job_id/log',
        verb: 'GET',
        tests: function () {
            var JOB_ID = '13291449';

            it('/jobs/:job_id/log', function (done) {
                this.timeout(60000);
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.jobs(JOB_ID).log.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).nodeify(done);
            });
        }
    },
    {
        uri: '/jobs/:job_id/annotations',
        verb: 'POST',
        tests: function () {
            console.warn('POST /jobs/:job_id/annotations - NO TESTS');
        }
    },
    {
        uri: '/jobs/:job_id/annotations',
        verb: 'GET',
        tests: function () {
            var JOB_ID = '13291449';

            it('/jobs/:job_id/annotations', function (done) {
                this.timeout(60000);
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.jobs(JOB_ID).annotations.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res && _.isArray(res.annotations), 'expect array of annotations');
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/jobs/:id/log',
        verb: 'PATCH',
        tests: function () {
            console.warn('PATCH /jobs/:id/log - NO TESTS');
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
                    var defer = q.defer();
                    this.privateTravis.requests.post({
                        build_id: BUILD_ID_2
                    }, defer.makeNodeResolver());
                    return defer.promise;
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
                    var defer = q.defer();
                    this.privateTravis.builds(BUILD_ID_2).get(defer.makeNodeResolver());
                    return defer.promise;

                }.bind(this)).then(function (res) {
                    assert(res.build.id === BUILD_ID_2);
                    assert(res.build.state === 'created');

                    // cancel the build
                    var defer = q.defer();
                    this.privateTravis.jobs(res.jobs[0].id).cancel.post(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function () {
                    // verify that the build was succesfully canceled
                    var defer = q.defer();
                    this.privateTravis.builds(BUILD_ID_2).get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.build.id === BUILD_ID_2);
                    assert(res.build.state === 'canceled');
                }).nodeify(done);
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
                var BUILD_ID = '16675161';

                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.repos('pwmckenna', 'node-travis-ci').builds.get(defer.makeNodeResolver());
                    return defer.promise;
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
                    
                    var defer = q.defer();
                    this.privateTravis.jobs(jobId).restart.post(defer.makeNodeResolver());
                    return defer.promise;
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
                    var defer = q.defer();
                    this.privateTravis.builds(BUILD_ID).cancel.post(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).nodeify(done);
            });
        }
    }
];
