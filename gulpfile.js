var gulp =  require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat');

var coffeeSource = 'components/coffee/*.coffee';

var jsSources = [
  'components/scripts/tagline.js',
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/template.js'
]

var sassSources = ['components/sass/style.scss' ]

// compiles coffee to js
gulp.task('coffee',function(){
  gulp.src(coffeeSource)
    .pipe(coffee({bare:true})
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

// Combines js script
gulp.task('js', function (){
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
});

// Compass for Sass
gulp.task('compass',function(){
  gulp.src(sassSources)
    .pipe(compass({
      sass : "components/sass",
      image : "builds/development/images",
      style : "expanded"
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest('builds/development/css'))
});
// Runs All
gulp.task('default',['coffee','js','compass']);
