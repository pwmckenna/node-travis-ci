'use strict';

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
                console.warn('yml', yml);
                this.publicTravis.lint.post(yml, function (err) {
                    if (err) {
                        return done(new Error(err));
                    }
                    done();
                }.bind(this));
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
                console.warn('yml', yml);
                this.publicTravis.lint.put(yml, function (err) {
                    if (err) {
                        return done(new Error(err));
                    }
                    done();
                }.bind(this));
            });
        }
    }
];
