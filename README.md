# Couchdbjs

Couchdbjs is node.js client for couchdb.

[![NPM](https://nodei.co/npm/couchdbjs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/couchdbjs/)

![npm](https://img.shields.io/npm/v/couchdbjs.svg?style=flat-square)
![npm](https://img.shields.io/npm/dm/couchdbjs.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/couchdbjs.svg?style=flat-square)
![npm](https://img.shields.io/npm/l/couchdbjs.svg?style=flat-square)
![Dependencies](https://david-dm.org/prateekkumarweb/couchdbjs.svg?style=flat-square)

## Install

```shell
$ npm install couchdbjs --save
```

## Database

### Initialize

```js
const Couchdbjs = require('couchdbjs');
const options = {
    protocol : 'http:',
    username : 'user',
    password : 'pass',
    hostname : '127.0.0.1',
    port : 5984,
    database : 'db_name'
};
const db = new Couchdbjs.Database(options);
```

### Create

```js
db.createDB().then((status, data) => {
    if (status) console.log('Database created');
    else console.log('Database not created');
}).catch((err) => {
    console.log('Error creating database');
});
```

### Generate UUID

```js
let uuid = db.uuid;
```

### Delete

```js
db.deleteDB().then((status, data) => {
    if (status) console.log('Database deleted');
    else console.log('Database not deleted');
}).catch((err) => {
    console.log('Error deleting database');
});
```


## Document

### 
