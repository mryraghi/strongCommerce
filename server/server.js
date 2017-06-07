'use strict';

// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const cors = require('cors');
const validator = require('express-validator');
const csurf = require('csurf');

// Get our API routes
const api = require('../server/routes/api');
const secure_api = require('../server/routes/secure-api');

const app = express();

// set various HTTP headers
app.use(helmet());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.use(validator());
//
// app.use((req, res, next) => {
//
//   // VALIDATION
//   req.checkBody('urlparam', 'Invalid body params').isEmpty(); // check req.body
//   req.checkParams('getparam', 'Invalid params').isEmpty(); // check req.params
//   req.checkQuery('postparam', 'Invalid query params').isEmpty(); // check req.query
//
//   // SANITIZATION
//   // req.sanitizeBody('postparam').toBoolean();
//   // req.sanitizeParams('urlparam').toBoolean();
//   // req.sanitizeQuery('getparam').toBoolean();
//
//   req.getValidationResult().then((result) => {
//     if (!result.isEmpty()) {
//       res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
//       return;
//     }
//     next()
//   });
// })

app.use(cors());

/**
 * NOT SECURE API
 *
 * /api/* endpoints do not require tokens/authentication
 */
app.use('/api', api);

/**
 * SECURE API
 *
 * In order to validate our token we will use the jwt function,
 * provided by the express-jwt middleware, and the jwks-rsa to
 * retrieve our secret. The libraries do the following:
 *  1. express-jwt will decode the token and pass the request,
 *    the header and the payload to jwksRsa.expressJwtSecret;
 *  2. jwks-rsa will then download all signing keys from the
 *    JWKS endpoint and see if a one of the signing keys matches
 *    the kid in the header of the JWT. If none of the signing
 *    keys match the incoming kid, an error will be thrown.
 *    If we have a match, we will pass the right signing key to express-jwt;
 *  3. express-jwt will the continue its own logic to validate
 *    the signature of the token, the expiration, audience and the issuer
 * @type {middleware}
 */
const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://rbellon.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://rbellon.eu.auth0.com/api/v2/',
  issuer: 'https://rbellon.eu.auth0.com/',
  algorithms: ['RS256']
});

const checkPermissions = function (req, res, next) {
  console.log('been here2');
  switch (req.path) {
    case '/secure/authenticate': {
      var permissions = ['openid'];
      for (var i = 0; i < permissions.length; i++) {
        if (req.user.scope.includes(permissions[i])) {
          next();
        } else {
          res.status(403).send({message: 'Forbidden'});
        }
      }
      break;
    }
    default:
      console.log('been here3');
      next()
  }
}

app.use('/secure', (err, req, res, next) => {
  console.log('been here1');
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({statusCode: 401, error: 'Unauthorized', message: 'Missing or invalid token'});
  }
}, jwtCheck, checkPermissions, secure_api);

/**
 * ENTRY FOLDER
 */
// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

// app.use((err, req, res, next) => {
//   console.log('mtfucking error', err);
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).send('invalid token...');
//   }
//
//   // for (const item in req.query) {
//   //   console.log(req.sanitize(item).escape());
//   //   req.sanitize(item).escape();
//   // }
//   next();
// });

// app.get('/test', function (req, res) {
//   let resp = eval('(' + req.query.input + ')');
//
//   res.send('Output</br>' + resp);
// });

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
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
