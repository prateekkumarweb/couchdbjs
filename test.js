var Couchdbjs = require('./index');
var db = new Couchdbjs('test');
var cb = (a, b) => {console.log(a); console.log(b)}
db.getAllDocs(cb);
