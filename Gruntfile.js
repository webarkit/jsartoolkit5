/*global module,require */
module.exports = function (grunt) {

  'use strict';

  var pkg = grunt.file.readJSON('package.json');


  grunt.initConfig({

    pkg: pkg,

    jsdoc: {
      dist: {
        src: ['js/artoolkit.api.js'],
        options: {
          destination: 'doc/reference',
          private: false,
          template: './node_modules/ink-docstrap/template',
          configure: 'conf.json'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');

};
