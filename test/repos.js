'use strict';

var TravisCi = require('..');
var _ = require('lodash');
var assert = require('assert');
require('should');

var PROJECT_TRAVIS_REPO_ID = 1095505;

describe('travis ci repos api test suite', function () {
    this.timeout(30000);

    before(function (done) {
        this.publicTravis = new TravisCi({
            version: '2.0.0'
        });
        this.privateTravis = new TravisCi({
            version: '2.0.0'
        });
        this.privateTravis.auth.github({
            github_token: process.env.GITHUB_OAUTH_TOKEN
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            var token = res.access_token;

            this.privateTravis.authenticate({
                access_token: token
            }, function (err) {
                if (err) { return done(new Error(err)); }
                done();
            });
        }.bind(this));
    });

    it('exposes repos', function () {
        this.publicTravis.repos.should.be.a('function');
        this.privateTravis.repos.should.be.a('function');
    });

    it('returns all repos owned by pwmckenna', function (done) {
        this.publicTravis.repos({
            owner_name: 'pwmckenna'
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            var repos = res.repos;
            var repo = _.findWhere(repos, {
                id: PROJECT_TRAVIS_REPO_ID,
                slug: 'pwmckenna/node-travis-ci',
                description: 'node library to access the Travis-CI API',
                active: true
            });

            if (!repo) {
                return done(new Error('expected to find this project in the list of repos owned by pwmckenna'));
            }

            done();
        }.bind(this));
    });

    it('returns repo by id', function (done) {
        this.publicTravis.repos({
            id: PROJECT_TRAVIS_REPO_ID
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            var repo = res.repo;
            assert(repo.id === PROJECT_TRAVIS_REPO_ID);
            assert(repo.slug === 'pwmckenna/node-travis-ci');
            done();
        });
    });

    it('returns the same repo by id and by owner/name', function (done) {
        this.publicTravis.repos({
            id: PROJECT_TRAVIS_REPO_ID
        }, function (err, res) {
            if (err) { return done(new Error(err)); }
            var idRepo = res.repo;

            this.publicTravis.repos({
                owner_name: 'pwmckenna',
                name: 'node-travis-ci'
            }, function (err, res) {
                if (err) { return done(new Error(err)); }

                var ownerNameRepo = res.repo;

                assert(_.isEqual(idRepo, ownerNameRepo));
                done();
            });
        }.bind(this));
    });

    it('returns repo key', function (done) {
        this.publicTravis.repos.key({
            id: PROJECT_TRAVIS_REPO_ID
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            assert(res.key === '-----BEGIN RSA PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCzCZpiTro9GMFlztPLX4WBI6hb\nZOd9V7t2EpjYXmp8cCMsezhYGGet2bGeg95mcjObKvGdzdid95QUhGtG0vL0laJW\nr82+Dj0GgfwoBHFzBmfR3aMrg25Q9cwSVVKenGSaSj2fzmtYs9k1QMFjgEKC9Wkh\nG2UdZqFxfbAffU9J+wIDAQAB\n-----END RSA PUBLIC KEY-----\n');
            done();
        });
    });

    it('returns repo builds by owner and name', function (done) {
        this.publicTravis.repos.builds({
            owner_name: 'pwmckenna',
            name: 'node-travis-ci'
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            assert(res.hasOwnProperty('builds'));
            assert(res.hasOwnProperty('commits'));

            done();
        });
    });

    it('returns repo branches by repository_id', function (done) {
        this.publicTravis.repos.branches({
            repository_id: PROJECT_TRAVIS_REPO_ID,
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            assert(res.hasOwnProperty('branches'));
            assert(res.hasOwnProperty('commits'));

            // there should be a commit for master (at least..should beone for 'github' as well)
            var masterCommit = _.findWhere(res.commits, {
                branch: 'master',
                author_name: 'Patrick Williams'
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

    it('returns repo branch by repository_id/branch', function (done) {
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

    it('returns repo branches by owner/name', function (done) {
        this.publicTravis.repos.branches({
            owner_name: 'pwmckenna',
            name: 'node-travis-ci'
        }, function (err, res) {
            if (err) { return done(new Error(err)); }

            assert(res.hasOwnProperty('branches'));
            assert(res.hasOwnProperty('commits'));

            // there should be a commit for master (at least..should beone for 'github' as well)
            var masterCommit = _.findWhere(res.commits, {
                branch: 'master',
                author_name: 'Patrick Williams'
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

    it('returns repo branch by owner/name/branch', function (done) {
        var BRANCH_NAME = 'master';

        this.publicTravis.repos.branches({
            owner_name: 'pwmckenna',
            name: 'node-travis-ci',
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

});
