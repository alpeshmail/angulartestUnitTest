module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        hub: {
            all: {
                options : {
                    allowSelf : true
                },
                src: ['app/Gruntfile.js','app/common/Gruntfile.js',
                      ],
                tasks: ['default'],
            }
        },
        "node-inspector" : {
            dev : {}
        }
    });

    grunt.loadNpmTasks('grunt-hub');
   // grunt.loadNpmTasks('grunt-node-inspector');

   // grunt.registerTask('default', ['node-inspector']);
    grunt.registerTask('default', ['hub']);
};