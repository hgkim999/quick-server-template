/**
 * @flow
 */
const config = require('../config.json');
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const FB = require('fb');
const querystring = require('querystring');

let appToken = '';

class CredentialHelper {
  constructor() {
    FB.options = {
      version: 'v2.8',
      appId: config.appId,
      appSecret: config.appSecret
    };
  }

  validateToken(request_body: Array<any>, success: Function, error: Function) {
    let hmac = crypto.createHmac('sha256', config.appSecret);

    let requestValidate = (appToken) => {
      hmac.update(appToken);

      // generate App Proof
      let appsecret_proof = hmac.digest('hex');

      let _input_token = request_body['access-token'];
      let _user_id = request_body['user-id'];

      FB.api('debug_token', {
        input_token: _input_token,
        access_token: FB.getAccessToken()
      }, (res) => {
        if (!res || res.error) {
          console.log(!res
            ? 'Could not communicate with FB Debug API'
            : res.error);
          error({ reason: 'Could not communicate with FB Debug API'})
          return;
        }

        let data = res.data;
        if (data.is_valid === true && data.app_id == config.appId) {
          console.log('User ' + _user_id + ' was able to validate the token.');
          success({ is_valid: true, user_id: _user_id });
        } else {
          console.log('Warn: User ' + _user_id + ' was NOT able to validate the token.');
          error({ reason: 'Invalid Token'});
        }
      });
    };

    if (!FB.getAccessToken()) {
      console.log('Could not find App Token, trying to fetch one...');
      this.fetchAppToken((data) => {
        requestValidate(appToken);
      }, (err) => {
        console.error('Failed to fetch App Token and validate User Token.');
        console.log(err)
      });
    } else {
      requestValidate(appToken);
    }

  }

  getAppToken() {
    return FB.getAccessToken();
  }

  fetchAppToken(success, error) {
    ///oauth/access_token?client_id={app-id}&client_secret={app-secret}&grant_type=client_credentials
    let options = {};

    FB.api('oauth/access_token', {
      'client_id': config.appId,
      'client_secret': config.appSecret,
      'grant_type': 'client_credentials',
    }, (res) => {
      if (!res || res.error) {
        console.log(!res
          ? 'error occurred'
          : res.error);
        error();
        return;
      }
      // console.log(res);
      FB.setAccessToken(res.access_token);
      success(res);
    });
  }
}

module.exports = CredentialHelper;
