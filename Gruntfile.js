'use strict';

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        jshint: {
            all: {
                src: [
                    '**/*.js',
                    '!node_modules/**/*.js'
                ],
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        },
        mochaTest: {
            files: 'test/*.js'
        },
        mochaTestConfig: {
            options: {
                reporter: 'spec'
            }
        },
        env: {
            test: {
                src: '.env'
            }
        }
    });

    grunt.registerTask('update-routes', function () {
        var done = this.async();
        var Travis = require('./');
        var fs = require('fs');
        var path = require('path');
        var travis = new Travis({
            version: '2.0.0'
        });
        travis.endpoints.get(function (err, endpoints) {
            fs.writeFileSync(path.resolve(__dirname, 'api/v2.0.0/routes.json'), JSON.stringify(endpoints, null, 4));
            done();
        });
    });

    grunt.registerTask('test', function () {
        grunt.task.run(['jshint', 'env:test', 'mochaTest']);
    });
};
