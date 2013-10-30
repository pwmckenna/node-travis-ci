'use strict';

module.exports = [
    {
        uri: '/artifacts/:id',
        verb: 'GET',
        tests: function () {
            console.warn('/artifacts/:id DEPRECATED');
        }
    }
];