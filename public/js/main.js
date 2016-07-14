$(function(){

  // Initialize materialScrollTop
  $.material.init();
  $('body').materialScrollTop();

  $("a[href*=#]").click(function(e) {
    e.preventDefault();
  });  
  
});