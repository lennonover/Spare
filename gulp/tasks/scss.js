var gulp = require('gulp'),
	compass = require('gulp-compass');


gulp.task('sass', function(){
	return gulp.src('src/scss/**/*.scss')
		.pipe(compass({
			css: 'build/assets/css',
			sass: 'src/scss',
			image: 'build/assets/images',
			font: 'src/fonts',
			style: 'compressed'
		}))
		.pipe(gulp.dest('build/assets/css'));
});
