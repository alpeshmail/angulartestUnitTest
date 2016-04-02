'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-angular-builder');
    grunt.loadNpmTasks('grunt-angular-combine');

    grunt.initConfig({
        angularCombine: {
            combine: {
                files: [{
                    cwd: 'app/modules',
                    src: ['module1/foo.html', 'module2/woot.html'],
                    dest: 'tmp/combined/modules.html'
                }]
            }
        }
    });
};
