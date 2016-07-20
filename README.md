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
To avoid writing configurations for protocol, hostname and port again the function `getConfig` can be called on existing database object.
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

### Update a document
```js
db.updateDoc(id, doc, cb);
```
`id`, `doc`, `cb` are id of document to be updated, document object with filed to be updated and callback function with parameters `err` and `data` respectively.
Example
Suppose this a document already present
```js
{
    'id': 'id_doc',
    '_rev': '1-1357',
    'a': 1,
    'b': 'asd'
}
```
If the following function is used to update the document
```js
db.upadteDoc('id_doc', {b: 'cs', c: 5}, function(err, data) {});
```
then the final document will be
```js
{
    'id': 'id_doc',
    '_rev': '2-2468',
    'a': 1,
    'b': 'cs',
    'c': 5
}
```
After that if the following function is used to update the document
```js
db.upadteDoc('id_doc', {b: 'cse', a: undefined}, function(err, data) {});
```
then the final document will be
```js
{
    'id': 'id_doc',
    '_rev': '3-3579',
    'b': 'cse',
    'c': 5
}
```
To update whole document by overwriting the existing one use
```js
db.createDoc(id, doc, cb);
```
with `_rev` field in the `doc` document.

### Delete a document
```js
db.deleteDoc(id, function(err, data) {
    if (err) console.error(err);
    else console.log(data);
});
```

### Attach files to a document
```js
db.attachFileToDoc(id, rev, file, cb);
```
Example
```js
db.attachFileToDoc('id_doc', '3-3579', {
    name: 'pic.jpg',
    path: '/home/user/image.jpg'
    mimetype: 'image/jpeg'
}, function(err, data) {
    if (err) console.error(err);
    else console.log(data);
});
```
Here the file gets uploaded to <http://localhost:5984/db_name/id_doc/pic.jpg>.
