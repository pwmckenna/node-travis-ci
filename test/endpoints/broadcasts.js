'use strict';

require('should');
var assert = require('assert');

module.exports = [
    {
        uri: '/broadcasts/',
        verb: 'GET',
        tests: function () {
            it('exposes broadcasts', function () {
                this.publicTravis.broadcasts.should.be.a('function');
                this.privateTravis.broadcasts.should.be.a('function');
            });

            it('does not have permission to view broadcasts without authenticating', function (done) {
                this.publicTravis.broadcasts({}, function (err) {
                    if (!err) { return done(new Error('expected an error')); }

                    this.privateTravis.broadcasts({}, function (err) {
                        if (err) { return done(new Error(err)); }

                        done();
                    });
                }.bind(this));
            });

            it('gets broadcasts after authenticating', function (done) {
                this.privateTravis.broadcasts({}, function (err, res) {
                    if (err) { return done(new Error(err)); }

                    assert(res.hasOwnProperty('broadcasts'));

                    done();
                });
            });
        }
    }
];