'use strict'
const http = require('http');
const fs = require('fs');
const request = require('request');
const url = require('url');
const colors = require('colors');
const stream = require('stream');

class DBHandler {
    constructor(db, options) {
        this.db = db;
        this.config = {
            protocol: 'http:',
            hostname: 'localhost',
            port: 5984
        };
        for (var attr in options) {
            this.config[attr] = options[attr];
        }
    }

    connect(cb) {
        if (!cb) cb = ()=>{};
        let uri = url.format({
            protocol: this.config.protocol,
            hostname: this.config.hostname,
            port: this.config.port,
            pathname: '/'+encodeURIComponent(this.db)
        });
        request(uri, (err, res, body)=>{
            if (err) cb(err);
            else if (res.statusCode == 200) {
                console.log(`Conected to database successfully at ${uri.green}`);
                cb(null);
            }
            else if (res.statusCode == 404) {
                DBHandler.createDB(this.config, this.db, (err)=>{
                    if (err) cb(err);
                    else {
                        console.log(`Created and conected to database successfully at ${uri.green}`);
                        cb(null);
                    }
                });
            }
        });
    }

    static createDB(options, cb) {
        if (!cb) cb = ()=>{};
        let config = {
            protocol: 'http:',
            hostname: 'localhost',
            port: 5984,
        };
        for (var attr in options) {
            config[attr] = options[attr];
        }
        let uri = url.format({
            protocol : config.protocol,
            hostname : config.hostname,
            port : config.port,
            pathname : '/'+encodeURIComponent(config.db)
        });
        request.put(uri, (err, res, body)=>{
            if (err) cb(err);
            else {
                let data = JSON.parse(body);
                if (data.error) cb(data);
                else cb(null, data);
            }
        });
    }

    static deleteDB(options, cb) {
        if (!cb) cb = ()=>{};
        let config = {
            protocol: 'http:',
            hostname: 'localhost',
            port: 5984,
        };
        for (var attr in options) {
            config[attr] = options[attr];
        }
        let uri = url.format({
            protocol : config.protocol,
            hostname : config.hostname,
            port : config.port,
            pathname : '/'+encodeURIComponent(config.db)
        });
        request.delete(uri, (err, res, body)=>{
            if (err) cb(err);
            else {
                let data = JSON.parse(body);
                if (data.error) cb(data);
                else cb(null, data);
            }
        });
    }

    getConfig(options) {
        if (!options) options = {};
        let config = {};
        for (var attr in this.config) {
            config[attr] = this.config[attr];
        }
        for (var attr in options) {
            config[attr] = options[attr];
        }
        return config;
    }

    static getNewId(options, cb) {
        if (arguments.length == 0) {
            return;
        }
        if (arguments.length == 1) {
            cb = options;
            options = {};
        }
        let config = {
            protocol: 'http:',
            hostname: 'localhost',
            port: 5984,
            count: 1
        };
        for (var attr in options) {
            config[attr] = options[attr];
        }
        let uri = url.format({
            protocol : config.protocol,
            hostname : config.hostname,
            port : config.port,
            pathname : '/_uuids',
            query : {
                count : config.count
            }
        });
        request(uri, (err, res, body)=>{
            if (err) cb(err);
            else {
                let data = JSON.parse(body);
                if (data.error) cb(data);
                else cb(null, data.uuids);
            }
        });
    }

    createDoc(id, doc, cb) {
        if (!cb) cb = ()=>{};
        let uri = url.format({
            protocol : this.config.protocol,
            hostname : this.config.hostname,
            port : this.config.port,
            pathname : '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)
        });
        const str = new stream.Readable();
        str.push(JSON.stringify(doc));
        str.push(null);
        str.pipe(request.put(uri, (err, res, body)=>{
            if (err) cb(err);
            else {
                let data = JSON.parse(body);
                if (data.error) cb(data);
                else cb(null, data);
            }
        }));
    }

    getDoc(id, cb) {
        if (!cb) cb = ()=>{};
        let uri = url.format({
            protocol: this.config.protocol,
            hostname : this.config.hostname,
            port : this.config.port,
            pathname : '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)
        });
        request(uri, (err, res, body)=>{
            if (err) cb(err);
            else {
                let data = JSON.parse(body);
                if (data.error) cb(data);
                else cb(null, data);
            }
        });
    }

    getAllDocs(cb) {
        if (!cb) cb = ()=>{};
        let uri = url.format({
            protocol: this.config.protocol,
            hostname : this.config.hostname,
            port : this.config.port,
            pathname : '/'+encodeURIComponent(this.db)+'/_all_docs'
        });
        request(uri, (err, res, body)=>{
            if (err) cb(err);
            else {
                let data = JSON.parse(body);
                if (data.error) cb(data);
                else cb(null, data);
            }
        });
    }

    updateDoc(id, doc, cb) {
        if (!cb) cb = ()=>{};
        this.getDoc(id, (err, data)=>{
            if (err) cb(err);
            else {
                for (var attr in doc) {
                    data[attr] = doc[attr];
                }
                let uri = url.format({
                    protocol: this.config.protocol,
                    hostname: this.config.hostname,
                    port: this.config.port,
                    pathname: '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)
                });
                let str = new stream.Readable();
                str.push(JSON.stringify(data));
                str.push(null);
                str.pipe(request.put(uri, (err, res, body)=>{
                    if (err) cb(err);
                    else {
                        let data = JSON.parse(body);
                        if (data.error) cb(data);
                        else cb(null, data);
                    }
                }));
            }
        });
    }

    deleteDoc(id, cb) {
        if (!cb) cb = ()=>{};
        this.getDoc(id, (err, data)=>{
            if (err) cb(err);
            else {
                let uri = url.format({
                    protocol: this.config.protocol,
                    hostname: this.config.hostname,
                    port: this.config.port,
                    pathname: '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id),
                    query: {
                        rev: data['_rev']
                    }
                });
                request.delete(uri, (err, res, body)=>{
                    if (err) cb(err);
                    else {
                        let data = JSON.parse(body);
                        if (data.error) cb(data);
                        else cb(null, data);
                    }
                });
            }
        });
    }

    attachFileToDoc(id, rev, file, cb) {
        if (!cb) cb = ()=>{};
        let fstream = fs.createReadStream(file.path);
        let uri = url.format({
            protocol: this.config.protocol,
            hostname: this.config.hostname,
            port: this.config.port,
            pathname: '/'+encodeURIComponent(this.db)+'/'+encodeURIComponent(id)+'/'+file.name,
            query: {
                rev: rev
            }
        });
        fstream.pipe(request.put({
            url: uri,
            headers: {
                'Content-type': file.mimetype
            }
        }, (err, res, body)=>{
            if (err) cb(err);
            else {
                let data = JSON.parse(body);
                if (data.error) cb(data);
                else cb(null, data);
            }
        }));
    }
};

module.exports = DBHandler;
