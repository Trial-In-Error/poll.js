module.exports = function(grunt) {
        require('load-grunt-tasks')(grunt);
 
        grunt.initConfig({
                pkg: grunt.file.readJSON('package.json'),
                concat: {
                        options: {
                                //separator: ''
                        },
                        dist: {
                                src: ['./dist/*.min.js'],
                                dest: './dist/newpollvisD.js'
                        },
                        human: {
                                src: ['js/*.js'],
                                dest: './dist/newpollvis.js'
                        }
                },
                uglify: {
                        options: {
                                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                                mangle: {except : ['maggio']}, //see mangle: except: {} once you know more!
                                compress : {
                                        drop_console : true
                                }
                                //report: 'min'
                        },
                        dist: {
                                files: {
                                        'dist/out.min.js' : ['js/*']
                                }
                        }
                },
                lintspaces: {
                        all: {
                                        src: [ '*.js', '!*.min.js' ],
                                        options: {
                                                        trailingspaces: true,
                                                        //trailingspacesSkipBlanks: true,
                                                        indentation: 'tabs',
                                                        ignores: ['js-comments'],
                                                        showValid: true,
                                                        showTypes: true,
                                                        showCodes: true
                                        }
                        }
                },
                jshint: {
                        // Custom options
                        options: {
                                'immed': true,
                                'latedef': true,
                                'newcap': true,
                                'nonew': true,
                                'plusplus': true,
                                'quotmark': true,
                                'laxbreak': true,
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
                        },
                        dist: {
                                src: [ '*.js', '!*.min.js' ],
                        }
                },
                lineending: {
                        dist: {
                                options: {
                                        eol: 'lf',
                                        overwrite: true
                                },
                                files: {
                                        '': ['**/.js', '**/.json', '**/.md', '**/*.gitignore', 'bin/*', 'public/javascripts/*.js', 'public/dist/javascripts/*.js', 'public/stylesheets/*.css', 'routes/*', 'views/*', '!*.png', '!*.svg', '!*.jpg', '!*.jpeg', '!*.log', '!/logs/*']
                                }
                        }
                },
                clean : {
                        dist:{
                                src : ["./dist/*"]
                        }
                }
        });
 
        grunt.registerTask('default', ['clean:dist','concat:human']);
        grunt.registerTask('human', ['clean:dist','concat:human']);
        grunt.registerTask('dist', ['clean:dist','uglify:dist', 'concat:dist']);
        grunt.registerTask('lint', ['jshint:dist', 'lintspaces:dist', 'lineending:dist']);
};