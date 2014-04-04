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




//TODO: clean up this method! make it pretty...
module.exports = function(html, _options, fn) {
  var errors = null,
      sails = _options.sails,
      _ = _options._,
      b = browserify(),
      options = _.merge(require('./options'), sails.config.sailsReact || {}),
      templateFolder = path.join(sails.config.rootPath, options.templates);
  
  if ( options.temporary.folder === true )
    // if true use standard template folder for temp files
    options.temporary.folder = templateFolder;

  // check cache
  options.cache._isCached = false;
  if ( options.cache.enabled ) {
    
    options.cache._relFile = utils.placeholder(options.cache.dest, {url: _options.req.url.replace(/[^a-z0-9_\-\.]/ig, '_'), lang: _options.locale});
    options.cache._file = path.join(sails.config.paths.public, options.cache._relFile);
    
    utils.slog('Check cache file: [' + options.cache._file + ']');
    // ceck if cache was already created
    if ( fs.existsSync(options.cache._file) ) {
      options.cache._isCached = true;
    }
  }

  // check if it is necessary to parse html
  if ( ! options.cache._isCached || options.render.autoUseTag ) {
    var tagNumber = 0;
    
    html = html.replace(new RegExp('<\s*([a-z0-9_-]+)[^<]+?(sails-react(:?="([^"]+?)")?)[^>]*?>', 'ig'), function(match, tag, sailsReact, specific, offset, string) {
      var lookup = (specific || tag),
          // escape for regex
          sailsReactTag = new RegExp(utils.regex(sailsReact), ''),
          reactScript = "\n",
          tempName = "sails-react_tag_" + tagNumber++;

      // no need to process all this if file is already cached.
      if ( ! options.cache._isCached ) {
      
        if ( options.render.lowerCaseFilenames )
          lookup = lookup.toLowerCase();

        var file = path.join(templateFolder, utils.placeholder(options.render.filePattern, {path: lookup, lang: _options.locale})),
            tempFile = null;

        // Only continue if file exists
        if ( fs.existsSync(file) ) {
          utils.slog('Process file: [' + file + ']');

          // create temp id + file
          try {
            tempFile = tmp.createFileSync(fs.readFileSync(file), options.temporary);
          }
          catch(err) { utils.slog('Could not write to temp file.' + err.toString(), 'warn'); return fn(null, html); }

          if ( options.render.processView ) {
            // lets run registered view engine
            sails.config.views.engine.fn(tempFile, _options, function(err, view) {

              if ( ! err ) {
                fs.writeFileSync(tempFile, view);
              }
              else {
                // disable caching
                options.cache.enabled = false;
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
            fs.appendFileSync(tempFile, rComponent);
          }

          // add file to browserify
          b.add(tempFile);

          // save file name for cleanup later on
          if ( options.temporary.cleanup ) {
            options.temporary._cleanup = options.temporary._cleanup || [];
            options.temporary._cleanup[options.temporary._cleanup.length] = tempFile;
          }
        }
        else {
          utils.slog('There is no such file: [' + file + ']', 'warn');
        }
      }

      var replacementTag = match;
      if ( typeof options.render.autoUseTag == 'string' )
        replacementTag = '<' + options.render.autoUseTag + ' id="' + tempName + '" />';
      else if ( options.render.autoUseTag )
        replacementTag = match.replace(sailsReactTag, 'sails-react="' + tempName + '"');
      else
        replacementTag = match.replace(sailsReactTag, '');

      return replacementTag;
    });
  }

  if ( options.cache._isCached ) {

    utils.slog('Using cached file.');
    if ( options.linker.linkCacheFile )  {
      // only link cached file
      html = linker.insert(options.cache._relFile, html, options);
      fn(null, html);
    }
    else {
      // insert source of cached file
      fs.createReadStream(options.cache._file).pipe(linker.stream(html, options, fn));
    }
  }
  else {
    // process data
    
    if ( options.render.processJsx ) {
      // let compile jsx to js
      b.transform(greact.browserify);
    }

    // process files
    try {
      b.bundle().pipe(linker.stream(html, options, fn));
    }
    catch ( err ) {
      // disable caching
      options.cache.enabled = false;
      utils.slog('Browserify throws error: ' + err.toString(), 'warn');
    }
  }
};
