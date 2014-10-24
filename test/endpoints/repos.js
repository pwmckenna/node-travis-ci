'use strict';

var q = require('q');
var _ = require('lodash');
var assert = require('assert');

var PROJECT_TRAVIS_REPO_ID = 1095505;
var PROJECT_TRAVIS_OWNER_NAME = 'pwmckenna';
var PROJECT_TRAVIS_OWNER_EMAIL = 'pwmckenna@gmail.com';
var PROJECT_TRAVIS_NAME = 'node-travis-ci';
var PROJECT_TRAVIS_SLUG = PROJECT_TRAVIS_OWNER_NAME + '/' + PROJECT_TRAVIS_NAME;
var PROJECT_TRAVIS_PUBLIC_KEY = '-----BEGIN RSA PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCzCZpiTro9GMFlztPLX4WBI6hb\nZOd9V7t2EpjYXmp8cCMsezhYGGet2bGeg95mcjObKvGdzdid95QUhGtG0vL0laJW\nr82+Dj0GgfwoBHFzBmfR3aMrg25Q9cwSVVKenGSaSj2fzmtYs9k1QMFjgEKC9Wkh\nG2UdZqFxfbAffU9J+wIDAQAB\n-----END RSA PUBLIC KEY-----\n';
var PROJECT_TRAVIS_DESCRIPTION = 'node library to access the Travis-CI API';

var PROJECT_BTAPP_REPO_ID = 80511;
var PROJECT_BTAPP_SLUG = 'bittorrenttorque/btapp';
var PROJECT_BTAPP_DESCRIPTION = 'Btapp.js is a backbone library that provides easy access to Torque/BitTorrent/uTorrent clients.';

var BTAPP_REPO_INFO = {
    id: PROJECT_BTAPP_REPO_ID,
    slug: PROJECT_BTAPP_SLUG,
    description: PROJECT_BTAPP_DESCRIPTION
};

module.exports = [
    {
        uri: '/repos/',
        verb: 'GET',
        tests: function () {
            it('/repos/', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos().get({
                        member: 'pwmckenna'
                    }, defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('repos'));
                    assert(_.findWhere(res.repos, BTAPP_REPO_INFO));
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:owner_name',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos('pwmckenna').get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('repos'));
                    assert(_.findWhere(res.repos, {
                        id: PROJECT_TRAVIS_REPO_ID,
                        slug: PROJECT_TRAVIS_SLUG,
                        description: PROJECT_TRAVIS_DESCRIPTION
                    }));
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:id',
        verb: 'GET',
        tests: function () {
            it('/repos/:id', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_REPO_ID).get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('repo'));
                    assert(res.repo.id === PROJECT_TRAVIS_REPO_ID);
                    assert(res.repo.slug === PROJECT_TRAVIS_SLUG);
                    assert(res.repo.description === PROJECT_TRAVIS_DESCRIPTION);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:id/cc',
        verb: 'GET',
        tests: function () {
            it('/repos/:id/cc', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_REPO_ID).cc.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('repo'));
                    assert(res.repo.hasOwnProperty('slug'));
                    assert(res.repo.slug === PROJECT_TRAVIS_SLUG);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:id/key',
        verb: 'GET',
        tests: function () {
            it('/repos/:id/key', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_REPO_ID).key.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.key === PROJECT_TRAVIS_PUBLIC_KEY);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:id/key',
        verb: 'POST',
        tests: function () {
            console.warn('POST /repos/:id/key - NO TESTS');
        }
    },
    {
        uri: '/repos/:repository_id/branches',
        verb: 'GET',
        tests: function () {
            it('/repos/:repository_id/branches', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_REPO_ID).branches.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('branches'));
                    assert(res.hasOwnProperty('commits'));

                    // there should be a commit for master (at least..should beone for 'github' as well)
                    var masterCommit = _.findWhere(res.commits, {
                        branch: 'master',
                        author_email: PROJECT_TRAVIS_OWNER_EMAIL
                    });
                    assert(masterCommit);

                    // there should be a "branch", with the repo id, and a commit id that matches
                    // the commit we found above
                    var masterBranch = _.findWhere(res.branches, {
                        repository_id: PROJECT_TRAVIS_REPO_ID,
                        commit_id: masterCommit.id
                    });
                    assert(masterBranch);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:repository_id/branches/:branch',
        verb: 'GET',
        tests: function () {
            it('/repos/:repository_id/branches/:branch', function (done) {
                var BRANCH_NAME = 'master';

                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_REPO_ID).branches(BRANCH_NAME).get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('branch'));
                    assert(res.hasOwnProperty('commit'));

                    assert(res.branch.repository_id === PROJECT_TRAVIS_REPO_ID);
                    assert(res.branch.commit_id === res.commit.id);
                    assert(res.commit.branch === BRANCH_NAME);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:repository_id/caches',
        verb: 'GET',
        tests: function () {
            it('/repos/:repository_id/caches', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.repos(PROJECT_TRAVIS_REPO_ID).caches.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('caches'));
                    assert(_.isArray(res.caches));
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:repository_id/caches',
        verb: 'DELETE',
        tests: function () {
            console.warn('DELETE /repos/:repository_id/caches - NO TESTS');
        }
    },
    {
        uri: '/repos/:owner_name/:name',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_OWNER_NAME, PROJECT_TRAVIS_NAME).get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('repo'));
                    assert(res.repo.id === PROJECT_TRAVIS_REPO_ID);
                    assert(res.repo.slug === PROJECT_TRAVIS_SLUG);
                    assert(res.repo.description === PROJECT_TRAVIS_DESCRIPTION);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:id/settings',
        verb: 'GET',
        tests: function () {
            it('/repos/:id/settings', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.repos(PROJECT_TRAVIS_REPO_ID).settings.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(_.isEqual(res, {
                        settings: {
                            builds_only_with_travis_yml: false,
                            build_pushes: true,
                            build_pull_requests: true,
                            maximum_number_of_builds: 0,
                            timeout_hard_limit: null,
                            timeout_log_silence: null
                        }
                    }));
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:id/settings',
        verb: 'PATCH',
        tests: function () {
            console.warn('PATCH /repos/:id/settings - NO TESTS');
        }
    },
    {
        uri: '/repos/:owner_name/:name/builds',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/builds', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_OWNER_NAME, PROJECT_TRAVIS_NAME).builds.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('builds'));
                    assert(res.hasOwnProperty('commits'));
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/builds/:id',
        verb: 'GET',
        tests: function () {
            var BUILD_ID = 13178154;

            it('/repos/:owner_name/:name/builds/:id', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_OWNER_NAME, PROJECT_TRAVIS_NAME).builds(BUILD_ID).get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('build'));
                    assert(res.hasOwnProperty('commit'));
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/cc',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/cc', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_REPO_ID).cc.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('repo'));
                    assert(res.repo.hasOwnProperty('slug'));
                    assert(res.repo.slug === PROJECT_TRAVIS_SLUG);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/key',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/key', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_OWNER_NAME, PROJECT_TRAVIS_NAME).key.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.key === PROJECT_TRAVIS_PUBLIC_KEY);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/key',
        verb: 'POST',
        tests: function () {
            console.warn('POST /repos/:owner_name/:name/key - NO TESTS');
        }
    },
    {
        uri: '/repos/:owner_name/:name/branches',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/branches', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_OWNER_NAME, PROJECT_TRAVIS_NAME).branches.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('branches'));
                    assert(res.hasOwnProperty('commits'));

                    // there should be a commit for master (at least..should beone for 'github' as well)
                    var masterCommit = _.findWhere(res.commits, {
                        branch: 'master',
                        author_email: PROJECT_TRAVIS_OWNER_EMAIL
                    });
                    assert(masterCommit);

                    // there should be a "branch", with the repo id, and a commit id that matches
                    // the commit we found above
                    var masterBranch = _.findWhere(res.branches, {
                        repository_id: PROJECT_TRAVIS_REPO_ID,
                        commit_id: masterCommit.id
                    });
                    assert(masterBranch);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/branches/:branch',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/branches/:branch', function (done) {
                var BRANCH_NAME = 'master';

                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.repos(PROJECT_TRAVIS_OWNER_NAME, PROJECT_TRAVIS_NAME).branches(BRANCH_NAME).get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('branch'));
                    assert(res.hasOwnProperty('commit'));

                    assert(res.branch.repository_id === PROJECT_TRAVIS_REPO_ID);
                    assert(res.branch.commit_id === res.commit.id);
                    assert(res.commit.branch === BRANCH_NAME);
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/caches',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/caches', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.privateTravis.repos(PROJECT_TRAVIS_OWNER_NAME, PROJECT_TRAVIS_NAME).caches.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).then(function (res) {
                    assert(res.hasOwnProperty('caches'));
                    assert(_.isArray(res.caches));
                }).nodeify(done);
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/caches',
        verb: 'DELETE',
        tests: function () {
            console.warn('DELETE /repos/:owner_name/:name/caches - NO TESTS');
        }
    }
];