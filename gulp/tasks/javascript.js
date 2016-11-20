
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
	replace = require('gulp-replace');


gulp.task('javascript', function(){
	
	return gulp.src('src/js/libs/*.js')
		.pipe(gulp.dest('build/assets/js/libs/'));

});


gulp.task('javascript_uglify', function(){
	
	return gulp.src('src/js/views/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('build/assets/js/views/'));

});