node-travis-ci
==============

node library to access the [Travis-CI API](https://api.travis-ci.org/docs/)

### Installation

```bs
npm install --save travis-ci
```

### Instantiation

```js
var Travis = require('travis-ci');
var travis = new Travis({
  version: '2.0.0'
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
