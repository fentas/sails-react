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
    uglifyJs = require("uglify-js");




module.exports = function(html, options, cb) {
  
  var source = '';
  
  var stream = new writable();
  
  stream.write = function (data) {
    source += data;
    // true means 'yes i am ready for more data now'
    return true;
  };
  
  stream.end = function (data) {
    var lookfor = utils.regex(options.linker.lookfor);
    
    if ( options.linker.minify ) {
      try {
        source = uglifyJs.minify(source, {fromString: true}).code;
      }
      catch ( err ) { 
        utils.slog('Could not minify finished source: ' + err.toString(), 'warn');
      }
    }
    
    source = "\n<script type=\"" + options.linker.scriptType + "\">\n" + source + "\n</script>\n";

    html = html.replace(new RegExp(lookfor, ''), function(match) {
      var replacement = '';

      if ( options.linker.after === null )
        replacement = source;
      else if ( options.linker.after )
        replacement = match + source;
      else
        replacement = source + match; 

      return replacement;
    });

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