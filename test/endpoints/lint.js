'use strict';

module.exports = [
    {
        uri: '/lint/',
        verb: 'POST',
        tests: function () {
            console.warn('/lint/ - SO FAR ONLY SUPPORTS JSON');
        }
    },
    {
        uri: '/lint/',
        verb: 'PUT',
        tests: function () {
            console.warn('/lint/ - SO FAR ONLY SUPPORTS JSON');
        }
    }
];
