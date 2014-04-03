# sails-react
An easy way to work with fb react within sailsjs.

## Current State
Version: `0.0.1`

This package is mainly under construction.
Everything you see bellow can be changed in near future!

## Getting Started
This plugin requires:

```
"grunt": "0.4.2",
"grunt-react": "~0.7.0",
"grunt-browserify ": "~2.0.1",
"uglify-js": "~2.4.13"
```

You may install this plugin with this command:

```shell
npm install sails-react --save-dev
```

Or register the plugin within the root package.json file in your sails project. `"sails-react": "~0.0.1"`
After this update the npm packages with:

```shell
npm install
```

## Usage
There are two ways to use this Plugin. 

### As template parser
To activate sails-react as a template parser you have to insert following code into `config/express.js`:

```js
customMiddleware: function (app) {
  app.use(require('../node_modules/sails-react').middleware(app));
},
```

That should be enough to get started. 
As usual there are several configurations.
Following options are available:

```js
{
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
    processJsx: true
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
}
```

### Only grunt
If you think processing the react files every request is an overhead you can compile them once (usually on sails lift) an deliver them as static javascript files.
To do so you have to register sails-react grunt in `tasks/register/compileAssets`. Simply add `"sailsreact"`.

After this you have to create a configuration in `tasks/config/sailsreact.js` like this:

```js
//...
```

Now if you lift sails all the static javascript files will be created as configured.

## Donation
Please help me to finance my every cup of tea. Every coin is appreciated.

```json
Sick of tea? That’s like being sick of *breathing*! - Uncle Iroh
```

Bitcoin address: `197EypPopXtDPFK6rEbCw6XDEaxjTKP58S`

PayPal: `jan.guth@gmail.com`

Or just `flattr` this repo.
