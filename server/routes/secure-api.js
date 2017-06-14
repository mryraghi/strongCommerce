const express = require('express');
const router = express.Router();
const axios = require('axios');
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let _ = require('lodash');

const BASE_URL = 'https://rbellon.eu.auth0.com/';
const CLIENT_ID = 'I33YIQTMcuukrwaT6CrNPOkWOWCKcGPz';
const CLIENT_SECRET = 'tcwbIgQ5xBOXIDlspX3qge5pE-JXFlDg70EC3oWVv534e2aCNyBFQFkBeawsD5Fa';
const AUDIENCE = 'https://rbellon.eu.auth0.com/api/v2/';
const GRANT_TYPE = 'client_credentials';
const CLIENT_DOMAIN = 'rbellon.eu.auth0.com';
const REDIRECT = 'http://localhost:3000/callback';
const SCOPE = 'openid';

// Connection URL
let url = 'mongodb://romeo:rad3eDru9a@207.154.238.238:27017/admin';
let db = null;
let users = null;

let insertDocuments = (db, callback) => {
  // Get the documents collection
  let users = db.collection('users');
  // Insert some documents
  users.insertMany([
    {a: 1}, {a: 2}, {a: 3}
  ], (err, result) => {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
};


/**
 * When a client application wants to access protected endpoints on an API
 * it needs to present an access token as proof that it has the required
 * permissions for make the call to the endpoint.
 *
 * An access token is obtained by authenticating the user with
 * AuthService.login() and the user can then in turn authorize the
 * application to access the API on their behalf.
 *
 * An API can enforce fine grained control over who can access the various
 * endpoints exposed by the API. These permissions are expressed as scopes.
 *
 * When a user authorizes a client application, the application can also
 * indicate which permissions it requires. The user is then allowed to review
 * and grant these permissions. These permissions are then included in the
 * access token as part of the scope claim.
 *
 * Subsequently when the client passes along the access token when making
 * requests to the API, the API can query the scope claim to ensure that the
 * required permissions were granted in order to call the particular API endpoint.
 */
router.get('/authenticate', (req, res) => {
  axios.post(BASE_URL + 'oauth/token', {
    audience: AUDIENCE,
    grant_type: GRANT_TYPE,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  }).then(response => {
    res.status(200).json(response.data);
  }).catch(error => {
    res.status(500).send(error)
  });
});

router.post('/connect', (req, res) => {
  console.log('connect');
  // Use connect method to connect to the server
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to mongodb server");

    this.db = db;
    this.users = db.collection('users');
  });

  res.status(200).send({message: 'success'});
});

router.get('/close-db', (req, res) => {
  console.log('close');
  if (!_.isNull(this.db)) {
    this.db.close().then(
      result => console.log(result),
      error => console.log(error)
    );
  }
});

module.exports = router;
