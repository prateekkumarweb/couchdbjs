# couchdbjs

couchdbjs is node.js client for couchdb.

### Install
```shell
$ npm install couchdbjs --save
```

### Create a couchdbjs object
```js
const Couchdbjs = require('couchdbjs');
const db = new Couchdbjs(dbname, options);
```
Note : Here DB is the object of the class couchdbjs.

Here `options` is an optional js object containing the configuration.
This is the default configuration.
```js
{
    protocol : 'http:',
    hostname: 'localhost',
    port: 5984
}
```
`dbname` is the name of the database.

### Generate a new uuid
```js
Couchdbjs.getNewId(options, cb);
```
Here `options` is optional configuration object.
This is the default configuration.
```js
{
    protocol : 'http:',
    hostname : 'localhost',
    port: 5984
    count : 1
}
```
`cb` is reqired callback function with two parameters `err` and `data`.
To avoid writing configurations for protocol, hostname, etc. again the function `getConfig` can be called on existing database object.
```js
db.getConfig({count : 1});
```
returns
```js
{
    protocol : 'http:',
    hostname : 'localhost',
    port: 5984
    count : 1
}
```
Complete Example :
```js
Couchdbjs.getNewId(db.getConfig({count : 1}, function(err, data) {
    if (err) console.error(err);
    else console.log(data[0]); // data is array of uuids
}));
```

### Create a new database
```js
const db = new Couchdbjs('dbname', options);
```
This creates a database when a database with name `dbname` doesn't exist.
Database can also be created using `Couchdbjs.createDB` function.
```js
Couchdbjs.createDB({
    protocol: 'http:',
    hostname: 'localhost',
    port: 5984,
    db: 'dbanme'
}, function(err, data)=>{
    if (err) console.error(err);
    else console.log(data);
});
```

### Delete a database
Database can be deleted using function `Couchdbjs.deleteDB` similar to `Couchdbjs.createDB`.
```js
Couchdbjs.deleteDB({
    protocol: 'http:',
    hostname: 'localhost',
    port: 5984,
    db: 'dbanme'
}, function(err, data) {
    if (err) console.error(err);
    else console.log(data);
});

```

### List all documents in a database
```js
db.getAllDocs(function(err, data) {
    if (err) console.error(err);
    else console.log(data);
});
```

### Create a new document
```js
db.createDoc(id, document, cb);
```
`id` is the id of the document to be used.
`document` is the object to be stored in the document.
`cb` is the callback function with parameters `err` and `data`.
Example
```js
db.createDoc('id_doc', {a:1, b:2, c:[5, 'k']}, function(err, data) {
    if (err) console.error(err);
    else console.log(data);
});
```

### Get document
```js
db.deleteDoc(id, cb);
```
`id` is the id of the document.
`cb` is the callback function with parameters `err` and `data`.
Example
```js
db.getDoc('id_doc', function(err, data) {
    if (err) console.error(err);
    else console.log(data);
});
```
