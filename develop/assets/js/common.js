/**
 * common.js
 */
$(function() {
  // 共通の変数は`NS`名前空間をスコープにします。
  var NS = NS || {};

  // ブレイクポイントを定数で管理します。
  NS.BREAK_POINT_SM = 400;
  NS.BREAK_POINT_MD = 768;
  NS.BREAK_POINT_LG = 1000;
  NS.BREAK_POINT_XL = 1200;

  // `NS.viewportWidth`に現在のviewportの横幅を格納する。
  NS.viewportWidth = window.innerWidth;
  $(window).on('resize', debounce(function() {
    NS.viewportWidth = window.innerWidth;
  }, 200));

  // 変数`scrollPosition`に現在のスクロール量（位置）を格納する。
  NS.scrollPosition = window.pageYOffset;
  $(window).on('scroll', throttle(function() {
    NS.scrollPosition = window.pageYOffset;
  }, 200));


  /**
   * 表示しているページと同じか、共通の親ディレクトリを持つリンクにクラスを追加します。
   * パスは（`/`で始める）ルート相対パスで記述します。
   * `current`と`$targetLink`は任意のクラス名を指定してください。
   * ナビゲーションにトップページが含まれていない場合は`else`以降を削除します。
   */
  function navCurrentLink() {
    var current = 'is-current';
    var $targetLink = $('.js-nav-current');
    if(location.pathname != '/') {
      $targetLink.find('a[href^="/' + location.pathname.split("/")[1] + '"]').addClass(current);
    } else {
      $targetLink.find('a:eq(0)').addClass(current);
    }
  }
  navCurrentLink();


  /**
   * ページトップへ戻るリンクをアニメーションさせます。。
   */
  function navScrollTop() {
    var $targetClass = $('.js-scroll-top');
    var speed = 500; // アニメーションスピード(ms)
    var animation = 'linear'; // 'linear' or 'swing'
    $targetClass.on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0}, speed, animation);
    });
  }
  navScrollTop();

});
