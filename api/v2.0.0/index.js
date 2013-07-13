'use strict';

var _ = require('lodash');
var TravisHttp = require('./travis-http');


var TravisApiClient = function () {
    var client = new TravisHttp();

    ['authorization'].forEach(function (api) {
        var routes = require('./' + api);
        _.extend(this, routes(client));
    }.bind(this));
};

TravisApiClient.prototype.authenticate = function (accessToken) {
    this.client.authenticate(accessToken);
};

module.exports = TravisApiClient;