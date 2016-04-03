/// <reference path="F:\Alpesh\TestProject\TestAngular\TestAngular\app/app.js" />
/// <reference path="F:\Alpesh\TestProject\TestAngular\TestAngular\app/app.js" />
/// <binding Clean='default' />
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            build: {
                options: {
                    force: true
                },
                src: ["wwwroot",
                    "buildout/common/"
                ]
            }
        }
        ,copy: {
            nonJsCssFiles: {
                expand: true,
                src: [
                  "app/common/**/*.js",
                  "!*.json"
                ],
                dest: "buildout/common/"
            }
        },
        concat: {
            generated: {
                files: [
                  {
                      dest: 'buildout/common/output/common.js',
                      //src: [ "buildout/common/*.js"]
                      src: ["app/common/**/*.js",
                           "!app/common/Gruntfile.js",
                          "!*.json"
                      ],
                  }
                ]
            }
        },
        uglify: {
            generated: {
                files: [
                  {
                      dest: 'buildout/common/output/common.min.js',
                      src: ['buildout/common/output/common.js']
                  }
                ]
            }
        }
        //,
        //concat: {
        //    js: { //target
        //        src: ['./public/min-safe/app.js', './public/min-safe/js/*.js'],
        //        dest: './public/min/app.js'
        //    }
        //},
    });
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-concat");
    //grunt.loadNpmTasks("grunt-usemin");
    // grunt.loadNpmTasks("grunt-angular-template-inline-js");
    grunt.loadNpmTasks("grunt-contrib-copy");
    //grunt.loadNpmTasks("grunt-contrib-htmlmin");
    //grunt.loadNpmTasks("grunt-contrib-cssmin");
    //grunt.registerTask("default", ['concat', 'uglify']);
    grunt.registerTask("default", ['clean', 'copy', 'concat', 'uglify']);
};
