'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        ghPagesDir: '../Leaflet.MultiOptionsPolyline@gh-pages/',
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
                }
            }
        },
        jshint: {
            files: ['Leaflet.MultiOptionsPolyline.js', 'demo/js/*.js'],
            options: {
            }
        },
        copy: {
            "gh-pages": {
                files: [
                    {expand: true, src: ['demo/**'], dest: '<%= ghPagesDir %>'},
                    {expand: true, src: ['Leaflet.MultiOptionsPolyline.js'], dest: '<%= ghPagesDir %>'}
                ]
            }
        },
        jasmine: {
            pivotal: {
                src: [
                    'src/**/*.js'
                ],
                options: {
                    specs: 'spec/*Spec.js',
                    helpers: 'spec/*Helper.js',
                    vendor: [
                        'http://cdn.leafletjs.com/leaflet-0.7.2/leaflet-src.js'
                    ],
                    '--local-to-remote-url-access': true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'spec'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-contrib-jasmine');
    //grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['jshint', /*'connect', 'jasmine',*/ 'uglify']);

    //grunt.registerTask('test', ['connect', 'jasmine']);

};