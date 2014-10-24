'use strict';

module.exports = [
    {
        uri: '/docs/',
        verb: 'GET',
        tests: function () {
            it('/docs/', function () {
                this.publicTravis.docs.get.should.be.a('function');
            });

            it('/docs/', function (done) {
                this.publicTravis.docs.get(function (err) {
                    if (err) {
                        return done(new Error(err));
                    }

                    done();
                });
            });
        }
    }
];