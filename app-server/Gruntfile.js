module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          args: [],
          nodeArgs: [],
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
          },
          ignore: ['node_modules/**'],
          ext: 'js',
          delay: 1000,
        }
      },
      exec: {
        options: {}
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');

  // Default task(s).
  grunt.registerTask('default', ['nodemon']);

};
