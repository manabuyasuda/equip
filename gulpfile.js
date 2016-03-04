var gulp = require('gulp');
var ejs = require("gulp-ejs");
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var cleanCss = require('gulp-clean-css')
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var rimraf = require('rimraf');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

/**
 * 開発中のソースパス。
 */
var develop = {
  'ejs': ['develop/**/*.ejs', '!' + 'develop/**/_*.ejs'],
  'json': 'develop/assets/resources/site.json',
  'sass': 'develop/assets/sass/**/*.scss',
  'js': 'develop/assets/js/*.js',
  'vendor': 'develop/assets/js/vendor/**/*.js',
  'image': 'develop/assets/images/**/*.{png,jpg,gif,svg}'
}

/**
 * リリースパス。ディレクトリ名はプロジェクトにあわせて変更します。
 */
var release = {
  'root': 'release/',
  'html': 'release/',
  'css': 'release/css/',
  'js': 'release/js/',
  'vendor': 'release/js/vendor/',
  'image': 'release/images/'
}

/**
 * `.ejs`を`.html`にコンパイルしてから、リリースディレクトリに出力します。
 */
var fs = require('fs');
var json = JSON.parse(fs.readFileSync(develop.json));
gulp.task('ejs', function() {
  return gulp.src(develop.ejs)
    // jsonファイルを渡して、吐き出すファイルの拡張子を.htmlに変更する。
    .pipe(ejs(json, {"ext": ".html"}))
    .pipe(gulp.dest(release.html));
});

/**
 * `.scss`を`.css`にコンパイルしてから、リリースディレクトリに出力します。
 * ベンダープレフィックスを付与後、csscombで整形されます。
 */
gulp.task('sass', function(){
  return gulp.src(develop.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
    }))
    .pipe(csscomb())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(release.css));
});

/**
 * sassタスクにミニファイとリネームを追加します。
 */
gulp.task('cleanCss', function(){
  return gulp.src(develop.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
    }))
    .pipe(csscomb())
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(release.css));
});

/**
 * デフォルトjsファイルとjQueryをリリースディレクトリに出力します。
 */
gulp.task('js', function() {
  return gulp.src(develop.js)
    .pipe(gulp.dest(release.js));
});

/**
 * vendorディレクトリにあるjQueryプラグインなどのファイルを連結してリリースディレクトリに出力します。
 */
gulp.task('vendor', function() {
  return gulp.src(develop.vendor)
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(release.vendor));
});

/**
 * 画像ファイルをリリースディレクトリに出力します。
 */
gulp.task('image', function() {
  return gulp.src(develop.image)
    .pipe(gulp.dest(release.image));
});

/**
 * imageタスクに画像ファイルの圧縮を追加します。
 */
gulp.task('imagemin', function() {
  return gulp.src(develop.image)
    .pipe(imagemin({
      // jpgをロスレス圧縮（画質を落とさず、メタデータを削除）。
      progressive: true,
      // gifをインターレースgifにします。
      interlaced: true,
      // PNGファイルの圧縮率（7が最高）を指定します。
      optimizationLevel: 7
    }))
    .pipe(gulp.dest(release.image));
});

/**
 * releaseディレクトリを削除します。
 */
gulp.task('clean', function (cb) {
  rimraf(release.root, cb);
});

/**
 * 一連のタスクを処理します（画像の圧縮はreleaseタスクでおこないます）。
 */
gulp.task('build', ['ejs', 'sass', 'js', 'vendor', 'image']);

/**
 * watchタスクを指定します。
 */
gulp.task('watch', ['build'],function() {
  gulp.watch(develop.ejs, ['ejs']);
  gulp.watch(develop.sass, ['sass']);
  gulp.watch(develop.js, ['js']);
  gulp.watch(develop.vendor, ['vendor']);
  gulp.watch(develop.image, ['image']);
});

/**
 * ローカルサーバーを起動します。
 */
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: release.root,
      index: "index.html"
    }
  });
});

/**
 * 開発に使用するタスクです。
 * releaseディレクトリを削除後、watchタスクを処理します。
 */
gulp.task('default', ['clean'], function() {
  runSequence(
    'watch'
  )
});

/**
 * 開発に使用するタスクです。
 * gulpタスクにbrowser-syncを追加します。
 * ローカルサーバーを起動し、リアルタイムに更新を反映させます。
 */
gulp.task('develop', ['clean'], function() {
  runSequence(
    'watch',
    'browser-sync'
  )
});

/**
 * リリースに使用するタスクです。
 * releaseディレクトリを最新の状態にしてから、ファイルの圧縮をします。
 */
gulp.task('release', ['clean'], function() {
  runSequence(
    ['ejs', 'sass', 'cleanCss', 'js', 'vendor','imagemin']
  )
});