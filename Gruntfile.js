'use strict';

/**
 * Gruntfile.js is used to configure or define tasks and load Grunt plugins.
 *
 * @class Gruntfile
 * @module Grunt file
 * @date 07/07/2015
 * @author ROBERT Mathieu <mathieu@yocto.re>
 * @copyright Yocto SAS, All Right Reserved <http://www.yocto.re>
 *
 */

 // export grunt
 module.exports = function(grunt) {
   // init config
   grunt.initConfig({
     // default package
     pkg : grunt.file.readJSON('package.json'),

     /**
      * Jshint permit to flags suspicious usage in programs
      * @submodule jshint
      */
     jshint : {
       options : {
           node   : true,
           yui    : true,
           undef  : true,
           unused : true,
           strict : true
       },
       all : [
        'src/index.js'
       ]
     },
     /**
      * Todo process
      */
     todo : {
       options : {
          marks : [
            { name : "TODO", pattern : /TODO/, color : "yellow" },
            { name : "FIXME", pattern : /FIXME/, color : "red" },
            { name : "NOTE", pattern : /NOTE/, color : "blue" }
          ],
          file          : "REPORT.md",
          githubBoxes   : true,
          colophon      : true,
          usePackage    : true
        },
        src : [
          'src/index.js'
        ]
      },
      /**
       * Ng Annotate -> pre process angular file with a correct syntax
       */
      ngAnnotate: {
        options : {
          singleQuotes  : true,
          separator     : ';'
        },
        // main app files
        app : {
          files : {
            'dist/yocto-angular-http-encrypt.js' : 'src/index.js'
          }
        }
      },
      /**
       * Uglify permit to minify javascript file
       */
       uglify : {
         options : {
           mangle   : true,
           compress : true
         },
         // process angular file
         angular : {
          files : [{
            expand : true,
            cwd   : 'dist/',
            src   : '*.js',
            dest  : 'dist/'
          }]
         }
       },
       /**
        * Post process for ng-annotate process fo create a file named .min.js
        */
       rename : {
         angular : {
           src  : 'dist/yocto-angular-http-encrypt.js',
           dest : 'dist/yocto-angular-http-encrypt.min.js'
         }
       },
       /**
        * Cleanning rules
        */
       clean : {
        dist : [ 'dist/*.js', '!dist/*.min.js']
      },
      concat : {
         // angular rules
         angular : {
          files : {
            'dist/yocto-angular-http-encrypt.min.js' : ['bower_components/angular-base64/angular-base64.min.js', 'public/assets/js/dist/bazar-ng-controls.min.js']
          }
        }
      }
    });

   // Load the plugins
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-ng-annotate');
   grunt.loadNpmTasks('grunt-todo');
   grunt.loadNpmTasks('grunt-rename');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks("grunt-contrib-cssmin");
   grunt.loadNpmTasks('grunt-contrib-concat');


   // register base tasks
   grunt.registerTask('norme', 'jshint');
   grunt.registerTask('report', 'todo');

   // assets register task
   grunt.registerTask('build', [ 'clean:dist', 'ngAnnotate', 'uglify:angular', 'rename:angular', 'clean:dist' ]);

 };
