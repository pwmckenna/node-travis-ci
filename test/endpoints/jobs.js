'use strict';

var assert = require('assert');
var _ = require('lodash');

var JOB_ID = 9624444;

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
                    id: JOB_ID
                }, function (err, res) {
                    if (err) {
                        return done(new Error(err));
                    }

                    assert(_.isEqual(res, {
                        'job': {
                            'id': 9624444,
                            'repository_id': 1095505,
                            'repository_slug': 'pwmckenna/node-travis-ci',
                            'build_id': 9624443,
                            'commit_id': 2836527,
                            'log_id': 3986694,
                            'number': '30.1',
                            'config': {
                                'language': 'node_js',
                                'node_js': '0.10.1',
                                'script': [
                                    './node_modules/grunt-cli/bin/grunt test'
                                ],
                                '.result': 'configured',
                                'global_env': 'GITHUB_OAUTH_TOKEN=[secure]'
                            },
                            'state': 'failed',
                            'started_at': '2013-07-29T23:49:43Z',
                            'finished_at': '2013-07-29T23:51:42Z',
                            'queue': 'builds.linux',
                            'allow_failure': false,
                            'tags': ''
                        },
                        'commit': {
                            'id': 2836527,
                            'sha': '431d6e5d899f165e4786ce82c4672975cddca670',
                            'branch': 'master',
                            'message': 'fixing builds test',
                            'committed_at': '2013-07-29T22:08:00Z',
                            'author_name': 'Patrick Williams',
                            'author_email': 'pwmckenna@gmail.com',
                            'committer_name': 'Patrick Williams',
                            'committer_email': 'pwmckenna@gmail.com',
                            'compare_url': 'https://github.com/pwmckenna/node-travis-ci/compare/492b9f2e1f5f...431d6e5d899f'
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
    }
];
