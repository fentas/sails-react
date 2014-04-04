# sails-react
The aim of this plugin is to make the whole process of working with fb react (http://facebook.github.io/react/index.html) as easy as possible.
And also to integrate it into Sails workflow.

With the default configuration it will parse your generated view for any html tag containing `sails-react`.
If so, the given tag (e.g. `<TodoApp sails-react />`) will be used to match a specific tag within your template folder (here `assets/templates/todoapp.jsx`).
This file will be processed through the configured view engine (to make use of the integrated i18n for example).
Then it will be compiled from jsx to standard javascript.
And at last it will be minified before it will be released.

Of cource the result can be (will be in default) cached to contain the overhead of this whole procedure.
But if you are developing on the jsx file disable cache. It saves time not to be forced to restart sails.
If an error occures cache will be automatically disabled.

## Current State
Version: `0.0.2`

This package is on its first steps. The near future will tell how it proves itself and what will be changed.
Please feel free to make any helpfull suggestions.

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

Or register the plugin within the root package.json file in your sails project. `"sails-react": "~0.0.2"`
After this update the npm packages with:

```shell
npm install
```

## Usage
To use sails-react you have to insert the following code into `config/express.js` (As usual within your project folder):

```js
customMiddleware: function (app) {
  app.use(require('../node_modules/sails-react').middleware(app));
},
```

That should be enough to get started. There are several configurations posible.
The default configuration is:

```js
module.exports = {
  /**
  * Relative path to react templates.
  *
  * @property templates
  * @type {String}
  * @default "/assets/templates"
  */
  templates: "/assets/templates",
  
  temporary: {
    /**
    * Using temp folder.
    *
    * true    : to use same folder as templates folder above (necessary for require() - browserify).
    * false   : for using system temp folder.
    * String  : for specific folder.
    *
    * @property temporary.folder
    * @type {String|Boolean}
    * @default true
    */
    folder: true,
    /**
    * Prefix for temp files.
    *
    * @property temporary.prefix
    * @type {String}
    * @default "sails-react_"
    */
    prefix: "sails-react_",
    /**
    * Ceep it clean. Remove temp files after usage.
    *
    * @property temporary.prefix
    * @type {String}
    * @default "sails-react_"
    */
    cleanup: true
  },
  
  render: {
    /**
    * If sails-react finds an react html tag, it will use the file pattern to look after a match
    * within the templates (above) folder.
    * You also could use this for subdirs, like "$<path>/$<lang>.jsx".
    *
    * $<path>  : will be replaced with the given html tag or the specfic value (<... sails-react="$<path>" />)
    * $<lang>  : client language (e.g. en|de|fr|ru|sp...)
    *
    * @property render.filePattern
    * @type {String}
    * @default "$<path>.jsx"
    */
    filePattern: "$<path>.jsx",
    /**
    * File pattern (above) will be forced to lower case.
    *
    * @property render.lowerCaseFilenames
    * @type {Boolean}
    * @default true
    */
    lowerCaseFilenames: true,
    /**
    * How to handle the given html tag.
    *
    * false   : nothing will be done.
    * true    : it will keep the tag name but it will be use automatically as top level element.
    * String  : the html tag will be replace by the given string. (<TodoApp seils-react /> becomes <div id="..." />)
    *
    * @property render.autoUseTag
    * @type {String|Boolean}
    * @default "div"
    */
    autoUseTag: "div",
    /**
    * If render.autoUseTag is true this querySelector will be used to match the replaced html tag for react.
    * You could use for example jQuery.
    *
    * @property render.querySelector
    * @type {String}
    * @default "document.querySelector"
    */
    querySelector: "document.querySelector",
    /**
    * First process step. The matched file will be parsed by the configured view engine. (like sails JST)
    *
    * @property render.processView
    * @type {Boolean}
    * @default true
    */
    processView: true,
    /**
    * Second process step. The matched file will be compiled from jsx to standard javascript.
    *
    * @property render.processJsx
    * @type {Boolean}
    * @default true
    */
    processJsx: true
  },
  
  linker: {
    /**
    * Third process step. The matched file will be minified.
    * uglify-v2 will be used for that.
    *
    * @property linker.minify
    * @type {Boolean}
    * @default true
    */
    minify: true,
    /**
    * The given string will be used as an anker to insert automatically the processed file.
    * If false nothing will be insert.
    *
    * @property linker.lookfor
    * @type {String|Boolean}
    * @default "</body>"
    */
    lookfor: "</body>",
    /**
    * Where exactly to insert the processed file.
    *
    * true    : insert it after linker.lookfor
    * false   : insert it before linker.lookfor
    * null    : replace linker.lookfor
    *
    * @property linker.after
    * @type {Object|Boolean}
    * @default "</body>"
    */
    after: false,
    /**
    * This works only if cache is enabled.
    * Whether to insert the source code or link only the cached file.
    *
    * true    : link cached file.
    * false   : insert the source code of the processed file directly.
    *
    * @property linker.linkCacheFile
    * @type {Boolean}
    * @default true
    */
    linkCacheFile: false,
    /**
    * The type of the script tag.
    * If you use jsx at the client side you would use "text/jsx".
    *
    * @property linker.scriptType
    * @type {String}
    * @default "text/javascript"
    */
    scriptType: "text/javascript",
  },

  // Use cache if you have static content in the end, to avoid unnecessary overhead.
  cache: {
    /**
    * Whether to enable or disable cache.
    *
    * @property cache.enabled
    * @type {Boolean}
    * @default true
    */
    enabled: true,
    /**
    * How to save the generated cache files.
    * This files will be saved into the public folder of sails. (e.g. /.tmp/public/)
    * Normally the folder will be cleard after every lift.
    * You have following placeholder to your disposal:
    *
    * $<url>   : the called url. Any special char within the url will be replaced with '_'.
    * $<lang>  : the used language.
    *
    * @property cache.dest
    * @type {String}
    * @default "$<url>-$<lang>.js"
    */
    dest: "$<url>-$<lang>.js"
  }
};
```

You can overwrite these of cource if you modify the file `node_modules/sails-react/lib/options.js`.
Or better you create a new config file `config/sailsReact.js`.

## Donation
Please help me to finance my every cup of tea. Every coin is appreciated.

```
Sick of tea? That’s like being sick of *breathing*! - Uncle Iroh
```

Bitcoin address: `197EypPopXtDPFK6rEbCw6XDEaxjTKP58S`

PayPal: `jan.guth@gmail.com`

Or just `flattr` this repo.
