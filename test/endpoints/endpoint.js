'use strict';

module.exports = [
    {
        uri: '/endpoint/:id/cancel',
        verb: 'POST',
        tests: function () {
            console.warn('/endpoint/:id/cancel DEPRECATED');
        }
    }
];