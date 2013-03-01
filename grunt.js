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

	// Default task.
	grunt.registerTask('default', 'lint');

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
