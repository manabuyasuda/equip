/**
 * 現在のページトップからのスクロール量を返します。
 * @example
 * var currentScrollHeight = isScrollHeight();
 * $(window).on('scroll', throttle(function() {
 *   currentScrollHeight = isScrollHeight();
 * }, 200));
 */
// var currentScrollHeight;
function isScrollHeight() {
  return window.pageYOffset;
}
