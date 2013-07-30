'use strict';

var TravisCi = require('..');
require('should');

describe('travis ci pro repos api test suite', function () {
    this.timeout(30000);

    before(function (done) {
        this.publicTravis = new TravisCi({
            version: '2.0.0',
            pro: true
        });
        this.privateTravis = new TravisCi({
            version: '2.0.0',
            pro: true
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
        this.privateTravis.repos({
            member: 'pwmckenna'
        }, function (err, res) {
            if (err) { return done(new Error(err)); }
            var repos = res.repos;
            if (!repos) {
                return done(new Error('expected to find repos with pwmckenna as a member'));
            }

            done();
        }.bind(this));
    });
});
