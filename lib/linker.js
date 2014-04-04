/** 
 * Copyright(c) 2014 Jan Guth <git@pan.st>
 * MIT Licensed
 */

/**
 * Dependencies.
 */
var utils = require('./utils'),
    writable = require('stream').Writable,
    tmp = require('./temporary'),
    uglifyJs = require("uglify-js"),
    fs = require('fs');


function insert(source, html, options) {
  // dynamic insert
  if ( options.linker.lookfor ) {

    if ( options.linker.linkCacheFile && ! options.cache.enabled ) {
      utils.slog('You can not link cache file if cache is not enabled.', 'warn');
    }
    else {
      if ( options.linker.linkCacheFile )
        source = "\n<script type=\"" + options.linker.scriptType + "\" src=\"" + source + "\"></script>\n";
      else
        source = "\n<script type=\"" + options.linker.scriptType + "\">\n" + source + "\n</script>\n";

      if ( typeof options.linker.lookfor == 'string' ) {
        // insert source code
        return html.replace(new RegExp(utils.regex(options.linker.lookfor), ''), function(match) {
          var replacement = '';

          if ( options.linker.after === null )
            replacement = source;
          else if ( options.linker.after )
            replacement = match + source;
          else
            replacement = source + match;

          return replacement;
        });
      }
    }
  }
}
// register insert method
module.exports.insert = insert;

module.exports.stream = function(html, options, cb) {
  
  var source = '';
  
  var stream = new writable();
  
  stream.write = function (data) {
    source += data;
    // true means 'yes i am ready for more data now'
    return true;
  };
  
  stream.end = function (data) {
    
    // minifiy end result?
    if ( options.linker.minify && ! options.cache._isCached ) {
      try {
        source = uglifyJs.minify(source, {fromString: true}).code;
      }
      catch ( err ) { 
        // disable caching
        options.cache.enabled = false;
        utils.slog('Could not minify finished source: ' + err.toString(), 'warn');
      }
    }
    
    // write cache file?
    if ( options.cache.enabled && ! options.cache._isCached ) {
      try {
        utils.slog('Writing cache file.');
        // make it sync? need for it?
        fs.writeFile(options.cache._file, source);
      } catch ( err ) { utils.slog('Could not write cache file: ' + err.toString(), 'warn'); }
    }

    if ( options.linker.linkCacheFile )
      // only link cached file
      html = insert(options.cache._relFile, html, options);
    else
      html = insert(source, html, options);

    cb(null, html);
    
    // clean up temporary files
    if ( options.temporary._cleanup && options.temporary._cleanup.length > 0)
      tmp.cleanup(options.temporary._cleanup);
      
    // optional
    this.emit('close');
  };
  
  // return writable stream
  return stream;
};
