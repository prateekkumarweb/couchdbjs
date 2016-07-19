'use strict'
const http = require('http');
const fs = require('fs');
const request = require('request');
const url = require('url');

const protocol = "http";

class DBHandler {
    constructor(options, db) {
        this.db = db;
        this.config = options;
        http.request({
            hostname: options.hostname,
            port: options.port,
            method: 'GET',
            path: '/'+encodeURIComponent(db)
        }, (res) => {
            var data = '';
            res.on('data', (chunk) => {data+=chunk});
            res.on('end', () => {
                data = JSON.parse(data);
                if (data.error) {
                    DBHandler.createDB(this.config, db, (error) => {
                        if (error) throw new Error("Database Creation error");
                    });
                }
            });
        }).end();
    }

    static getNewId(options, callback) {
        if (!callback) callback = console.log;
        http.request({
            hostname: options.hostname,
            port: options.port,
            method: 'GET',
            path: '/_uuids'
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data+=chunk; });
            res.on('end', () => {
                data = JSON.parse(data);
                if(!data.error) {
                    callback(false, data.uuids[0]);
                } else callback(data);
            });
        }).end();
    }

    getDoc(id, callback) {
        if (!callback) callback = console.log;
        http.request({
            hostname: this.config.hostname,
            port: this.config.port,
            method: 'GET',
            path: '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data+=chunk; });
            res.on('end', () => {
                data = JSON.parse(data);
                if(!data.error) {
                    callback(false, data);
                } else callback(data);
            });
        }).end();
    }

    getAllDocs(callback) {
        if (!callback) callback = console.log;
        http.request({
            hostname: this.config.hostname,
            port: this.config.port,
            method: 'GET',
            path: '/'+encodeURIComponent(this.db)+'/_all_docs'
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data+=chunk; });
            res.on('end', () => {
                data = JSON.parse(data);
                if(!data.error) {
                    callback(false, data);
                } else callback(data);
            });
        }).end();
    }

    createDoc(id, doc, callback) {
        if (!callback) callback = console.log;
        let req = http.request({
            hostname: this.config.hostname,
            port: this.config.port,
            method: 'PUT',
            path: '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data+=chunk; });
            res.on('end', () => {
                data = JSON.parse(data);
                console.log(data);
                if (!data.error) {
                    callback(false, data);
                } else callback(data);
            });
        });
        req.write(JSON.stringify(doc));
        req.end();
    }

    updateDoc(id, doc, callback) {
        if (!callback) callback = console.log;
        let req = http.request({
            hostname: this.config.hostname,
            port: this.config.port,
            method: 'PUT',
            path: '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data+=chunk; });
            res.on('end', () => {
                data = JSON.parse(data);
                if(!data.error) {
                    callback(false, data);
                } else callback(data);
            });
        });
        req.write(JSON.stringify(doc));
        req.end();
    }

    attachFileInDoc(id, rev, file, callback) {
        if(!callback) callback = console.log;
        var fstream = fs.createReadStream(file.path);
        var path = '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)+'/'+file.name;
        var u = url.format({
            protocol: protocol,
            hostname: this.config.hostname,
            port: this.config.port,
            pathname: path,
            query: {rev: rev}
        });
        fstream.pipe(request.put({
            url: u,
            headers: {
                'Content-type': file.mimetype
            }
        }, callback));
    }

    deleteDoc(id, callback) {
        if (!callback) callback = console.log;
        http.request({
            hostname: this.config.hostname,
            port: this.config.port,
            method: 'GET',
            path: '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data+=chunk; });
            res.on('end', () => {
                data = JSON.parse(data);
                if(!data.error) {
                    http.request({
                        hostname: this.config.hostname,
                        port: this.config.port,
                        method: 'DELETE',
                        path: '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)+'?rev='+data["_rev"]
                    }, (res) => {
                        let data = '';
                        res.on('data', (chunk) => { data+=chunk; });
                        res.on('end', () => {
                            data = JSON.parse(data);
                            if(!data.error) {
                                callback(false);
                            } else callback(data);
                        });
                    }).end();
                } else callback(data);
            });
        }).end();
    }

    static createDB(options, dbName, callback) {
        if (!callback) callback = console.log;
        http.request({
            hostname: options.hostname,
            port: options.port,
            method: 'PUT',
            path: '/'+encodeURIComponent(dbName)
        }, (res) => {
            let data = '';
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                data = JSON.parse(data);
                if (data.ok) callback(false);
                else callback(data);
            });
        }).end();
    }

    static deleteDB(options, dbName, callback) {
        if (!callback) callback = console.log;
        http.request({
            hostname: options.hostname,
            port: options.port,
            method: 'DELETE',
            path: '/'+encodeURIComponent(dbName)
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end' ,() => {
                data=JSON.parse(data);
                if(!data.error) callback(null);
                else callback(data);
            })
        }).end();
    }
};

module.exports = DBHandler;
