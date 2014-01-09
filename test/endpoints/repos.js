'use strict';

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

module.exports = [
    {
        uri: '/repos/',
        verb: 'GET',
        tests: function () {
            it('/repos/', function (done) {
                this.publicTravis.repos({
                    member: 'pwmckenna'
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('repos'));
                    assert(_.findWhere(res.repos, {
                        id: PROJECT_BTAPP_REPO_ID,
                        slug: PROJECT_BTAPP_SLUG,
                        description: PROJECT_BTAPP_DESCRIPTION
                    }));

                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:owner_name',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name', function (done) {
                this.publicTravis.repos({
                    owner_name: 'pwmckenna'
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('repos'));
                    assert(_.findWhere(res.repos, {
                        id: PROJECT_TRAVIS_REPO_ID,
                        slug: PROJECT_TRAVIS_SLUG,
                        description: PROJECT_TRAVIS_DESCRIPTION
                    }));

                    done();
                }.bind(this));
            });
        }
    },
    {
        uri: '/repos/:id',
        verb: 'GET',
        tests: function () {
            it('/repos/:id', function (done) {
                this.publicTravis.repos({
                    id: PROJECT_TRAVIS_REPO_ID
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('repo'));
                    assert(res.repo.id === PROJECT_TRAVIS_REPO_ID);
                    assert(res.repo.slug === PROJECT_TRAVIS_SLUG);
                    assert(res.repo.description === PROJECT_TRAVIS_DESCRIPTION);

                    done();
                }.bind(this));
            });
        }
    },
    {
        uri: '/repos/:id/cc',
        verb: 'GET',
        tests: function () {
            it('/repos/:id/cc', function (done) {
                this.publicTravis.repos.cc({
                    id: PROJECT_TRAVIS_REPO_ID
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('repo'));
                    assert(res.repo.hasOwnProperty('slug'));
                    assert(res.repo.slug === PROJECT_TRAVIS_SLUG);

                    done();
                }.bind(this));
            });
        }
    },
    {
        uri: '/repos/:id/key',
        verb: 'GET',
        tests: function () {
            it('/repos/:id/key', function (done) {
                this.publicTravis.repos.key({
                    id: PROJECT_TRAVIS_REPO_ID
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.key === PROJECT_TRAVIS_PUBLIC_KEY);
                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:id/key',
        verb: 'POST',
        tests: function () {
            console.warn('/repos/:id/key - NO WAY TO DISTINGUISH BETWEEN GET/POST ROUTES');
        }
    },
    {
        uri: '/repos/:repository_id/branches',
        verb: 'GET',
        tests: function () {
            it('/repos/:repository_id/branches', function (done) {
                this.publicTravis.repos.branches({
                    repository_id: PROJECT_TRAVIS_REPO_ID
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

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

                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:repository_id/branches/:branch',
        verb: 'GET',
        tests: function () {
            it('/repos/:repository_id/branches/:branch', function (done) {
                var BRANCH_NAME = 'master';

                this.publicTravis.repos.branches({
                    repository_id: PROJECT_TRAVIS_REPO_ID,
                    branch: BRANCH_NAME
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('branch'));
                    assert(res.hasOwnProperty('commit'));

                    assert(res.branch.repository_id === PROJECT_TRAVIS_REPO_ID);
                    assert(res.branch.commit_id === res.commit.id);
                    assert(res.commit.branch === BRANCH_NAME);

                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:repository_id/caches',
        verb: 'GET',
        tests: function () {
            it('/repos/:repository_id/caches', function (done) {
                this.privateTravis.repos.caches({
                    repository_id: PROJECT_TRAVIS_REPO_ID
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }
                    assert(res.hasOwnProperty('caches'));
                    assert(_.isArray(res.caches));
                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:repository_id/caches',
        verb: 'DELETE',
        tests: function () {
            console.warn('/repos/:repository_id/caches - NO WAY TO DISTINGUISH BETWEEN GET/DELETE ROUTES');
        }
    },
    {
        uri: '/repos/:owner_name/:name',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name', function (done) {
                this.publicTravis.repos({
                    owner_name: PROJECT_TRAVIS_OWNER_NAME,
                    name: PROJECT_TRAVIS_NAME
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('repo'));
                    assert(res.repo.id === PROJECT_TRAVIS_REPO_ID);
                    assert(res.repo.slug === PROJECT_TRAVIS_SLUG);
                    assert(res.repo.description === PROJECT_TRAVIS_DESCRIPTION);

                    done();
                }.bind(this));
            });
        }
    },
    {
        uri: '/repos/:id/settings',
        verb: 'GET',
        tests: function () {
            it('/repos/:id/settings', function (done) {
                this.privateTravis.repos.settings({
                    id: PROJECT_TRAVIS_REPO_ID
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(_.isEqual(res, {
                        'settings': {
                            'builds_only_with_travis_yml': false,
                            'build_pushes': true,
                            'build_pull_requests': true
                        }
                    }));

                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:id/settings',
        verb: 'PATCH',
        tests: function () {
            console.warn('/repos/:id/settings - NO WAY TO DISTINGUISH BETWEEN GET/PATCH ROUTES');
        }
    },
    {
        uri: '/repos/:owner_name/:name/builds',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/builds', function (done) {
                this.publicTravis.repos.builds({
                    owner_name: PROJECT_TRAVIS_OWNER_NAME,
                    name: PROJECT_TRAVIS_NAME
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('builds'));
                    assert(res.hasOwnProperty('commits'));

                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/builds/:id',
        verb: 'GET',
        tests: function () {
            var BUILD_ID = 13178154;

            it('/repos/:owner_name/:name/builds/:id', function (done) {
                this.publicTravis.repos.builds({
                    owner_name: PROJECT_TRAVIS_OWNER_NAME,
                    name: PROJECT_TRAVIS_NAME,
                    id: BUILD_ID
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('build'));
                    assert(res.hasOwnProperty('commit'));

                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/cc',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/cc', function (done) {
                this.publicTravis.repos.cc({
                    id: PROJECT_TRAVIS_REPO_ID
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('repo'));
                    assert(res.repo.hasOwnProperty('slug'));
                    assert(res.repo.slug === PROJECT_TRAVIS_SLUG);

                    done();
                }.bind(this));
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/key',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/key', function (done) {
                this.publicTravis.repos.key({
                    owner_name: PROJECT_TRAVIS_OWNER_NAME,
                    name: PROJECT_TRAVIS_NAME
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.key === PROJECT_TRAVIS_PUBLIC_KEY);
                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/key',
        verb: 'POST',
        tests: function () {
            console.warn('/repos/:owner_name/:name/key - NO WAY TO DISTINGUISH BETWEEN GET/POST ROUTES');
        }
    },
    {
        uri: '/repos/:owner_name/:name/branches',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/branches', function (done) {
                this.publicTravis.repos.branches({
                    owner_name: PROJECT_TRAVIS_OWNER_NAME,
                    name: PROJECT_TRAVIS_NAME
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

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

                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/branches/:branch',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/branches/:branch', function (done) {
                var BRANCH_NAME = 'master';

                this.publicTravis.repos.branches({
                    owner_name: PROJECT_TRAVIS_OWNER_NAME,
                    name: PROJECT_TRAVIS_NAME,
                    branch: BRANCH_NAME
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('branch'));
                    assert(res.hasOwnProperty('commit'));

                    assert(res.branch.repository_id === PROJECT_TRAVIS_REPO_ID);
                    assert(res.branch.commit_id === res.commit.id);
                    assert(res.commit.branch === BRANCH_NAME);

                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/caches',
        verb: 'GET',
        tests: function () {
            it('/repos/:owner_name/:name/caches', function (done) {
                this.privateTravis.repos.caches({
                    owner_name: PROJECT_TRAVIS_OWNER_NAME,
                    name: PROJECT_TRAVIS_NAME
                }, function (err, res) {
                    if (err) { return done(new Error(err)); }
                    assert(res.hasOwnProperty('caches'));
                    assert(_.isArray(res.caches));
                    done();
                });
            });
        }
    },
    {
        uri: '/repos/:owner_name/:name/caches',
        verb: 'DELETE',
        tests: function () {
            console.warn('/repos/:owner_name/:name/caches - NO WAY TO DISTINGUISH BETWEEN GET/DELETE ROUTES');
        }
    }
];