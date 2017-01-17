'use strict';

let ParseDashboard = require('parse-dashboard');
let ParseServer = require('parse-server').ParseServer;
let express = require('express');

let app = express();

// The config file is excluded from Git for Security
let config = require('./config.json');

let api = new ParseServer({
  databaseURI: config.databaseUri,
  appId: config.appId,
  masterKey: config.masterKey,
  serverURL: config.parseServerUri,
});

let trustProxy = true;
let dashboard = new ParseDashboard({
  apps: [
    {
      appId: config.appId,
      masterKey: config.masterKey,
      serverURL: config.parseServerUri,
      appName: config.appName,
    }
  ],
  users: config.users,
  trustProxy: 1,
}, config.allowInsecureHttp);

// Serve static assets from the /public folder
// app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);

// Serve the Parse API on the /dashboard
app.use('/dashboard', dashboard);

// let https = require('https').createServer(app);
// https.listen(1337);

app.listen(1337, function() {
  console.log('parse-server and parse-dashboard running on port 1337.');
});

console.log('');
console.log('==========================================================');
console.log('         Server log starts here');
console.log('         timestamp:');
console.log('         ' + Date().toString())
console.log('==========================================================');
console.log('');
