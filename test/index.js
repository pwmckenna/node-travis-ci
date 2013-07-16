'use strict';

// var assert = require('assert');
// var fs = require('fs');
// var request = require('supertest');
// var server = require('../server');


var TravisCi = require('..');
require('should');

describe('travis ci api test suite', function () {
    it('expects an api version', function () {
        var thrower = function () {
            new TravisCi();
        };
        thrower.should.throw();
    });

    it('only supports version 2.0.0', function () {
        var thrower = function () {
            new TravisCi({
                version: '3.0.0'
            });
        };
        thrower.should.throw();

        new TravisCi({
            version: '2.0.0'
        });
    });
});
