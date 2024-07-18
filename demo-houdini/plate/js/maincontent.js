/**
 *
 * @authors cysdz (caiys@ycwb.com.cn)
 * @date    2023-10-24
 * @version $Id$
 */
 var swiper;
 var csft="";
 $(function() {
     var _winWidth = document.documentElement.clientWidth;
     var _winHeight = document.documentElement.clientHeight;
     browserRedirect();
     // 点击跳转到说明页
    //  $(document).on('click','.part1content>div', function(event) {
    //    var cs= $(this).index();
    //    var imgsrc='';
    //    if(cs==3){
    //     $('.sfimg').removeClass('hide');
    //     $('.sfimg img').remove();
    //     imgsrc= $('.imgpart3 .imgp2 img').attr("src")
    //     $('.sfimg').append('<img src="'+imgsrc+'">');
    //    }else{
    //     $(this).find('.p2').attr("src");
    //     $('.sfimg').removeClass('hide');
    //     imgsrc =$(this).find('.p2').attr('src')
    //     $('.sfimg img').remove();
    //     $('.sfimg').append('<img src="'+imgsrc+'">');
    //    }
    //  });
     $(document).on('click','.sfimg', function(event) {
        $('.sfimg').addClass('hide');
      });
      $(document).on('click','.imhsdfj', function(event) { 
        $('.sfimg').removeClass('hide');
        $('.sfimg img').remove();
        imgsrcc= $(this).find('img').attr("src")
        $('.sfimg').append('<img src="'+imgsrcc+'">');
      });
      var swiper = new Swiper(".mySwiper", {
        slidesPerView: "auto",
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
      //jsjdjjsd
      
      var sdsr=$('.sht').eq(0).find('.sdhtpjt').height()+40;
     
        $('.sht').eq(0).find('.prat2content').height(sdsr)
      $(document).on('click','.sht .btnq1,.sht .sjx1', function(event) {
        $('#container').addClass('ctnse')
        var sdr=$(this).parent().find('.sdhtpjt').height();
        //alert(sdr)
        $(this).parent().find('.prat2content').height(sdr+50);
          $(this).parent().siblings().find('.sjx1').removeClass('jsx2');
        
          var indexx=$(this).parent().index();
          $(this).parent().siblings().find('.sjx1').removeClass('jsx2');
          $(this).parent().find('.sjx1').toggleClass('jsx2');
          $(this).parent().siblings().find('.prat2content').removeClass('show');
          $(this).parent().find('.prat2content').toggleClass('show');
        
      });
      $(document).on('click','.part3_1content', function(event) {
        $(this).find('.sjxcf').toggleClass('jtx');
        $(this).find('.imgscpatt').toggle();
        $(this).parent().find('.tpart3').toggleClass('show');
      });
      $(document).on('click','.part4_1content', function(event) {
        $(this).find('.sjxcf').toggleClass('jtx');
        $(this).find('.imgscpatt').toggle();
        $(this).parent().find('.tpart4').toggleClass('show');
      });
      $(document).on('click','.part5_1content', function(event) {
        $(this).find('.sjxcf').toggleClass('jtx');
        $(this).find('.imgscpatt').toggle();
        $(this).parent().find('.part5gt').toggleClass('show');
      });
      // $(document).on('click','.ldjt', function(event) {
      //   $(this).parent().find('.imgscpatt').show();
      //   $(this).parent().parent().find('.tpart3').removeClass('show');
      // });
      $(document).on('click','.part6top', function(event) {
      
     });
      $(document).on('click','.part7top', function(event) {
        alert('二级页面建设中……')
      });
 })

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
        $(document).on('click','.prat2content>.gzlfz1,.prat2content>.gzlfz2,.prat2content>.gzlfz3', function(event) {
          csft= $(this).find('img').attr('src');
         
          $('.sfimg').removeClass('hide');
          $('.sfimg img').remove();
          $('.sfimg').append('<img src="'+csft+'">');
        });
         //在移动端
     } else {
        $(document).on('click','.prat2content>.gzlfz1,.prat2content>.gzlfz2,.prat2content>.gzlfz3', function(event) {
          csft= $(this).find('img').attr('src');
          $('.sfimg').removeClass('hide');
          $('.sfimg img').remove();
          $('.sfimg').append('<img src="'+csft+'">');
          $('.sfimg img').addClass('unimg')
        });
     }
 }