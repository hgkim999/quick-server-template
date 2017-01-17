"use strict";

let BaseModel = require('../BaseModel');
let Parse = require('parse/node');

class User extends BaseModel {  
  constructor() {
      // Pass the ClassName to the Parse.Object constructor
      super('AnywhereUser');

      this.requiredFields = ['firstName', 'lastName', 'fbId'];
    }
}

Parse.Object.registerSubclass('User', User);
module.exports = User;
