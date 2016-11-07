/**
 * couchdbjs - Node.js package to use couchdb.
 */

const Url = require('url');
const request = require('request');

const CouchDB = {};

class Database {
    /**
     * Constructor for the class CouchDB
     * @param {object} options - A JS object containing configuration data i.e. protocol, auth, hostname, port, database
     */
    constructor(options) {
        let protocol = options.protocol || 'http:';
        let auth = options.username ? options.username + (options.password ? ':'+options.password : '') : '';
        if (auth) auth += '@';
        let hostname = options.hostname || '127.0.0.1';
        let port = options.port || 5984;

        /**
         * @type {url} this.hostUrl - Variable containing the host address
         * @type {string} this.database - Name of the database
         * @type {Array} this.uuids - An array containing generated uuids
         */
        this.hostUrl = Url.parse(`${protocol}//${auth}${hostname}:${port}`);
        this.database = options.database;
        if (!this.database) {
            throw new Error("No database provided")
        }
        this.uuids = [];
        this.generateUUIDs(25);
    }

    /**
     * Function to generate UUIDS that can be used for document id
     * @param {Number} m - Number of uuids to e generated and stored in this.uuids
     */
    generateUUIDs(m) {
        request(`${this.hostUrl.href}_uuids?count=${m}`, (err, res, body) => {
            if (err) {
                throw err;
            }
            this.uuids = this.uuids.concat(JSON.parse(body).uuids);
        });
    }

    /**
     * Function to return an uuid to be used
     * @returns {String} - Hex coded uuid
     */
    get uuid() {
        if (this.uuids.length < 25) {
            this.generateUUIDs(25);
        }
        return this.uuids.pop();
    }

    /**
     * Function to create a document but does not saves in the database
     * @param {Object} doc - A document object to be stored
     * @returns {Document} - Created document
     */
    create(doc) {
        return new Document(this, doc);
    }
}

class Document {
    constructor(db, doc = {}) {
        this.hostUrl = db.hostUrl;
        this.database = db.database;
        this.doc = doc;
        if (!this.doc._id) {
            this.doc._id = db.uuid;
        }
    }

    save(callback) {
        request.put(`${this.hostUrl.href}${this.database}/${this.doc._id}`, (err, res, body) => {
            if (err) {
                return callback(err, null);
            }
            let doc = JSON.parse(body);
            if (doc.err) {
                return callback(new Error(doc.reason), null);
            }
            return callback(null, body);
        });
    }
}

CouchDB.Database = Database;
CouchDB.Document = Document;

module.exports = CouchDB;
