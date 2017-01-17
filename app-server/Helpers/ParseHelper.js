"use strict";

let Parse = require('parse/node');
const config = require('../config.json');

class ParseHelper {
  constructor(app_id, server_url) {
    if(!app_id){
      app_id = config.appId;
    }
    if(!server_url){
      server_url = config.parseServerUri;
    }

    Parse.initialize(config.appId);
    Parse.serverURL = config.parseServerUri;
  }

  getParse() {
    return Parse;
  }
}

module.exports = ParseHelper;
