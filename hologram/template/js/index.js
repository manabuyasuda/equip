$(function() {
  // スムーススクロール
  $('a[href*="#"]').on('click', function(e) {
    $offset = $('.hgt-pagehead').outerHeight();
    $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top -$offset}, 500, 'linear');
    e.preventDefault();
  });
});