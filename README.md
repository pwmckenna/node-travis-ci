node-travis-ci [![Build Status](https://travis-ci.org/pwmckenna/node-travis-ci.png?branch=master)](https://travis-ci.org/pwmckenna/node-travis-ci)
==============

node library to access the [Travis-CI API](https://api.travis-ci.org/docs/)

[![NPM](https://nodei.co/npm/travis-ci.png?downloads=true&stars=true)](https://npmjs.org/package/travis-ci)

# Instantiation

```js
var Travis = require('travis-ci');
var travis = new Travis({
    version: '2.0.0'
});

// To access the Travis-CI Pro API
var travis = new Travis({
    version: '2.0.0',
    pro: true
});
```

# API

### Authentication

Many functions, such as [`travis.accounts`](https://api.travis-ci.org/docs/#Accounts), require authenticating as a user. 
Currently the only way to authenticate is to start with a github oauth token, request a travis access token, and authenticate with that.

```js
travis.auth.github({
    github_token: GITHUB_OAUTH_TOKEN
}, function (err, res) {
    // res => {
    //     access_token: XXXXXXX
    // }
    travis.authenticate({
        access_token: res.access_token
    }, function (err) {
         // we've authenticated!
    });
});
```

As a convenience, `authenticate` also accepts github tokens, or github credentials (which are only sent to github) and performs the necessary requests to aquire a travis access token. For example:

```js
travis.authenticate({
    github_token: GITHUB_OAUTH_TOKEN
}, function (err) {
    // we've authenticated! 
});
//or
travis.authenticate({
    username: GITHUB_USERNAME,
    password: GITHUB_PASSWORD
}, function (err) {
    //we've authenticated!
});
```

> __Pro Tip:__ Authentication is simply a convenience function that ensures your token has the required permissions, then appends your `access_token` to all subsequent requests. You can alternatively pass `access_token` to any request where permission is required.

### [Accounts](https://api.travis-ci.org/docs/#Accounts)

Accounts calls require [authentication](#Authentication).

```js
travis.accounts(function (err, res) {
    // res => {
    //     accounts: [
    //         {
    //             id: 5186,
    //             name: 'Patrick Williams',
    //             login: 'pwmckenna',
    //             type: 'user',
    //             repos_count: 37
    //         },
    //         ...
    //     ]
    // }
})
```

### [Authorization](https://api.travis-ci.org/docs/#Authorization)

```js
travis.auth.github({
    github_token: GITHUB_OAUTH_TOKEN
}, function (err, res) {
    // res => {
    //     access_token: XXXXXXX
    // }
});
```

Additional endpoints that have not be implemented yet:

* [travis.auth.authorize](https://api.travis-ci.org/docs/#/auth/authorize)
* [travis.auth.access_token](https://api.travis-ci.org/docs/#POST%20/auth/access_token)

Endpoints that exist, but are intended for brower flows:

* [travis.auth.handshake](https://api.travis-ci.org/docs/#/auth/handshake)
* [travis.auth.post_message](https://api.travis-ci.org/docs/#/auth/post_message)
* [travis.auth.post_message.iframe](https://api.travis-ci.org/docs/#/auth/post_message/iframe)

### [Branches](https://api.travis-ci.org/docs/#Branches)

```js
travis.branches(function (err, res) {
    // res => {
    //     branches: [],
    //     commits: []
    // }
})
```

### [Broadcasts](https://api.travis-ci.org/docs/#Broadcasts)

```js
travis.broadcasts(function (err, res) {
    // res => {
    //     broadcasts: []
    // }
})
```

### [Builds](https://api.travis-ci.org/docs/#Builds)

```js
travis.builds(function (err, res) {
    // res => {
    //     builds: [],
    //     commits: []
    // }
})
```

### [Documentation](https://api.travis-ci.org/docs/#Documentation)

```js
travis.documentation(function (err, res) {
    // res => <html>
    //     ...
    // </html
})
```

### [Endpoints](https://api.travis-ci.org/docs/#Endpoints)

```js
travis.endpoints(function (err, res) {
    // res => [
    //     {
    //         name: 'Home',
    //         prefix: '/',
    //         ...
    //     },
    //     ...
    // ]
});

travis.endpoints({
    prefix: 'endpoints'
}, function (err, res) {
    // res => {
    //     name: 'Endpoints',
    //     prefix: '/endpoints',
    //     ...
    // }
});
```

### [Hooks](https://api.travis-ci.org/docs/#Hooks)

All hook calls require [authentication](#Authentication).

```js
travis.hooks(function (err, res) {
    // res => [
    //     {
    //         id: 1095505,
    //         name: 'node-travis-ci',
    //         owner_name: 'pwmckenna',
    //         description: 'node library to access the Travis-CI API',
    //         active: true,
    //         private: false,
    //         admin: true
    //     }
    //     ...
    // ]
});

travis.hooks({
    id: 1095505,
    hook: {
        active: false
    }
}, function (err, res) {
});
```

### [Jobs](https://api.travis-ci.org/docs/#Jobs)

```js
travis.jobs({
    id: JOB_ID
}, function (err, res) {
    // res => {
    //     "job": {
    //         "id": 9624444,
    //         "repository_id": 1095505,
    //         "repository_slug": "pwmckenna/node-travis-ci",
    //         "build_id": 9624443,
    //         "commit_id": 2836527,
    //         "log_id": 3986694,
    //         "state": "failed",
    //         ...
    //     },
    //     "commit": {
    //         "id": 2836527,
    //         "sha": "431d6e5d899f165e4786ce82c4672975cddca670",
    //         "branch": "master",
    //         "message": "fixing builds test",
    //         ...
    //     }
    // }
});

travis.jobs.log({
    job_id: JOB_ID
}, function (err, res) {
    
})
```

### [Logs](https://api.travis-ci.org/docs/#Logs)

```js
travis.logs({
    id: LOG_ID
}, function (err, res) {
    // res => {
    //     log: {
    //         id: 3986694,
    //         job_id: 9624444,
    //         type: 'Log',
    //         body: 'Using worker: worker-linux-6-2.bb.travis-ci.org:travis-linux-15\n\n$ export GITHUB_OAUTH_TOKEN=[secure]...
    //     }
    // }
});
```

### [Repos](https://api.travis-ci.org/docs/#Repos)

```js
travis.repos({
    owner_name: 'pwmckenna'
//  member: 'pwmckenna
}, function (err, res) {
    // res => {
    //     "repos": [
    //         {
    //         "id": 1095505,
    //         "slug": "pwmckenna/node-travis-ci",
    //         "description": "node library to access the Travis-CI API",
    //         "last_build_id": 6347735,
    //         "last_build_number": "468",
    //         "last_build_state": "started",
    //         "last_build_duration": null,
    //         "last_build_language": null,
    //         "last_build_started_at": "2013-04-15T09:45:29Z",
    //         "last_build_finished_at": null
    //         }
    //     ]
    // }
});

travis.repos({
    owner_name: 'pwmckenna',
    name: 'node-travis-ci'
}, function (err, res) {
    // res => {
    //     "repo": {
    //         "id": 1095505,
    //         "slug": "pwmckenna/node-travis-ci",
    //         "description": "node library to access the Travis-CI API",
    //         ...
    //     }
    // }
});

travis.repos.key({
    id: 
}, function (err, res) {
    // res => {
    //   key: '-----BEGIN RSA PUBLIC KEY-----\nMIGfMA0GCSqGSIb...'    
    // }
});

travis.repos.builds({
    owner_name: 'pwmckenna',
    name: 'node-travis-ci'
}, function (err, res) {
    // res => {
    //     builds: [],
    //     commits: []
    // }
});
```

### [Requests](https://api.travis-ci.org/docs/#Requests)

Requests calls require [authentication](#Authentication).

```js
travis.requests({
    build_id: BUILD_ID    
}, function (err, res) {
    // res => {
    //     "result": true,
    //     "flash": [
    //         {
    //             "notice": "The build was successfully restarted."
    //         }
    //     ]
    // }
});
```

### [Stats](https://api.travis-ci.org/docs/#Stats)

```js
travis.stats.repos(function (err, res) {
    // res => {
    //     stats: {
    //         params:
    //         current_user:
    //     }
    // }
});

travis.stats.tests(function (err, res) {
    // res => {
    //     stats: {
    //         params:
    //         current_user:
    //     }
    // }
});
```

### [Users](https://api.travis-ci.org/docs/#ss)

All user calls require [authentication](#Authentication).

```js
travis.users(function (err, res) {
    // res => {
    //     id: 5186,
    //     name: 'Patrick Williams',
    //     login: 'pwmckenna',
    //     ...
    // } 
});

travis.users.permissions(function (err, res) {});
travis.users.sync(function (err, res) {});
```

### [Workers](https://api.travis-ci.org/docs/#Workers)

```js
travis.workers(function (err, res) {
    // res => {
    //     workers: []
    // }
});
```

# CLI

To install as a command line utility, just install globally via npm.

```bash
npm install -g travis-ci
```

The entire library is available via command line interface. While it uses subcommands, the api is the same as above.

```bash
travis-ci authenticate --username=pwmckenna --password=superSecret
=>  {
        "access_token": "F7DlolJkD15isf4KEDuh_A"
    }
# or
travis-ci auth github --github_token=ef7c329fb63479eb5be9719bb8b23162072bb20d
=>  {
        "access_token": "F7DlolJkD15isf4KEDuh_A"
    }
```

> __Pro Tip:__ Passing OAuth tokens or github credentials via the command line will leave them in your shell history for all to see. Please shell responsibly.


Use the `access_token` above in all subsequent commands that require authentication, such as requesting the builds for this project:

```bash
travis-ci repos builds --owner_name=pwmckenna --name=node-travis-ci --access_token=F7DlolJkD15isf4KEDuh_A
=>  {
        "builds": [
            {
                "id": 9630304,
                "repository_id": 1095505,
                "pull_request": false,
                "state": "passed",
                ...
            },
            ...
        ]
    }
```
