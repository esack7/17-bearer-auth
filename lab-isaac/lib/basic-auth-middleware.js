'use strict';

const debug = require('debug')('cfgram:basic-auth-middleware');
const errorHandler = require('./error-handler');

module.exports = function(req, res, next) {
  debug('basic auth');

  // grab the headers and look for authorization
  let authHeaders = req.headers.authorization;
  if(!authHeaders) return errorHandler(new Error('authorization failed, auth headers required'));
  // parse the base64 user:pass into something usable
  // 'Basic somerandomtoken' => ['Basic ', 'somerandomtoken']
  let base64Str = authHeaders.split('Basic ')[1];
  if(!base64Str) return errorHandler(new Error('authorization failed, username:password required'));
  // attach the parsed data to the req and next
  let [username, password] = Buffer.from(base64Str, 'base64').toString().split(':');

  req.auth = { username, password };

  if(!req.auth.username) return errorHandler(new Error('authorization failed, username required'));
  if(!req.auth.password) return errorHandler(new Error('authorization failed, password required'));

  next();
};