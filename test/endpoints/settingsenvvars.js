'use strict';

module.exports = [
    {
        uri: '/settings/env_vars/',
        verb: 'GET',
        tests: function () {
            console.warn('GET /settings/env_vars/ - NO TESTS');
        }
    },
    {
        uri: '/settings/env_vars/:id',
        verb: 'GET',
        tests: function () {
            console.warn('GET /settings/env_vars/:id - NO TESTS');
        }
    },
    {
        uri: '/settings/env_vars/',
        verb: 'POST',
        tests: function () {
            console.warn('POST /settings/env_vars/ - NO TESTS');
        }
    },
    {
        uri: '/settings/env_vars/:id',
        verb: 'PATCH',
        tests: function () {
            console.warn('PATCH /settings/env_vars/:id - NO TESTS');
        }
    },
    {
        uri: '/settings/env_vars/:id',
        verb: 'DELETE',
        tests: function () {
            console.warn('DELETE /settings/env_vars/:id - NO TESTS');
        }
    }
];
