'use strict';

module.exports = [
    {
        uri: '/requests/',
        verb: 'GET',
        tests: function () {
            console.warn('GET /requests/ - NO TESTS');
        }
    },
    {
        uri: '/requests/:id',
        verb: 'GET',
        tests: function () {
            console.warn('GET /requests/:id - NO TESTS');
        }
    },
    {
        uri: '/requests/',
        verb: 'POST',
        tests: function () {
            console.warn('POST /requests/ - NO TESTS');
        }
    }
];