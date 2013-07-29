#!/usr/bin/env node

'use strict';

var domain = require('domain').create();
domain.on('error', function (err) {
    console.log(err.message);
});

domain.run(function () {
    var _ = require('lodash');
    var Travis = require('../lib/travis-ci');

    // Strip off node and the file path to this file.
    var argv = _.rest(process.argv, 2);
    // Check if we should make calls to the pro server.
    var pro = _.contains(argv, '--pro');

    // Parse off arguments that are part of the function path.
    var subCommands = _.select(argv, function (arg) {
        return arg.indexOf('--') !== 0;
    });
    // Parse off args that will be passed as args to the function.
    var args = _(argv).select(function (arg) {
        return arg.indexOf('--') === 0;
    }).without('--pro').map(function (arg) {
        return arg.substr(2).split('=');
    }).object().value();

    var func = new Travis({
        version: '2.0.0',
        pro: pro
    });
    // Iterate until we find the right function.
    _.each(subCommands, function (subCommand) {
        func = func[subCommand];
        if (_.isUndefined(func) || _.isNull(func)) {
            throw new Error(subCommand + ' not found');
        }
    });

    // Call the function and deliver the news.
    func(args, function (err, res) {
        if (err) {
            throw new Error(err);
        }
        console.log(JSON.stringify(res, null, 4));
    });
});