"use strict"

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');


//html
gulp.task('html', function() {
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

/* scss */
const sass = require('gulp-sass');

gulp.task('scss', () => {
  return gulp.src(`./scss/main.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`./build/css/`))
    .pipe(connect.reload());
});

//start
gulp.task('signal', function() {
  return gulp.src('./app/**/*.signal')
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

//babel
const babel = require('gulp-babel');
const expect = require('gulp-expect-file');

gulp.task('js', function() {
  return gulp.src('./app/**/*.js') 
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('./build'))
    .pipe(expect('./app/**/*.js'))
		.pipe(connect.reload());
});

//libs js
gulp.task('libs', function() {
  return gulp.src([
    'node_modules/systemjs/dist/system.js',
    'node_modules/babel-polyfill/dist/polyfill.js',
    './app/libs/bootstrap.min.css'])
    .pipe(gulp.dest('./build/libs'))
		.pipe(connect.reload());
});


//build
gulp.task('build', ['js', 'libs', 'html', 'img'], function(){
  return gulp.src('./build/**/*.*') //min img, css, js
    .pipe(gulp.dest('./dist'));
});


//connect server
var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true,
    port: 1111
  });
});

/* fonts */
gulp.task('fonts', () => {
  return gulp.src(`./app/fonts/**/*`)
    .pipe(gulp.dest(`./build/fonts/`))
    .pipe(connect.reload());
});

//watch
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/**/*.js'], ['js']);
  gulp.watch(['./app/**/*.signal'], ['signal']);
  gulp.watch(['./scss/**/*.scss'], ['scss']);
});

//default
gulp.task('default', ['connect', 'html', 'scss', 'fonts', 'js', 'signal', 'libs', 'watch']);