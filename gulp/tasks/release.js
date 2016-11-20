var gulp = require('gulp'),
	runSequence = require('gulp-run-sequence'),
	clean = require('gulp-clean'),
	zip = require('gulp-zip'),
	config = require('../config.js');

gulp.task('release', function(){
	runSequence('clean','sass', 'html', 'javascript_release', 'font', 'iconfont', 'tpl', 'image','zip');
});


gulp.task('clean', function(){
	return gulp.src('build').pipe(clean());
});



gulp.task('zip', function(){
	
	return gulp.src(['build/**/*'])
		.pipe(zip(config.build.release_name + '.zip'))
		.pipe(gulp.dest(''));
});