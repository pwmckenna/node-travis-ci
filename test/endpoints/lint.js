'use strict';

var q = require('q');
var fs = require('fs');
var path = require('path');

module.exports = [
    {
        uri: '/lint/',
        verb: 'POST',
        tests: function () {
            it('/logs/:id', function (done) {
                var configPath = path.resolve(__dirname, '../../.travis.yml');
                var yml = fs.readFileSync(configPath);
                var defer = q.defer();
                this.publicTravis.lint.post(yml, defer.makeNodeResolver());
                defer.promise.nodeify(done);
            });
        }
    },
    {
        uri: '/lint/',
        verb: 'PUT',
        tests: function () {
            it('/logs/:id', function (done) {
                var configPath = path.resolve(__dirname, '../../.travis.yml');
                var yml = fs.readFileSync(configPath);
                var defer = q.defer();
                this.publicTravis.lint.put(yml, defer.makeNodeResolver());
                defer.promise.nodeify(done);
            });
        }
    }
];
