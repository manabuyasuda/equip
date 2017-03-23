var gulp = require('gulp');

// EJS
var ejs = require("gulp-ejs");
var fs = require('fs');

// Sass
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var cleanCss = require('gulp-clean-css')
var sassGlob = require('gulp-sass-glob');

// Image
var imagemin = require('gulp-imagemin');

// Iconfont
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

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
var aigis = require('gulp-aigis');


/**
 * 開発用のパス。ディレクトリ名はプロジェクトにあわせて変更します。
 */
var develop = {
  'root': 'develop/',
  'html': ['develop/**/*.ejs', '!develop/**/_*.ejs'],
  'htmlWatch': ['develop/**/*.ejs', 'develop/assets/data/**/*.json'],
  'data': 'develop/assets/data/',
  'css': 'develop/**/*.scss',
  'minifyCss': 'develop/assets/css/*.scss',
  'js': ['develop/**/*.js', '!develop/assets/js/bundle/**/*.js'],
  'bundleJs': 'develop/assets/js/bundle/**/*.js',
  'image': ['develop/**/*.{png,jpg,gif,svg}', '!develop/assets/icon/*.svg', '!develop/assets/font/*.svg'],
  'iconfont': 'develop/assets/icon/**/*.svg'
};

/**
 * テスト用のパス。
 */
var test = {
  'root': 'test/',
  'html': 'test/',
  'minifyCss': 'test/assets/css/',
  'bundleJs': 'test/assets/js/bundle/',
  'iconfont': 'test/assets/font/'
};

/**
 * 本番公開用ファイルを出力するパス。
 */
var htdocs = {
  'root': 'htdocs/'
};

var AUTOPREFIXER_BROWSERS = [
  // @see https://github.com/ai/browserslist#browsers
  // Major Browsers（主要なブラウザの指定）
  'last 2 version', // （Major Browsersの）最新2バージョン
  // 'Chrome >= 34', // Google Chrome34以上
  // 'Firefox >= 30', // Firefox30以上
  'ie >= 9', // IE9以上
  // 'Edge >= 12', // Edge12以上
  'iOS >= 8', // iOS8以上
  // 'Opera >= 23', // Opera23以上
  // 'Safari >= 7', // Safari7以上

  // Other（Androidなどのマイナーなデバイスの指定）
  'Android >= 4.4' // Android4.4以上
];

/**
 * `.ejs`を`.html`にコンパイルします。
 */
gulp.task('html', function() {
  return gulp.src(develop.html)
  .pipe(ejs({
    site: JSON.parse(fs.readFileSync(develop.data + 'site.json')),
    developDir: develop.root
    },
    {ext: '.html'}
  ))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(gulp.dest(test.root))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * `.scss`をコンパイルしてから、リリースディレクトリに出力します。
 * ベンダープレフィックスを付与後、csscombで整形されます。
 */
gulp.task('css', function(){
  return gulp.src(develop.css, {base: develop.root})
  .pipe(sassGlob())
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(autoprefixer({
    browsers: AUTOPREFIXER_BROWSERS,
  }))
  .pipe(csscomb())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(test.root))
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
  .pipe(gulp.dest(test.minifyCss));
});

/**
 * デフォルトjsファイルとjQueryをリリースディレクトリに出力します。
 */
gulp.task('js', function() {
  return gulp.src(develop.js, {base: develop.root})
  .pipe(gulp.dest(test.root))
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
  .pipe(gulp.dest(test.bundleJs))
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
  .pipe(gulp.dest(test.root))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * アイコンフォントを作成します。
 * 開発用ディレクトリのiconディレクトリ内にSVGファイルを保存すると、
 * assets/fontディレクトリにフォントファイルが、
 * assets/css/object/projectディレクトリに専用のscssファイルが生成されます。
 * フォントファイルはリリースディレクトリにコピーされます。
 */
gulp.task('iconfont', function() {
  // シンボルフォント名を指定します。
  var fontName = 'iconfont';
  return gulp.src(develop.iconfont)
  .pipe(iconfont({
    fontName: fontName,
    formats: ['ttf', 'eot', 'woff', 'svg'],
    // SVGファイル名にUnicodeを付与します（recommended option）。
    prependUnicode: false
  }))
  .on('glyphs', function(codepoints, opt) {
    var options = {
      glyphs: codepoints,
      fontName: fontName,
      // CSSファイルからfontファイルまでの相対パスを指定します。
      fontPath: '../font/',
      // CSSのクラス名を指定します。
      className: 'sw-Icon'
    };
    // CSSのテンプレートからCSSファイルを生成します。
    gulp.src('develop/assets/icon/template/_Icon.scss')
    .pipe(consolidate('lodash', options))
    .pipe(gulp.dest('develop/assets/css/SiteWide/'));
    // アイコンフォントのサンプルHTMLを生成します。
    gulp.src('develop/assets/icon/template/Icon.html')
    .pipe(consolidate('lodash', options))
    // アイコンフォントのサンプルHTMLを生成するパスを指定します。
    .pipe(gulp.dest('test/styleguide/'))
  })
  // fontファイルを出力するパスを指定します。
  .pipe(gulp.dest(test.iconfont));
});

/**
 * スタイルガイドを生成します。
 */
gulp.task('styleguide', function() {
  return gulp.src('./aigis/aigis_config.yml')
    .pipe(aigis());
});

/**
 * リリースディレクトリを削除します。
 */
gulp.task('cleanTest', function (cb) {
  rimraf(test.root, cb);
});

/**
 * リリースディレクトリを削除します。
 */
gulp.task('cleanHtdocs', function (cb) {
  rimraf(htdocs.root, cb);
});

/**
 * 一連のタスクを処理します（画像の圧縮は`test`タスクでおこないます）。
 */
gulp.task('build', ['iconfont', 'html', 'css', 'js', 'bundleJs', 'image', 'styleguide']);

/**
 * watchタスクを指定します。
 */
gulp.task('watch', ['build'],function() {
  gulp.watch(develop.htmlWatch, ['html']);
  gulp.watch(develop.css, ['css']);
  gulp.watch(develop.js, ['js']);
  gulp.watch(develop.bundleJs, ['bundleJs']);
  gulp.watch(develop.image, ['image']);
  gulp.watch(develop.iconfont, ['iconfont']);
  gulp.watch(develop.css, ['styleguide']);
});

/**
 * ローカルサーバーを起動します。
 */
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: test.root,
      index: "index.html"
    }
  });
});

/**
 * 開発に使用するタスクです。
 * `gulp`タスクにbrowser-syncを追加します。
 * ローカルサーバーを起動し、リアルタイムに更新を反映させます。
 */
gulp.task('default', ['cleanTest'], function() {
  runSequence(
    'watch',
    'browser-sync'
  )
});

/**
 * リリースに使用するタスクです。
 * リリースディレクトリを最新の状態にしてから、ファイルの圧縮をします。
 */
gulp.task('htdocs', ['cleanHtdocs'], function() {
  return gulp.src(test.root + '**/*')
  .pipe(gulp.dest(htdocs.root));
});
