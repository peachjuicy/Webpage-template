//initialize modules
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();

// file path vars
const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js',
  htmlPath: './*.html'
}

//sass task to compile scss to css
function scssTask () {
  return gulp.src(files.scssPath)
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('distribution'))
  .pipe(browserSync.stream())
}

// JS task 

function jsTask() {
  return gulp.src(files.jsPath)
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(gulp.dest('distribution'))
  .pipe(browserSync.stream())
}
//cachebusting task
const cbString=new Date().getTime();
function cacheBustTask() {
  return gulp.src(['index.html'])
  .pipe(replace(/cb=\d+/g, 'cb'+cbString))
  .pipe(gulp.dest('.'))
}

// watch task
function watchTask() {
  browserSync.init({
		server: {
      baseDir:"./"
    }
	});
  gulp.watch([files.scssPath, files.jsPath],
    gulp.parallel(scssTask, jsTask));
    gulp.watch(files.htmlPath).on("change", browserSync.reload);

}
//default task

exports.default=gulp.series(
  gulp.parallel(scssTask, jsTask), 
  cacheBustTask,
  watchTask
  );