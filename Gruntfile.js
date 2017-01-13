'use strict';

module.exports = function (grunt) {

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadNpmTasks('grunt-release');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        license: grunt.file.read('LICENSE', {
            encoding: 'utf8'
        }).toString(),
        uglify: {
            options: {
                banner: '/*!\n<%= license %>*/\n'
            },
            // build: {
            //     src: 'app/*.js',
            //     dest: 'build/<%= this.name %>.min.js'
            // },
            all: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['*.js', '**/*.js'],
                    dest: 'build/',
                    ext: '.js',
                }]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'app/*.js', 'tests/**/*.js'],
            options: {
                force: true,
                curly: true,
                eqnull: true,
                eqeqeq: true,
                undef: true,
                strict: "global",
                esversion: 6,
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    process: true,
                    require: true,
                    describe: true,
                    it: true
                }
            }
        },
        mochaTest: {
            tests: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'test.results<%= grunt.template.today("yyyy-mm-dd:HH:mm:ss") %>.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                    noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
                },
                src: ['tests/**/*.js']
            }
        },
        release: {
            options: {
                changelog: true, //default: false
                npm: false, //default: true
                //npmtag: true, //default: no tag
                beforeBump: [], // optional grunt tasks to run before file versions are bumped
                afterBump: [], // optional grunt tasks to run after file versions are bumped
                beforeRelease: [], // optional grunt tasks to run after release version is bumped up but before release is packaged
                afterRelease: [], // optional grunt tasks to run after release is packaged
                updateVars: [], // optional grunt config objects to update (this will update/set the version property on the object specified)
                github: {
                    repo: "dani8art/testing-grunt",
                    accessTokenVar: "GITHUB_ACCESS_TOKEN"
                }
            }
        },
        watch: {
            scripts: {
                files: ['app/*.js'],
                tasks: ['jshint', 'uglify']
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'uglify']);

    grunt.registerTask('build', ['jshint', 'mochaTest', 'uglify']);

    grunt.registerTask('dev', ['watch']);

};
