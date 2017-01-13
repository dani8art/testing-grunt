var gulp = require('gulp');
var jsminify = require('js-minify');
var license = require('gulp-header-license');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('myTask', function () {
    gulp.src('app/*.js')
        .pipe(jsminify())
        .pipe(gulp.dest('build'));
});

gulp.task('license', function () {
    var year = (new Date()).getFullYear();
    gulp.src('./app/*.js')
        .pipe(license('//Copyright (c) ${year}, B3log.org', {
            year: year
        }))
        .pipe(gulp.dest('build'));
});
