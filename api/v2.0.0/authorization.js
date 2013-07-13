'use strict';

module.exports = function (client) {
    return {
        auth: {
            github: function (token, callback) {
                client.post('/auth/github', {
                    github_token: token
                }, callback);
            }
        }
    };
};