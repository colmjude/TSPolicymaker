/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    }
  });

	// load standard tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task.
	grunt.registerTask('default', ['jshint']);

	grunt.registerTask('update-tsapp', 'update files in dev to use with tsapp', function () {
		grunt.file.copy('src/policymaker.html', 'dev/policymaker.html');
		grunt.file.recurse('src/css', function(abspath, rootdir, subdir, filename) {
			grunt.file.copy('src/css/'+filename, 'dev/assets/'+filename);
		});
		grunt.file.recurse('src/js', function(abspath, rootdir, subdir, filename) {
			grunt.file.copy('src/js/'+filename, 'dev/assets/'+filename);
		});
  });

};