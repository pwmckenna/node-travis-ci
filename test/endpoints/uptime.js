'use strict';

var q = require('q');

module.exports = [
    {
        uri: '/uptime/',
        verb: 'GET',
        tests: function () {
            it('/uptime/', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.uptime.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).nodeify(done);
            });
        }
    }
];