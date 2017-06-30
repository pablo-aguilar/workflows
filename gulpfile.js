
var gulp =  require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    imgmin = require('gulp-imagemin'),
    pngcrush = require('pngcrush'),
    jsonminify = require('gulp-jsonminify'),

    minifyHTML = require('gulp-minify-html'),
    connect = require('gulp-connect');

var env,
    coffeeSource,
    jsSources,
    htmlSources,
    jsonSources,
    sassSources,
    outputDir,
    sassSyle;

if (env === 'development'){
  outputDir = 'builds/development/';
  sassSyle = "expanded";
} else {
  outputDir = 'builds/production/';
  sassSyle = "compressed";

}

env = process.env.NODE_ENV || 'development'

coffeeSource = 'components/coffee/*.coffee';

jsSources = [
  'components/scripts/tagline.js',
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/template.js'
]

htmlSources = [
  outputDir + '*.html'
]

jsonSources = [
  outputDir + 'js/*.json'
]

sassSources = ['components/sass/style.scss' ]

// watch HTML
gulp.task('html', function(){
  gulp.src('builds/development/*.html')
    .pipe(gulpif( env === "production", minifyHTML() ))
    .pipe(gulpif( env === "production", gulp.dest(outputDir) ))
    .pipe(connect.reload())
});

// watch json
gulp.task('json', function(){
  gulp.src('builds/development/js/*.json' )
  .pipe(gulpif( env === "production", jsonminify() ))
  .pipe(gulpif( env === "production", gulp.dest('builds/production/js') ))
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
    .pipe(gulpif(env=== 'production',uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

// Compass for Sass
gulp.task('compass',function(){
  gulp.src(sassSources)
    .pipe(compass({
      sass : "components/sass",
      image : outputDir + 'images',
      style : sassSyle
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

// Live load
gulp.task('connect', function(){
  connect.server({
    root:outputDir,
    livereload: true
  })
});

// images
gulp.task('images', function(){
  gulp.src('builds/development/images/**/*.*')
    .pipe(gulpif(env=== 'production',imgmin({
      progressive:true,
      svgoPlugins: [{ removeVieBox:false }],
      use: [pngcrush()]
    })))
    .pipe(gulpif(env=== 'production',gulp.dest(outputDir + 'images') ))
    .pipe(connect.reload())
});

// Runs on default
gulp.task('default',['html','json','coffee','js','images','compass','connect','watch']);


// Watches for change
gulp.task('watch',function(){
  gulp.watch(coffeeSource, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/js/*.json', ['json']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/images/**/*.*', ['images']);

});
