/**
 * sails-react options
 *
 * Your routes map URLs to views and controllers.
 * 
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */


module.exports = {
  // relative path to react templates
  templates: "/assets/templates",
  
  temporary: {
    // temp folder.
    // null for auto detect.
    folder: null,
    // prefix for temp files.
    prefix: 'sails-react_',
    // remove not used temp files.
    cleanup: true
  },
  
  render: {
    // following options/replacements are available:
    // $<path>  : html tag name (<$<path> />) or specfic value (<... sails-react="$<path>" />)
    // $<lang>  : used language from client (e.g. en|de|fr|ru|sp...)
    // examples : '$<path>.jsx', '$<path>_$<lang>.jsx'
    filePattern: '$<path>.jsx',
    // file pattern will be forced to lower case
    lowerCaseFilenames: true,
    // is value is string or true given tag will be used as top level element for react node
    // if string given tag will be replaced by this value. 
    // to keep given tag use true.
    // false will do nothing to given tag.
    autoUseTag: 'div',
    // if autoUseTag is true following query selector will be used to find given tag.
    // for example $ would be possible in most cases. (jQuery etc.)
    querySelector: "document.querySelector",
    
    // first step: use your view engine. (e.g. JST)
    processView: true,
    // second step: compile jsx to standard javascript
    processJsx: true,
    
    // TODO: implement cache? for what? u could use grunt?
    cache: false
  },
  
  
  linker: {
    // third step: minify results
    minify: true,
    // insert script after (true), before (false) or replace (null) lookfor pattern
    after: false,
    // where to insert script
    lookfor: '</body>',
    // type of script. (e.g. text/jsx)
    scriptType: 'text/javascript',
  }
};