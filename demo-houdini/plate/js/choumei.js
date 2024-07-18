browserRedirect() 
//判断浏览器
function browserRedirect() { //判断在移动端还是pc端
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    //在移动端
    $('.swiper-slide').height($('.swiper-lazy').height()+50)
    $('.wrapper').addClass('phone');
    var _winHeight = document.documentElement.clientHeight;
    if(_winHeight>720 ){
      //alert(_winHeight)
      $('.swiper-container').css('top','10%');
      $('.tops').css('padding-top','4%');
      $('.footer').css('marginTop','5%');
      $('.tops').css('marginBottom','2.5rem');
      $('.share,.index').css('width','14.4%');
      $('.logo1').css('width','23.46%'); 
    }
    if(_winHeight<720){
      $('.tops').css('padding-top','2%');
      $('.swiper-container').css('top','12%');
      $('.footer').css('margin-top','-1%');
      $('.swiper-slide img').css('width','100%');
    }  
  }else {
    $('.wrapper').addClass('pc');
    $('.swiper-slide').height($('.swiper-lazy').height()+50);
  }
} 
$('.srjt .sdt img').click(function(){
    $('.sytop').addClass('hide')
})

$('.share').click(function(){
  $('.mask').removeClass('animated fadeOut')
  $('.sharemask,.mask').removeClass('hide')
})  ;
$('.sharemask,.mask').click(function(){
  $('.sharemask,.mask').addClass('hide')
})  ;  
var swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,

  centeredSlides: true,
  loop: false,
  direction: "vertical",
  
  effect: "creative",
      creativeEffect: {
        prev: {
          shadow: true,
          translate: [0, -400, 0],
        },
        next: {
          translate: ["100%", 0, 0],
        },
      },
  on:{
    init:function(swiper){
          slide=this.slides.eq(0);
          
        
      },
      slideChangeTransitionStart: function(){
        
        if(this.activeIndex==4){
         
          // this.slides.eq(0).addClass('btjdf')
        }
        //alert(this.activeIndex);
      // if(this.activeIndex-1>this.activeIndex){
      //   var slide=this.slides.eq(this.activeIndex)
      //   slide.addClass('btjdf');
      // }
      },
      transitionStart: function(){
        // if(this.activeIndex-1>this.activeIndex){
        //   var slide=this.slides.eq(this.activeIndex)
        //   slide.addClass('btjdf');
        // }
        //  var slide=this.slides.eq(this.activeIndex)
        //  slide.addClass('btjdf');
       
      },
      transitionEnd: function(){

        // slide=this.slides.eq(this.activeIndex);
        //   slide.removeClass('btjdf');
        
    },
  },
 
});

// var swiper = new Swiper(".swiper-container", {
//   direction: "vertical",
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//   },
// });
  