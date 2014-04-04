
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
function slog(msg, lvl) {
  sails.log[(lvl || 'verbose')]("sails-react :: " + msg);
}
module.exports.slog = slog;


module.exports.regex = function(string) {
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

module.exports.placeholder = function(string, placeholder) {
  return string.replace(/\$<([^>]+)>/g, function(m, exp) {
    if ( typeof placeholder[exp] != 'undefined' )
      return placeholder[exp];
    else
      slog('file pattern unkown: ' + exp, 'warn');
  });
};

module.exports.normCacheName = function(string) {
  return string.replace(/[^a-z0-9_\-\.]/ig, '_');
};
