
var gulp = require('gulp');


gulp.task('image', function(){
	
	return gulp.src('src/imgs/**/*.*')
		.pipe(gulp.dest('build/assets/imgs/'));

});
