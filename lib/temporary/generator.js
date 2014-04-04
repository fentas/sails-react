/**
 * Temporary - The lord of tmp.
 *
 * Author: Veselin Todorov <hi@vesln.com>
 * Licensed under the MIT License.
 */

/**
 * Dependencies.
 */
var fs = require('fs');
var path = require('path');
var detector = require('./detector');
var existsSync = fs.existsSync || path.existsSync;

/**
 * Generator namespace.
 *
 * @type {Object}
 */
var generator = module.exports;

/**
 * Generates random name.
 *
 * @returns {String}
 */
generator.name = function(options) {
  var id = null,
      tmp = options.folder || detector.tmp(),
      prefix = options.prefix || '';
  do {
    id = prefix + Date.now() + Math.random();
  } while(existsSync(tmp + '/' + id));

  return id + '';
};

/**
 * Buld a full name. (tmp dir + name).
 *
 * @param {object} options
 * @returns {String}
 */
generator.build = function(options) {
  return path.join((options.folder || detector.tmp()), (options.name || this.name(options)));
};
