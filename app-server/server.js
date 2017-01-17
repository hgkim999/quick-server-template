'use strict';
/*
 * Restful API Backend for App
 * @flow
 */

const ParseHelper = require('./Helpers/ParseHelper');
const UserModel = require('./Models/User');

const bodyParser = require('body-parser');
const config = require('./config.json');
// 3rd Party Dependancies
const express = require('express');
const CredentialHelper = require('./Helpers/CredentialHelper');
const FBGraphAPIHelper = require('./Helpers/FBGraphAPIHelper');

let app = express();
let router = express.Router();
let credentialHelper = new CredentialHelper();

const PORT = 1109;

// user BodyParser for POST requests
app.use(bodyParser.json());

// initialize parse, and get the instance
let parseHelper = new ParseHelper(config.parseAppId, config.parseServerUri);
let parse = parseHelper.getParse();

// Fetch App Token when you init the server
credentialHelper.fetchAppToken(() => {
  console.log('Successfully prepared App Token.')
}, () => {
  'Failed to prepare App Token'
});

// middleware to use for all requests
router.use((req, res, next) => {
  // do logging
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('<REQUEST> ' + new Date() + ': from ip: ' + ip);
  next(); // make sure we go to the next routes and don't stop here
});

/*
 * Root Endpoint
 */
router.get('/', (req, res) => {
  res.json({message: 'hooray! welcome to our api!'});
});

/*
 * Retrieve Users
 */
router.get('/users', (req, res) => {
  let userModel = new UserModel();
  let userQuery = userModel.getQuery();
  userQuery.find({
    success: (results) => {
      console.log("Successfully retrieved " + results.length + " scores.");
      res.json(results);
    },
    error: (error) => {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
});

/*
 * Validate FB User Access token
 */
router.post('/validate', (req, res) => {
  if (!req.body || !req) {
    let msg = 'Could not add user: Empty request recieved!';
    console.log(msg)
    res.json({error: msg});
    return;
  }

  if (req.body['access-token'] && req.body['user-id']) {
    credentialHelper.validateToken(req.body, (result) => {
      res.json(result);
    }, (error) => {
      console.log(error)
      res.json(error);
    });
  } else {
    res.json({error: 'Invalid Request'});
  }
});

/*
 * Find User with the requested FB ID
 */
router.get('/user/:fbId', (req, res) => {
  let fb_id = req.params['fbId'];
  if (!fb_id) {
    res.status(400).send('Invalid Empty Reqeust');
  }

  let user = new UserModel();
  let query = user.getQuery();
  query.equalTo('fbId', fb_id);
  query.find({
    success: (results) => {
      if (results.length < 1) {
        res.status(204).json({user: {}});
      }

      let fetched_user = results[0];

      let fbGraph = new FBGraphAPIHelper(credentialHelper.getAppToken());
      console.log('Fetching FB Account Info');

      fbGraph.getUserInfo(fb_id, (data) => {
        res.json({
          user: {
            firstName: fetched_user.get('firstName'),
            lastName: fetched_user.get('lastName'),
            fbId: fetched_user.get('fbId'),
            fbInfo: data
          }
        });
      }, (error) => {
        res.json({
          user: {
            firstName: fetched_user.get('firstName'),
            lastName: fetched_user.get('lastName'),
            fbId: fetched_user.get('fbId'),
            fbInfo: {}
          }
        });
      });
    },
    error: (error) => {
      res.status(500).json({error: error});
    },
  });
});

/*
 * Create a New User
 */
router.post('/user/new', (req, res) => {
  let newUser = new UserModel();

  // validate the POST request
  for (let i = 0; i < newUser.requiredFields.length; i++) {
    if (!req.body || !req) {
      let msg = 'Could not add user: Empty request recieved!';
      console.log(msg)
      res.status(400).json({error: msg});
      return;
    }

    if (!req.body[newUser.requiredFields[i]]) {
      let msg = 'Could not add user: Required Field [ ' + newUser.requiredFields[i] + ' ] is missing!';
      console.log(msg)
      res.status(400).json({error: msg});
      return;
    }
  }

  let query = newUser.getQuery();
  query.equalTo('fbId', req.body.fbId);
  query.find({
    success: (results) => {
      // Abort if there's another user with the same FB ID
      if (results.length > 0) {
        let msg = 'Could not add user: [ ' + req.body.firstName + ' ]: FB ID already exists!';
        res.status(400).json({
          error: {
            message: msg,
            request: req.body
          }
        });
        return parse.Promise.error('');
      } else {
        newUser.save(req.body, {
          success: (addedUser) => {
            let msg = 'Added user [ ' + addedUser.get('firstName') + ' ]';
            console.log(msg);
            res.status(201).json({
              result: {
                user: addedUser.toJSON()
              }
            });
          },
          error: (err) => {
            let msg = 'Could not add user: [ ' + newUser.get('firstName') + ' ]';
            res.status(500).json({
              error: {
                message: msg,
                request: req.body,
              }
            });
          }
        });
      }
    },
    error: (error) => {
      let msg = 'DB Failure!';
      res.status(500).json({
        error: {
          message: msg,
          request: req.body,
          error: error,
        }
      });
    }
  });
});

app.use('/api', router);

// let https = require('https').createServer(app);
// https.listen(1337);

app.listen(PORT, () => {
  console.log('RESTful API server started at port ' + PORT);
});

console.log('');
console.log('==========================================================');
console.log('         RESTful API server log starts here');
console.log('         timestamp:');
console.log('         ' + new Date());
console.log('==========================================================');
console.log('');
