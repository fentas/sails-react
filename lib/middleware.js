/*!
 * Copyright(c) 2014 Jan Guth <git@pan.st>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var engine = require('./engine'),
    utils = require('./utils');

/**
 * sails-react middleware
 * rerouts view request to parse and include react objects.
 *
 * @param {Object} expressjs app object
 * @param {Object} options
 * @api public
 */
module.exports = function middleware(app) {
  if ( ! app ) {
    console.error('Need expressjs app object.');
    return;
  }
  
  return function(req, res, next) {
    if ( typeof sails !== 'object' ) {
      console.error('Only works with sailsjs at the moment.');
      return next();
    }
    
    // Only check if requested url is actually a registered view
    if ( typeof sails.config.routes[req.url] !== 'undefined' ) {
      utils.slog("Rerouting view engine ({ext: " + sails.config.views.engine.ext + "}) to sails-react.");
      // Overwrite sails view registration in expressjs
      // Teach Express how to render templates w/ our configured view extension
      app.engine(sails.config.views.engine.ext, engine);
    }
    
    next();
  };
};

