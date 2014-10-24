'use strict';

var q = require('q');

module.exports = [
    {
        uri: '/docs/',
        verb: 'GET',
        tests: function () {
            it('/docs/', function () {
                this.publicTravis.docs.get.should.be.a('function');
            });

            it('/docs/', function (done) {
                q.resolve().then(function () {
                    var defer = q.defer();
                    this.publicTravis.docs.get(defer.makeNodeResolver());
                    return defer.promise;
                }.bind(this)).nodeify(done);
            });
        }
    }
];