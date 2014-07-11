module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
//    concat: {
//      options: {
//        separator: ';'
//      },
//      dist: {
//        src: ['src/**/*.js'],
//        dest: 'dist/<%= pkg.name %>.js'
//      }
 //   },
    clean: {
      dist: {
        src: ['./logs/*', './*.log', './public/dist/*']
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        mangle: true //see mangle: except: {} once you know more!
      },
      dist: {
        files: [{
          expand: true, //what does this field do???
          cwd: './public/javascripts',
          src: '**/*.js',
          dest: './public/dist/javascripts'
        }]
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'public/javascripts/*.js', 'routes/*.js', 'test/**/*.js', 'bin/*.js'],

      // Custom options
      options: {
        'immed': true,
        'latedef': true,
        'newcap': true,
        'nonew': true,
        'plusplus': true,
        'quotmark': true,

        // Environments
        'jquery': true,
        'node': true,

        // Custom globals
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    forever: {
      server1: {
        options: {
          index: 'app.js'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    stripJsonComments: {                                // Task
        dist: {                                         // Target
            files: {                                    // Dictionary of files
                'package.json': 'package_dev.json'    // 'destination': 'source'
            }
        }
    },
    replace: {
      cleanjson: {
        src: ['package.json'],
        dest: 'package.json',
        replacements: [{
          from: /[ ]{2,}[\n]/gm,
          to: ''
        }]
      }
    },
    lineending: {
      dist: {
        options: {
          eol: 'lf',
          overwrite: true
        },
        files: {
          '': ['*.js', '*.json', '*.md', '*.gitignore', './bin/*', './public/javascripts/*', 'public/dist/javascripts/*', './public/stylesheets/*','./routes/*', './views/*']
        }
      }
    }
  });

  grunt.registerTask('default', ['stripJsonComments', 'replace', 'lineending', 'uglify']);
  grunt.registerTask('linter', ['jshint']);

  // https://github.com/gruntjs/grunt-contrib-clean/issues/32
  grunt.registerTask('cleaner', ['clean']);

};