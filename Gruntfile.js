/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	copy: {
		files: {src: ['src/policymaker.html'], dest: 'dev/', filter: 'isFile'},
		js: {
			expand: true, flatten: true,
			src: ["src/js/**"],
			dest: "dev/assets/",
			filter: "isFile"
		},
		css: {
			expand: true, flatten: true,
			src: ["src/css/*.css"],
			dest: "dev/assets/",
			filter: "isFile"
		}
	},
	compass: {
		dist: {
			options: {
				config: 'config.rb'
			}
		}
	},
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
    },
	exec: {
		tsserve: {
			command: "cd dev & tsapp serve",
			stdout: true
		},
		tspush: {
			command: "cd dev & tsapp push policymaker_public",
			stdout: true
		}
	}
  });

	// load standard tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks("grunt-exec");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-compass");

	// Default task.
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('run-dev', ['update-tsapp', 'ts-serve']);

	grunt.registerTask('update-tsapp', ['compass', 'copy']);

	grunt.registerTask("ts-deploy", "Deploy the application to TiddlySpace", function() {
		grunt.task.run("exec:tspush");
	});

	grunt.registerTask("ts-serve", "Host the application locally via tsapp", function() {
		grunt.task.run("exec:tsserve");
	});

};
