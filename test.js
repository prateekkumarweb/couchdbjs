const Couchdbjs = require('./index')
const db = new Couchdbjs('test')
var cb = (a, b)=>{console.log(a); console.log(b)}
db.createDoc("test1", {a:1}, (err, data)=>{
  if (err) console.log(err);
  else {
    db.attachFileToDoc(data.id, data.rev, {name: 'artifact.pdf', mimetype: 'application/json', path: __dirname+'/'+'package.json'}, (err, data) => {
      console.log(err, data);
      db.deleteAttachment(data.id, data.rev, 'artifact.pdf')
    });
  }
})
