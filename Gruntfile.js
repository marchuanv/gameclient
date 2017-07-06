module.exports = function(grunt) {

  // Project configuration.
 	grunt.initConfig({
  		uglify : {
  			dist: {
	            files: {
		        	'release/game.min.js': [
		        		'release/core/*.js',
		        		'release/config/*.js',
		        		'release/game/*.js'
		        	]
	        	},
	        	options: {
			    	mangle: false
			    }
	        }
		}
	});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
};