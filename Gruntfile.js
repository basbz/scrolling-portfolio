module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          keepalive: true,
          hostname: '0.0.0.0',
          port: 3030,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('server', 'connect');
};
