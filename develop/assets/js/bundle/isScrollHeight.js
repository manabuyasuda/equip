/**
 * 現在のページトップからのスクロール量を返します。
 * @example
 * var currentScrollHeight = isScrollHeight();
 * $(window).on('scroll', throttle(function() {
 *   currentScrollHeight = isScrollHeight();
 * }, 200));
 */
function isScrollHeight() {
  return window.pageYOffset;
}
