var gulp = require('gulp');
// EJS
var ejs = require("gulp-ejs");
// Sass
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var cleanCss = require('gulp-clean-css')
// Image
var imagemin = require('gulp-imagemin');
// Iconfont
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
// Utility
var rimraf = require('rimraf');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var runSequence = require('run-sequence');
// browser-sync
var browserSync = require('browser-sync');
// Styleguide
var hologram = require('gulp-hologram');


/**
 * 開発用のデベロップパス。ディレクトリ名はプロジェクトにあわせて変更します。
 */
var develop = {
  'root': 'develop/',
  'ejs': ['develop/**/*.ejs', '!' + 'develop/**/_*.ejs'],
  'data': 'develop/assets/data/',
  'sass': 'develop/**/*.scss',
  'minifyCss': 'develop/assets/css/*.scss',
  'js': ['develop/**/*.js', '!' + 'develop/assets/js/bundle/**/*.js'],
  'bundleJs': 'develop/assets/js/bundle/**/*.js',
  'image': ['develop/**/*.{png,jpg,gif,svg}', '!' + 'develop/assets/icon/*.svg', '!' + 'develop/assets/font/*.svg'],
  'iconfont': 'develop/assets/icon/*.svg'
}

/**
 * 公開用のリリースパス。ディレクトリ名はプロジェクトにあわせて変更します。
 */
var release = {
  'root': 'release/',
  'html': 'release/',
  'minifyCss': 'release/assets/css/',
  'bundleJs': 'release/assets/js/bundle/',
  'iconfont': 'develop/assets/font/'
}

var AUTOPREFIXER_BROWSERS = [
  // @see https://github.com/ai/browserslist#browsers
  // Major Browsers（主要なブラウザの指定）
  'last 2 version', // （Major Browsersの）最新2バージョン
  // 'Chrome >= 34', // Google Chrome34以上
  // 'Firefox >= 30', // Firefox30以上
  'ie >= 9', // IE9以上
  // 'Edge >= 12', // Edge12以上
  'iOS >= 7', // iOS7以上
  // 'Opera >= 23', // Opera23以上
  // 'Safari >= 7', // Safari7以上

  // Other（Androidなどのマイナーなデバイスの指定）
  'Android >= 4.0' // Android4.0以上
];

/**
 * `.ejs`をコンパイルしてから、リリースディレクトリに出力します。
 */
var fs = require('fs');
gulp.task('ejs', function() {
  return gulp.src(develop.ejs)
  .pipe(ejs({
    site: JSON.parse(fs.readFileSync(develop.data + 'site.json')),
    sample: JSON.parse(fs.readFileSync(develop.data + 'sample.json'))
    },
    {ext: '.html'}
  ))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(gulp.dest(release.html))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * `.scss`をコンパイルしてから、リリースディレクトリに出力します。
 * ベンダープレフィックスを付与後、csscombで整形されます。
 */
gulp.task('sass', function(){
  return gulp.src(develop.sass, {base: develop.root})
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(autoprefixer({
    browsers: AUTOPREFIXER_BROWSERS,
  }))
  .pipe(csscomb())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(release.root))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * `sass`タスクにミニファイとリネームを追加します。
 */
gulp.task('minifyCss', function(){
  return gulp.src(develop.minifyCss)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: AUTOPREFIXER_BROWSERS,
  }))
  .pipe(csscomb())
  .pipe(rename({suffix: '.min'}))
  .pipe(cleanCss())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(release.minifyCss));
});

/**
 * デフォルトjsファイルとjQueryをリリースディレクトリに出力します。
 */
gulp.task('js', function() {
  return gulp.src(develop.js, {base: develop.root})
  .pipe(gulp.dest(release.root))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * デベロップディレクトリにあるjQueryプラグインなどのファイルを連結してリリースディレクトリに出力します。
 */
gulp.task('bundleJs', function() {
  return gulp.src(develop.bundleJs)
  .pipe(sourcemaps.init())
  .pipe(concat('bundle.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(release.bundleJs))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * デベロップディレクトリの画像を圧縮、
 * 階層構造を維持したまま、リリースディレクトリに出力します。
 */
gulp.task('image', function() {
  return gulp.src(develop.image)
  .pipe(imagemin({
    // jpgをロスレス圧縮（画質を落とさず、メタデータを削除）。
    progressive: true,
    // gifをインターレースgifにします。
    interlaced: true,
    // PNGファイルの圧縮率（7が最高）を指定します。
    optimizationLevel: 7
  }))
  .pipe(gulp.dest(release.root))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * アイコンフォントを作成します。
 * 開発用ディレクトリのiconディレクトリ内にSVGファイルを保存すると、
 * assets/fontディレクトリにフォントファイルが、
 * assets/css/object/projectディレクトリに専用のscssファイルが生成されます。
 * フォントファイルはリリースディレクトリにコピーされます。
 */
gulp.task('createIconfont', function(){
  var fontName = 'iconfont';
  return gulp.src(develop.iconfont)
    .pipe(iconfontCss({
      fontName: fontName, // 生成されるフォントの名前（iconfontと同じにするため変数化）
      path: 'develop/assets/icon/template/_icon.scss',  // アイコンフォント用CSSのテンプレートファイル
      targetPath: '../css/object/project/_icon.scss',  // scssファイルを出力するパス（gulp.destの出力先からみた相対パス）
      fontPath: '../font/' // 最終的に出力されるCSSからみた、フォントファイルまでの相対パス
    }))
    .pipe(iconfont({
      fontName: fontName,
      formats: ['ttf', 'eot', 'woff', 'svg'], // 出力するフォントファイルの形式
      // startUnicode: 0xF001,
      // appendCodepoints: false
      // normalize: true,
      // fontHeight: 500
    }))
    .pipe(gulp.dest(release.iconfont));
});

gulp.task('copyIconfont', function() {
  return gulp.src('develop/assets/font/*.{woff,eot,svg,ttf}')
    .pipe(gulp.dest('release/assets/font/'));
});

gulp.task('iconfont', function() {
  runSequence(
    'createIconfont',
    'copyIconfont'
  )
});


/**
 * Hologramでスタイルガイドを生成します。
 * 設定はhologram_config.ymlに記述しています。
 */
gulp.task('styleguide', function() {
  gulp.src('hologram/hologram_config.yml')
  .pipe(hologram({bundler:true}));
});

/**
 * リリースディレクトリを削除します。
 */
gulp.task('clean', function (cb) {
  rimraf(release.root, cb);
});

/**
 * 一連のタスクを処理します（画像の圧縮は`release`タスクでおこないます）。
 */
gulp.task('build', ['ejs', 'sass', 'js', 'bundleJs', 'image', 'iconfont']);

/**
 * watchタスクを指定します。
 */
gulp.task('watch', ['build'],function() {
  gulp.watch(develop.ejs, ['ejs']);
  gulp.watch(develop.sass, ['sass']);
  gulp.watch(develop.js, ['js']);
  gulp.watch(develop.bundleJs, ['bundleJs']);
  gulp.watch(develop.image, ['image']);
  gulp.watch(develop.iconfont, ['iconfont']);
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
 * `gulp`タスクにbrowser-syncを追加します。
 * ローカルサーバーを起動し、リアルタイムに更新を反映させます。
 */
gulp.task('default', ['clean'], function() {
  runSequence(
    'watch',
    'browser-sync'
  )
});

/**
 * リリースに使用するタスクです。
 * リリースディレクトリを最新の状態にしてから、ファイルの圧縮をします。
 */
gulp.task('release', ['clean'], function() {
  runSequence(
    ['ejs', 'sass', 'minifyCss', 'js', 'bundleJs', 'image', 'iconfont']
  )
});
