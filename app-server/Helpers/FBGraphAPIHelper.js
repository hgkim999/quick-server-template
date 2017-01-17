/**
 * @flow
 */
const config = require('../config.json');
const querystring = require('querystring');
const FB = require('fb');

class FBGraphAPIHelper {
  constructor(_access_token: string) {
    if (!_access_token) {
      throw Error('You must pass Access Token in order to init FBGraphAPIHelper!');
    }

    FB.options = {
      version: 'v2.8',
      appId: config.appId,
      appSecret: config.masterKey,
      accessToken: _access_token,
    };
  }

  getUserInfo(_user_fbid: string, success: Function, error: Function) {
    try {
      FB.api('/'+ _user_fbid, (res) => {
        // console.log(res);
        if (!res || res.error) {
          console.log(!res
            ? 'Could not communicate with FB Graph API'
            : res.error);
          error({reason: 'Could not communicate with FB Graph API'})
          return;
        }
        // console.log(res);
        success(res);
      });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = FBGraphAPIHelper;
