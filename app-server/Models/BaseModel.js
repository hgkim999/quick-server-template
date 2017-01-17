"use strict";

let Parse = require('parse/node');

class BaseModel extends Parse.Object {
  constructor(className) {
      // Pass the ClassName to the Parse.Object constructor
      super(className);
    }
  getQuery() {
    return new Parse.Query(this);
  }
}

module.exports = BaseModel;
