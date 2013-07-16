'use strict';

var _ = require('lodash');
var util = require('util');
var _s = require('underscore.string');
var assert = require('assert');
var TravisHttp = require('./travis-http');
// { uri: '/stats/tests',
//     verb: 'GET',
//     doc: '',
//     scope: 'public'
// }

var getRouteApiPathRaw = function (route) {
    var segments = _s.words(_s.trim(route.uri, '/'), '/');
    return _.filter(segments, function (segment) {
        return segment[0] !== ':';
    });
};

var getRouteApiPath = function (route) {
    return _.map(getRouteApiPathRaw(route), function (segment) {
        return _s.camelize(segment);
    });
};

var getRouteApiArguments = function (route) {
    var segments = _s.words(_s.trim(route.uri, '/'), '/');
    return _.map(_.filter(segments, function (segment) {
        return segment[0] === ':';
    }), function (argument) {
        return argument.substr(1);
    });
};

var fillRouteArguments = function (route, args) {
    var filledRoute = route.uri;
    _.each(route.args, function (arg) {
        filledRoute = filledRoute.replace(':' + arg, args[arg]);
    });
    return filledRoute;
};

var getRoutesWithSatisfiedArgumentRequirements = function (routes, args) {
    var normalizedArgs = _.map(args, function (value, key) {
        return _s.camelize(key);
    });
    return _.filter(routes, function (route) {
        var apiArgs = _.map(route.args, function (arg) {
            return _s.camelize(arg);
        });

        var equal = _.isEqual(apiArgs, normalizedArgs);
        var subset = _.isEqual(apiArgs, _.intersection(apiArgs, normalizedArgs));

        switch (route.verb) {
        case 'GET':
            return subset;
        case 'POST':
        case 'PUT':
            return subset && !equal;
        default:
            throw new Error('unknown route verb');
        }
    });
};

var createObjectChain = function (obj, names) {
    var last = obj;
    for (var i in names) {
        var name = names[i];

        if (!last.hasOwnProperty(name)) {
            last[name] = {};
        }

        last = last[name];
    }
    return last;
};

var TRAVIS_ENDPOINT = 'https://api.travis-ci.org';
var TRAVIS_PRO_ENDPOINT = 'https://api.travis-ci.com';

var TravisClient = function (config) {

    TravisHttp.call(this, config.pro ? TRAVIS_PRO_ENDPOINT : TRAVIS_ENDPOINT);

    if (!config.hasOwnProperty('version')) {
        throw 'must specify api version';
    }

    var version = config.version;
    var routes = _.flatten(_.pluck(require('./api/v' + version + '/routes.json'), 'routes'), true);

    _.each(routes, function (route) {
        route.path = getRouteApiPath(route);
        route.args = getRouteApiArguments(route);
    });

    var routePathApis = _.groupBy(routes, 'path');
    _.each(routePathApis, this.addRoute, this);
};
util.inherits(TravisClient, TravisHttp);

TravisClient.prototype.authenticate = function (token, callback) {
    assert(!this._authenticating, 'cannot authenticate until previous authentication has completed');
    this._authenticating = true;
    this.setAccessToken(token);

    this.get('/users', function (err) {
        this._authenticating = false;
        this._authenticated = !err;
        callback(err);
    }.bind(this));
};

TravisClient.prototype.isAuthenticated = function () {
    return this._authenticated || false;
};

TravisClient.prototype.addRoute = function (routes) {
    var path = routes[0].path;

    var functionName = _.last(path);
    var last = createObjectChain(this, _.initial(path));

    var apiFunctionWrapper = function (msg, callback) {
        // Make msg an optional argument
        if (_.isFunction(msg) && _.isUndefined(callback)) {
            callback = msg;
            msg = {};
        }

        if (!_.isFunction(callback)) {
            throw new Error('expected callback to be a function');
        }

        if (!_.isObject(msg)) {
            return callback(new Error('expected msg to be an object'));
        }

        // Get all routes that have their argument list satisfied, 
        // regardless of extra parameters.
        var matchingRoutes = getRoutesWithSatisfiedArgumentRequirements(routes, msg);

        if (matchingRoutes.length === 0) {
            return callback(new Error('invalid arguments'));
        } else {
            // We'll blindly use the route that has the most satisfied arguments
            // 
            // So if we find ourselves with the following routes and arguments:
            // GET /repos/:owner_name/:name/builds/:id
            // GET /repos/:owner_name/:name/builds
            // {
            //     owner_name:
            //     name:
            //     id:
            // }
            // 
            // ...we'll pick the first route, even though the second one matches as well.
            var route = _.last(_.sortBy(matchingRoutes, function (route) {
                return route.args.length;
            }));
            if (route.scope === 'private' && !this.isAuthenticated()) {
                return callback(new Error('authentication required'));
            }

            // Url args are the ones that aren't filled in as part of the route.
            var args = _.omit(msg, route.args);
            // Replace the :args with the args provided.
            var url = fillRouteArguments(route, msg);

            switch (route.verb) {
            case 'GET':
                this.get(url, args, callback);
                break;
            case 'POST':
                this.post(url, args, callback);
                break;
            case 'PUT':
                this.put(url, args, callback);
                break;
            default:
                throw new Error('unsupported http verb');
            }
        }

    }.bind(this);

    if(last.hasOwnProperty(functionName)) {
        throw new Error('trying to create an api wrapper that already exists for ' + functionName + ' ' + path);
    }
    last[functionName] = apiFunctionWrapper;
};


module.exports = TravisClient;