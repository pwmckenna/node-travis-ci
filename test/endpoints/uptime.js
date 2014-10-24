'use strict';

module.exports = [
    {
        uri: '/uptime/',
        verb: 'GET',
        tests: function () {
            it('/uptime/', function (done) {
                this.publicTravis.uptime.get(function (err) {
                    if (err) { return done(new Error(err)); }

                    done();
                });
            });
        }
    }
];