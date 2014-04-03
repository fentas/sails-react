
/*!
 * Copyright(c) 2014 Jan Guth <git@pan.st>
 * MIT Licensed
 */

 
/**
 * Faster/centralized way for logging.
 *
 * @param {String} message
 * @return {String} log level. default: verbose
 * @api private
 */
module.exports.slog = function(msg, lvl) {
  sails.log[(lvl || 'verbose')]("sails-react :: " + msg);
};


module.exports.regex = function(string) {
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};