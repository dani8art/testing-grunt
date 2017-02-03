/*!
registry 1.10.12, built on: 2017-01-30
Copyright (C) 2017 ISA group
http://www.isa.us.es/
http://registry.governify.io/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version. A copy of the license has been
included with this distribution in the LICENSE file.  If not, see
<http://www.gnu.org/licenses/>.
*/


'use strict';
var milestones = require('./app/generateChangeLog.js');

module.exports = function (grunt) {

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadNpmTasks('grunt-release-github');

    grunt.loadNpmTasks('grunt-banner');

    grunt.loadNpmTasks('grunt-dockerize');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        license: grunt.file.read('LICENSE', {
            encoding: 'utf8'
        }).toString(),
        releaseNote: grunt.file.read('ReleaseNote', {
            encoding: 'utf8'
        }).toString(),
        usebanner: {
            license: {
                options: {
                    position: 'top',
                    banner: '/*!\n<%= license %>*/\n',
                    replace: true
                },
                files: {
                    src: ['**/*.js']
                }
            },
            readme: {
                options: {
                    position: 'bottom',
                    banner: '### Latest release\n\n<%= releaseNote %>',
                    replace: /###\sLatest\srelease(\s||.)+/g,
                    linebreak: false
                },
                files: {
                    src: ['README.md']
                }
            }
        },
        // uglify: {
        //     options: {
        //         banner: '/*!\n<%= license %>*/\n'
        //     },
        //     // build: {
        //     //     src: 'app/*.js',
        //     //     dest: 'build/<%= this.name %>.min.js'
        //     // },
        //     all: {
        //         files: [{
        //             expand: true,
        //             cwd: 'app/',
        //             src: ['*.js', '**/*.js'],
        //             dest: 'build/',
        //             ext: '.js',
        //         }]
        //     }
        // },
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
                changelogFromGithub: true,
                githubReleaseBody: 'See [CHANGELOG.md](./CHANGELOG.md) for details.',
                //changelogText: '\nhello\n <%= grunt.config.get("pkg.changelog") %>',
                npm: false, //default: true
                //npmtag: true, //default: no tag
                beforeBump: [], // optional grunt tasks to run before file versions are bumped
                afterBump: [], // optional grunt tasks to run after file versions are bumped
                beforeRelease: [], // optional grunt tasks to run after release version is bumped up but before release is packaged
                afterRelease: [], // optional grunt tasks to run after release is packaged
                updateVars: ['pkg'], // optional grunt config objects to update (this will update/set the version property on the object specified)
                github: {
                    repo: "dani8art/testing-grunt",
                    accessTokenVar: "GITHUB_ACCESS_TOKEN",
                    usernameVar: "GITHUB_USERNAME"
                }
            }
        },
        watch: {
            scripts: {
                files: ['app/*.js'],
                tasks: ['jshint', 'uglify']
            }
        },
        dockerize: {
            'testing-grunt-latest': {
                options: {
                    auth: {
                        email: "DOCKER_HUB_EMAIL",
                        username: "DOCKER_HUB_USERNAME",
                        password: "DOCKER_HUB_PASSWORD"
                    },
                    name: 'testing-grunt',
                    push: true
                }
            },
            'testing-grunt-version': {
                options: {
                    auth: {
                        email: "DOCKER_HUB_EMAIL",
                        username: "DOCKER_HUB_USERNAME",
                        password: "DOCKER_HUB_PASSWORD"
                    },
                    name: 'testing-grunt',
                    tag: '<%= pkg.version %>',
                    push: true
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'uglify']);

    grunt.registerTask('build', ['jshint', 'mochaTest', 'dockerize']);

    grunt.registerTask('test', ['jshint', 'mochaTest']);

    grunt.registerTask('dev', ['watch']);

};