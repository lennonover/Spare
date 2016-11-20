var gulp = require('gulp'),
	runSequence = require('gulp-run-sequence'),
	clean = require('gulp-clean');

gulp.task('dev', function(){
	runSequence(/*'clean',*/'sass', 'html', 'javascript','javascript_uglify','image', 'copy', 'watch');
});

gulp.task('clean', function(){
	//gulp.src(config.release.temp_).pipe(clean());
	return gulp.src('build/**/*').pipe(clean());
});