module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'public/javascripts/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
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
          '': ['*.js', '*.json', '*.md', '*.gitignore', './bin/*', './public/javascripts/*', './public/stylesheets/*','./routes/*', './views/*']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-forever');
  grunt.loadNpmTasks('grunt-strip-json-comments');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-line-remover');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-lineending');

  grunt.registerTask('default', ['stripJsonComments', 'replace', 'lineending']);

};