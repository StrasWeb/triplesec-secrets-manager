/*jslint node: true */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        uglify: {
            combine: {
                files: {
                    'dist/main.js': ['js/main.js']
                },
                options: {
                    sourceMap: true
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/*.js'],
                tasks: ['uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uglify']);
};
