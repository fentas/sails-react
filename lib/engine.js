/*!
 * Copyright(c) 2014 Jan Guth <git@pan.st>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var render = require('./render'),
    utils = require('./utils');

/**
 * sails-react middleware
 * rerouts view request to parse and include react objects.
 *
 * @param {Object} expressjs app object
 * @param {Object} options
 * @api public
 */
module.exports = function(path, options, fn) {
  sails.config.views.engine.fn(path, options, function(err, viewHtml) {
    // only progress if there is no error
    if ( ! err ) {
      // let parse html and include compiled react
      render(viewHtml, options, function(reactErr, reactHtml) {
        if ( reactErr ) {
          utils.slog('Error occured while parsing [' + path + ']', 'error');
          utils.slog(reactErr, 'error');
          
          // only return detailed error in development mode
          if (process.env.NODE_ENV === 'development') {
            //TODO: show error page;
            return fn(reactErr, null);
          }
        }
        fn(null, reactHtml);
      });
    }
    else fn(err, viewHtml);
  });
};
      