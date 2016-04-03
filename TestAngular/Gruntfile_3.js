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
                    "buildout/staging"
                ]
            }
        }
        ,
        copy: {
            nonJsCssFiles: {
                expand: true,
                src: [
                  "lib/**",
                  "app/*.*",
                  "!*.json"
                ],
                dest: "buildout/staging/"
            }
        },
        concat: {
            generated: {
                files: [
                  {
                      dest: 'buildout/dis/testapp.js',
                      src: [
                        'app/app.js',
                        'app/config.js',
                        'app/config.route.js',
                        'app/exceptionHandler.js'
                      ]
                  }
                ]
            }
        },
        uglify: {
            generated: {
                files: [
                  {
                      dest: 'buildout/dis/testapp.min.js',
                      src: ['buildout/dis/testapp.js']
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
    grunt.registerTask("default", ['clean', 'copy', 'concat','uglify']);
};
