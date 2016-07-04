/**
 * Index.js
 */
$(function() {

  var BREAK_POINT_SM = 400;
  var BREAK_POINT_MD = 768;
  var BREAK_POINT_LG = 1000;
  var BREAK_POINT_XL = 1200;

  // 変数`currentScreenWidth`に現在のスクリーンサイズ（横幅）を格納する。
  var currentScreenWidth = isScreenWidth();
  $(window).on('resize', debounce(function() {
    currentScreenWidth = isScreenWidth();
  }, 200));

  // 変数`currentScrollHeight`に現在のスクロール量を格納する。
  var currentScrollHeight = isScrollHeight();
  $(window).on('scroll', throttle(function() {
    currentScrollHeight = isScrollHeight();
  }, 200));


  /**
   * 表示しているページと同じか、共通の親ディレクトリを持つリンクにクラスを追加します。
   * パスは（`/`で始める）ルート相対パスで記述します。
   * `current`と`$targetLink`は任意のクラス名を指定してください。
   */
  function navCurrentPage() {
    var current = 'is-current';
    var $targetLink = $('.p-global-nav');
    if(location.pathname != '/') {
      $targetLink.find('a[href^="/' + location.pathname.split("/")[1] + '"]').addClass(current);
    } else {
      $targetLink.find('a:eq(0)').addClass(current);
    }
  }
  navCurrentPage();


  /**
   *
   * ページトップへ戻るリンクです。固定表示しているナビゲーションがある場合は、
   * `offsetHeight`で要素の高さを取得して、`offset`に渡してください。
   */
  function scrollTop() {
    var $targetClass = $('.js-scroll-top');
    var speed = 500;
    var animation = 'linear';
    // オフセット位置の取得
    // var offsetHeight = $('.foo').outerHeight();
    var offset = 0;
    $targetClass.on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: offset}, speed, animation);
    });
  }
  scrollTop();

});
