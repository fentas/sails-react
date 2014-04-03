/** 
 * Copyright(c) 2014 Jan Guth <git@pan.st>
 * MIT Licensed
 */

/**
 * Dependencies.
 */
var fs = require('fs');
var generator = require('./generator');

/**
 * Exporting the lib.
 */
module.exports = {
  //TODO: make better use of options.
  createFileSync: function(content, options) {
    var options = options || {},
        content = content || '',
        file = generator.build(options);
    
    try {
      fs.writeFileSync(file, content, options);
      return file;
    }
    catch(e) { throw e; }
  },
  
  tempName: function(options) {
    var options = options || {};
    return generator.name(options);
  },
  
  cleanup: function(files, cb) {
    var files = typeof files == 'string' ? [files] : files,
        cb = cb || function() {};
    for ( var i = 0 ; i < files.length ; i++ )
      try {
        fs.unlink(files[i], cb);
      }
      catch(err) {}
  }
};
