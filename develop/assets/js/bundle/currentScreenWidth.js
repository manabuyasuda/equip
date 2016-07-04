/**
 現在のスクリーンサイズを返します。
 * @example
 * var currentScreenWidth = isScreenWidth();
 * $(window).on('resize', debounce(function() {
 *   currentScreenWidth = isScreenWidth();
 * }, 200));
 */
function isScreenWidth() {
  return window.innerWidth;
}
