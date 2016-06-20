/**
 * Index.js
 */
$(function() {

  /**
   * 表示しているページと同じか、共通の親ディレクトリを持つリンクにクラスを追加します。
   * パスは（`/`で始める）ルート相対パスで記述します。
   * `current`と`$targetLink`は任意のクラス名を指定してください。
   */
  function navCurrentPage() {
    var current = 'is-current';
    var $targetLink = $('.p-gnav');
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
  function jsScrollTop() {
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
  jsScrollTop();



});
