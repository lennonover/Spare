var gulp = require('gulp');
gulp.task('copy', function(){
	gulp.src(['src/*.json'])
		.pipe(gulp.dest('build/assets/'));
});