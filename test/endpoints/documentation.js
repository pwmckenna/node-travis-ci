'use strict';

module.exports = [
    {
        uri: '/docs/',
        verb: 'GET',
        tests: function () {
            it('/docs/', function () {
                this.publicTravis.docs.should.be.a('function');
            });

            it('/docs/', function (done) {
                this.publicTravis.docs(function (err) {
                    if (err) {
                        return done(new Error(err));
                    }

                    done();
                });
            });
        }
    }
];