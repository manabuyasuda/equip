var gulp = require('gulp');
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var ejs = require("gulp-ejs");

var develop = {
  'ejs': ['develop/**/*.ejs', '!' + 'develop/_*.ejs'],
  'sass': 'develop/sass/**/*.scss',
  'js': 'develop/js/**/*.js',
  'image': 'develop/image/*'
}

/**
 * コンパイル後に出力するパス。
 */
var release = {
  'root': 'release/',
  'html': 'release/',
  'css': 'release/css/',
  'js': 'release/js/',
  'image': 'release/image/'
}


var fs = require('fs');
var json = JSON.parse(fs.readFileSync("site.json"));
gulp.task('ejs', function() {
  // 参照するパス。
  gulp.src(develop.ejs)
  // jsonファイルを渡して、吐き出すファイルの拡張子を.htmlに変更する。
  .pipe(ejs(json, {"ext": ".html"}))
  .pipe(gulp.dest(release.html));
});