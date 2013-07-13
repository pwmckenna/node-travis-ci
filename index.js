'use strict';

var TravisClient = function (config) {
    if (!config.hasOwnProperty('version')) {
        throw 'must specify api version';
    }

    var TravisApiClient = require('./api/v' + config.version);
    return new TravisApiClient();
};

module.exports = TravisClient;