'use strict';

var assert = require('better-assert');

var crypto = require('crypto');

var Q = require('q');
var Knox = require('knox');

var config = require('afrostream-node-config').get();

var Bucket = function (options) {
  assert(options);
  assert(typeof options.name === "string" && options.name);

  this.client = Knox.createClient({
    key:    options.key || config.amazon.key,
    secret: options.secret || config.amazon.secret,
    bucket: options.name,
    region: options.region || config.amazon.region
  });
};

/**
 * upload a buffer in amazon AWS.
 *
 * ex:
 *   aws.putBufferIntoBucket(bucket, buffer, 'image/jpeg', '{env}/cats/{date}/{rand}-toto.jpg')
 *
 * @param bucket    aws bucket
 * @param buffer    Buffer
 * @param mimeType  string
 * @param path      string
 * @return Promise<Unknown>
 */
Bucket.prototype.put = function (buffer, mimeType, path) {
  assert(buffer instanceof Buffer);
  assert(typeof mimeType === 'string');
  assert(typeof path === 'string' && path);

  // Generate date based folder prefix
  var d = new Date();
  var datePrefix = d.getFullYear()+'/'+ ("0" + (d.getMonth() + 1)).slice(-2);
  var key = crypto.randomBytes(10).toString('hex');

  path = path
    .replace('{env}', config.env)
    .replace('{date}', datePrefix)
    .replace('{rand}', key);

  var headers = {
    'Content-Length': buffer.length,
    'Content-Type': mimeType,
    'x-amz-acl': 'public-read'
  };

  return Q.ninvoke(this.client, 'putBuffer', buffer, path, headers);
};

module.exports = Bucket;