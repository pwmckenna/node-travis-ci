'use strict';

var request = require('request');

var TRAVIS_API_URL_BASE = 'https://api.travis-ci.org';

var generateAuthenticatedHeaders = function (accessToken) {
    var headers = {
        'Accept': 'application/vnd.travis-ci.2+json, */*; q=0.01'
    };
    if (accessToken) {
        headers.Authorization = 'token ' + accessToken;
    }
    return headers;
};

var TravisHttp = function () {};

TravisHttp.prototype.get = function (path, qs, callback) {
    request.get({
        url: TRAVIS_API_URL_BASE + path,
        qs: qs,
        headers: generateAuthenticatedHeaders(this.accessToken)
    }, function (err, res) {
        if (err || res.statusCode !== 200) {
            callback(res.body || res.statusCode);
        } else {
            callback(null, JSON.parse(res.body));
        }
    });
};

TravisHttp.prototype.post = function (path, form, callback) {
    request.post({
        url: TRAVIS_API_URL_BASE + path,
        form: form,
        headers: generateAuthenticatedHeaders(this.accessToken)
    }, function (err, res) {
        if (err || res.statusCode !== 200) {
            callback(res.body || res.statusCode);
        } else {
            callback(null, JSON.parse(res.body));
        }
    });
};
TravisHttp.prototype.put = function (path, json, callback) {
    request.put({
        url: TRAVIS_API_URL_BASE + path,
        json: json,
        headers: generateAuthenticatedHeaders(this.accessToken)
    }, function (err, res) {
        if (err || res.statusCode !== 200) {
            callback(res.body || res.statusCode);
        } else {
            callback(null, res.body);
        }
    });
};

TravisHttp.prototype.authenticate = function (accessToken) {
    this.accessToken = accessToken;
};

module.exports = TravisHttp;
