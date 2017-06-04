'use strict';

var browserSync = require('browser-sync').create();
var babelify = require("babelify");
var browserify = require('browserify');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

gulp.task('sass', function() {
  return gulp.src('scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  var b = browserify({
    entries: 'js/index.js',
    debug: true
  });

  return b.transform(babelify, {presets: ['es2015']})
    .bundle()
    .on('error', function(error) {
      console.error(error.toString());
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('default', ['sass', 'js'], function() {
  browserSync.init({
    host: process.env.IP,
    port: process.env.PORT || 3000,
    server: '.'
  });

  gulp.watch('index.html').on('change', browserSync.reload);
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('js/*.js', ['js']);
});
