'use strict';

module.exports = [
    {
        uri: '/settings/settings_endpoint/',
        verb: 'GET',
        tests: function () {
            console.warn('GET /settings/settings_endpoint/ - NO TESTS');
        }
    },
    {
        uri: '/settings/settings_endpoint/:id',
        verb: 'GET',
        tests: function () {
            console.warn('GET /settings/settings_endpoint/:id - NO TESTS');
        }
    },
    {
        uri: '/settings/settings_endpoint/',
        verb: 'POST',
        tests: function () {
            console.warn('POST /settings/settings_endpoint/ - NO TESTS');
        }
    },
    {
        uri: '/settings/settings_endpoint/:id',
        verb: 'PATCH',
        tests: function () {
            console.warn('PATCH /settings/settings_endpoint/:id - NO TESTS');
        }
    },
    {
        uri: '/settings/settings_endpoint/:id',
        verb: 'DELETE',
        tests: function () {
            console.warn('DELETE /settings/settings_endpoint/:id - NO TESTS');
        }
    }
];
