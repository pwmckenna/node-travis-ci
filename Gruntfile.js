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
            files: 'test/**/*.js'
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

    grunt.registerTask('test', function () {
        grunt.task.run(['jshint', 'env:test', 'mochaTest']);
    });
};
