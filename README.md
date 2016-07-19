# couchdbjs

couchdbjs is node.js client for couchdb.

### Install
```shell
$ npm install couchdbjs --save
```

### Create a couchdbjs object
```javascript
const Couchdbjs = require('couchdbjs');
const db = new Couchdbjs(dbname, options);
```
Note : Here DB is the object of the class couchdbjs.

Here `options` is an optional javascript object containing the configuration.
This is the default configuration.
```javascript
{
    protocol : 'http:',
    hostname: 'localhost',
    port: 5984
}
```
`dbname` is the name of the database.

### Generate a new uuid
```
Couchdbjs.getNewId(options, cb);
```
Here `options` is optional configuration object.
This is the default configuration.
```javascript
{
    protocol : 'http:',
    hostname : 'localhost',
    port: 5984
    count : 1
}
```
`cb` is reqired callback function with two parameters `err` and `data`.
To avoid writing configurations for protocol, hostname, etc. again the function `getConfig` can be called on existing database object.
```javascript
db.getConfig({count : 1});
```
returns
```javascript
{
    protocol : 'http:',
    hostname : 'localhost',
    port: 5984
    count : 1
}
```
Complete Example :
```javascript
Couchdbjs.getNewId(db.getConfig({count : 1}, function(err, data) {
    if (err) console.error(err);
    else console.log(data[0]); // data is array of uuids
}));
```
