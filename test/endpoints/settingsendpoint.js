'use strict';

module.exports = [
    {
        uri: '/settings/settings_endpoint/',
        verb: 'GET',
        tests: function () {
            console.warn('/settings/settings_endpoint/ - UNKNOWN');
        }
    },
    {
        uri: '/settings/settings_endpoint/:id',
        verb: 'GET',
        tests: function () {
            console.warn('/settings/settings_endpoint/ - UNKNOWN');
        }
    },
    {
        uri: '/settings/settings_endpoint/',
        verb: 'POST',
        tests: function () {
            console.warn('/settings/settings_endpoint/ - UNKNOWN');
        }
    },
    {
        uri: '/settings/settings_endpoint/:id',
        verb: 'PATCH',
        tests: function () {
            console.warn('/settings/settings_endpoint/ - UNKNOWN');
        }
    },
    {
        uri: '/settings/settings_endpoint/:id',
        verb: 'DELETE',
        tests: function () {
            console.warn('/settings/settings_endpoint/ - UNKNOWN');
        }
    }
];
