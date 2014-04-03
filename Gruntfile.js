/*
 * 
 * https://github.com/pan-st/sails-react
 *
 * Copyright (c) 2014 Jan Guth
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    sailsreact: {
      default_options: {
        options: {
          appRoot: 'test/'
        },
        files: {
          'test/fixtures/**/*.jsx': 'test/fixtures/*.js'
        }
      }
    },

    // Unit tests.
    //nodeunit: {
    //  tests: ['test/*_test.js'],
    //},

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-browserify');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'sailsreact:default_options', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
