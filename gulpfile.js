'use strict';

var fs = require('fs');
var gulp = require('gulp');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var rename = require('gulp-rename');
var del = require('del');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
  '/*!\n' +
  ' * <%= pkg.name %>\n' +
  ' * <%= pkg.homepage %>\n' +
  ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
  ' * License: <%= pkg.license %>\n' +
  ' */\n\n\n'
};

gulp.task('default', ['build','test']);
gulp.task('build', ['scripts']);
gulp.task('test', ['build', 'karma']);

gulp.task('watch', ['build','karma-watch'], function() {
  gulp.watch(['src/**/*.{js,html}'], ['build']);
});

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src(['src/itvalidate.js'])
    .pipe(plumber({
      errorHandler: handleError
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe(gulp.dest('dist'))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(rename({ext:'.min.js'}))
    .pipe(gulp.dest('dist'));

});

gulp.task('karma', ['build'], function() {
  karma.start({configFile : __dirname +'/karma.conf.js', singleRun: true});
});

gulp.task('karma-watch', ['build'], function() {
  karma.start({configFile :  __dirname +'/karma.conf.js', singleRun: false});
});

function handleError(err) {
  console.log(err.toString());
  /*jshint validthis:true */
  this.emit('end');
}
