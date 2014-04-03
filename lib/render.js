/*!
 * Copyright(c) 2014 Jan Guth <git@pan.st>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('./utils'),
    path = require('path'),
    fs = require('fs'),
    
    linker = require('./linker'),
    tmp = require('./temporary'),
    browserify = require('browserify'),
    greact = require('grunt-react');





module.exports = function(html, _options, fn) {
  var errors = null,
      sails = _options.sails,
      _ = _options._,
      b = browserify(),
      options = _.merge(require('./options'), sails.config.sailsReact || {}),
      templateFolder = path.join(sails.config.rootPath, options.templates);
      // TODO: include notice comment.
  
  //return fn(err, html);

  html = html.replace(new RegExp('<\s*([a-z0-9_-]+)[^<]+?(sails-react(:?="([^"]+?)")?)[^>]*?>', 'ig'), function(match, tag, sailsReact, specific, offset, string) {
    var lookup = (specific || tag),
        // escape for regex
        sailsReactTag = new RegExp(utils.regex(sailsReact), ''),
        reactScript = "\n";
    
    if ( options.render.lowerCaseFilenames )
      lookup = lookup.toLowerCase();
    
    var file = path.join(templateFolder, options.render.filePattern.replace(/\$<([^>]+)>/g, function(m, exp) {
      switch ( exp ) {
          case "path":
            return lookup;
          case "lang":
            return _options.locale;
          default: 
            utils.slog('file pattern unkown: ' + exp, 'warn');
      }
    }));
    
    // Only continue if file exists
    if ( fs.existsSync(file) ) {
      utils.slog('Process file: [' + file + ']');
      
      // create temp id + file
      var tempName = null;
      try {
        tempName = tmp.tempName(options.temporary);
        file = tmp.createFileSync(fs.readFileSync(file), _.merge({name: tempName}, options.temporary));
      }
      catch(err) { utils.slog('Could not write to temp file.' + err.toString(), 'warn'); }
      
      if ( options.render.processView ) {
        // lets run registered view engine
        sails.config.views.engine.fn(file, _options, function(err, view) {
          
          if ( ! err ) {
            fs.writeFileSync(file, view);
          }
          else {
            utils.slog('View engine (' + sails.config.views.engine.ext + ') throws error: ' + err.toString(), 'warn');
          }
        });
      }
      
      if ( options.render.autoUseTag ) {
        var rComponent = "\n",
            // remove sails-react attribute
            cleanMatch = match.replace(sailsReactTag, '');

        rComponent += "React.renderComponent(" + 
          cleanMatch + ", " + 
          (typeof options.render.autoUseTag == 'string' ? "document.getElementById('" + tempName + "')" : options.render.querySelector + "('" + tag + "[sails-react=\"" + tempName + "\"]')") +
          ");";
        fs.appendFileSync(file, rComponent);
      }
      
      // add file to browserify
      b.add(file);
      // save file name for cleanup later on
      if ( options.temporary.cleanup ) {
        options.temporary._cleanup = options.temporary._cleanup || [];
        options.temporary._cleanup[options.temporary._cleanup.length] = file;
      }
    
      var replacementTag = match;
      if ( typeof options.render.autoUseTag == 'string' )
        replacementTag = '<' + options.render.autoUseTag + ' id="' + tempName + '" />';
      else if ( options.render.autoUseTag )
        replacementTag = match.replace(sailsReactTag, 'sails-react="' + tempName + '"');
      else
        replacementTag = match.replace(sailsReactTag, '');
        
      return replacementTag;
    }
    else {
      utils.slog('There is no such file: [' + file + ']', 'warn');
    }
    
    //TODO: replace with error?
    return match;
  });
  
  
  if ( options.render.processJsx ) {
    // let compile jsx to js
    b.transform(greact.browserify);
  }
  
  // process files
  b.bundle().pipe(linker(html, options, fn));
};