var gulp = require('gulp'),
    browserify = require('browserify'),
    browserSync = require('browser-sync').create(),
    source = require('vinyl-source-stream');



gulp.task('build-jsx', function () {
  browserify({
    entries: ['index.js'],
    basedir: 'assets/js/'
  })
  .transform('babelify')
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('public/js/'));
});

// Static server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("assets/js/*",["build-jsx"]);
});

gulp.task('default', ['serve']);