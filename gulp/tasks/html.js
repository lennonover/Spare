var fileinclude = require('gulp-file-include'),
  gulp = require('gulp');

gulp.task('html', function() {
  return gulp.src(['src/view/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('build/'));
});
