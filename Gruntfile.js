'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        ghPagesDir: '../Leaflet.MultiOptionsPolyline@gh-pages/',
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name + " v" + pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
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
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['jshint', 'uglify']);

};