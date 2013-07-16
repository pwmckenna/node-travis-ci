'use strict';

var request = require('request');

var generateAuthenticatedHeaders = function (accessToken) {
    var headers = {
        'Accept': 'application/vnd.travis-ci.2+json, */*; q=0.01'
    };
    if (accessToken) {
        headers.Authorization = 'token ' + accessToken;
    }
    return headers;
};

var TravisHttp = function (endpoint) {
    this.apiEndpoint = endpoint;
};

TravisHttp.prototype._get = function (path, qs, callback) {
    if (typeof qs === 'function') {
        callback = qs;
        qs = undefined;
    }

    request.get({
        url: this.apiEndpoint + path,
        json: qs,
        headers: generateAuthenticatedHeaders(this._getAccessToken())
    }, function (err, res) {
        if (err || res.statusCode !== 200) {
            callback(JSON.stringify(res.body) || res.statusCode);
        } else {
            callback(null, res.body);
        }
    });
};

TravisHttp.prototype._post = function (path, form, callback) {
    if (typeof form === 'function') {
        callback = form;
        form = undefined;
    }

    request.post({
        url: this.apiEndpoint + path,
        json: form,
        headers: generateAuthenticatedHeaders(this._getAccessToken())
    }, function (err, res) {
        if (err || res.statusCode !== 200) {
            callback(JSON.stringify(res.body) || res.statusCode);
        } else {
            callback(null, res.body);
        }
    });
};
TravisHttp.prototype._put = function (path, json, callback) {
    if (typeof json === 'function') {
        callback = json;
        json = undefined;
    }

    request.put({
        url: this.apiEndpoint + path,
        json: json,
        headers: generateAuthenticatedHeaders(this._getAccessToken())
    }, function (err, res) {
        if (err || res.statusCode !== 200) {
            callback(JSON.stringify(res.body) || res.statusCode);
        } else {
            callback(null, res.body);
        }
    });
};

TravisHttp.prototype._setAccessToken = function (accessToken) {
    this._accessToken = accessToken;
};

TravisHttp.prototype._getAccessToken = function () {
    return this._accessToken;
};

module.exports = TravisHttp;
