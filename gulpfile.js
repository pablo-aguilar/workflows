
var gulp =  require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect');

var coffeeSource = 'components/coffee/*.coffee';

var jsSources = [
  'components/scripts/tagline.js',
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/template.js'
]

var htmlSources = [
  'builds/development/*.html'
]

var jsonSources = [
  'builds/development/js/*.json'
]

var sassSources = ['components/sass/style.scss' ]

// watch HTML
gulp.task('html', function(){
  gulp.src(htmlSources )
    .pipe(connect.reload())
});

// watch json
gulp.task('json', function(){
  gulp.src(jsonSources )
    .pipe(connect.reload())
});

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
    .pipe(connect.reload())
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
    .pipe(connect.reload())
});

// Live load
gulp.task('connect', function(){
  connect.server({
    root:'builds/development/',
    livereload: true
  })
});

// Runs on default
gulp.task('default',['html','json','coffee','js','compass','connect','watch']);


// Watches for change
gulp.task('watch',function(){
  gulp.watch(coffeeSource, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['json']);
  gulp.watch('components/sass/*.scss', ['compass']);
});
