'use strict';

// export grunt
module.exports = function (grunt) {
  // init config
  grunt.initConfig({
    // default package
    pkg           : grunt.file.readJSON('package.json'),
    /**
     * Ng Annotate -> pre process angular file with a correct syntax
     */
    ngAnnotate    : {
      options : {
        singleQuotes  : true,
        separator     : ';'
      },
      // main app files
      app     : {
        files : {
          'dist/yocto-angular-jwt.annotated.js' : 'src/index.js'
        }
      }
    },
    /**
     * Uglify permit to minify javascript file
     */
    uglify        : {
      options : {
        mangle   : true,
        compress : true
      },
      // process angular file
      angular : {
        files : [{
          expand  : true,
          cwd     : 'dist/',
          src     : '*.js',
          dest    : 'dist/'
        }]
      }
    },
    /**
     * Post process for ng-annotate process fo create a file named .min.js
     */
    rename        : {
      angular : {
        src  : 'dist/yocto-angular-jwt.annotated.js',
        dest : 'dist/yocto-angular-jwt.preconcat.js'
      }
    },
    /**
     * Cleanning rules
     */
    clean         : {
      dist    : [ 'dist/*.js' ],
      concat  : [ 'dist/*preconcat.js' ]
    },
    /**
     * Concat file
     */
    concat        : {
      jwt : {
        files : {
          'dist/yocto-angular-jwt.min.js' : [
            'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
            'bower_components/angular-jwt/dist/angular-jwt.min.js',
            'dist/yocto-angular-jwt.preconcat.js'
          ]
        }
      }
    },
    // hint our app
    yoctohint     : {
      options  : {},
      all      : [ 'Gruntfile.js' ]
    },
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-rename');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('yocto-hint');

  grunt.registerTask('hint', 'yoctohint');
  // assets register task
  grunt.registerTask('build', [ 'hint', 'clean:dist', 'ngAnnotate',
                                'uglify', 'rename', 'concat', 'clean:concat'
                              ]);
  grunt.registerTask('default', 'build');
};
