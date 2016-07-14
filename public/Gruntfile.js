module.exports = function(grunt) {

	grunt.initConfig({
		uglify: {
			my_target: {
				files: {
					'concat1.min.js': ['concat.min.js']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');

};