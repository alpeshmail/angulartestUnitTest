module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        config: grunt.file.readJSON('config.json'),
        clean: {
            build: {
                options: {
                    force: true
                },
                src: ["wwwroot",
                    "buildout/fullVersion"
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
                  "buildout/common/output/common.js",
                  "!*.json"
                ],
                dest: "buildout/fullVersion/"
            }
        },
        concat: {
            generated: {
                files: [
                  {
                      dest: 'buildout/fullVersion/output/amsclient.js',
                      src: '<%= config.sourceFiles %>',
                      //src: [
                      //  'app/app.js',
                      //  'app/config.js',
                      //  'app/config.route.js',
                      //  'app/exceptionHandler.js',
                      //  "app/common/**/*.js",
                      //  "!app/common/Gruntfile.js",
                      //]
                  }
                ]
            }
        },
        uglify: {
            generated: {
                files: [
                  {
                      dest: 'buildout/fullVersion/output/amsclient.min.js',
                      src: ['buildout/fullVersion/output/amsclient.js']
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
