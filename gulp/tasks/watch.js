var gulp = require('gulp'),
	config = require('../config'),
	livereload = require('gulp-livereload');

gulp.task('watch', function () {
	//livereload.listen();
	gulp.watch('src/tpl/**/*.tpl', ['tpl']);
	gulp.watch(['src/scss/**/*.scss'], ['sass']);
	gulp.watch(['src/font/**/*.*'], ['font']);
	gulp.watch(['src/js/**/*.*'], ['javascript']);
	gulp.watch(['src/view/**/*.html'], ['html']);
	
	//gulp.watch('/**/*.*', livereload.changed);
});