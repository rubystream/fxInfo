module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    "pkg": grunt.file.readJSON("package.json"),
    "jshint": {
      "files": ["./**/*.js"],
      "options": {
        "ignores": ["node_modules/**/*.js"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");

};