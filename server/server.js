'use strict';

// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');

const fs = require('fs');

// Get our API routes
const api = require('../server/routes/api');

const app = express();

app.use(helmet());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// We are going to implement a JWT middleware that will ensure the validity of our token.
// We'll require each protected route to have a valid access_token sent in the Authorization header
let jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://rbellon.eu.auth0.com/.well-known/jwks.json"
  }),
  audience: 'strong-commerce-api',
  issuer: "https://rbellon.eu.auth0.com/",
  algorithms: ['RS256']
});

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

fs.readdir(__dirname, function (err, items) {
  console.log(items);

  for (let i = 0; i < items.length; i++) {
    console.log(items[i]);
  }
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
