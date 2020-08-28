/*global $ Swiper*/ 
var app = {   
  swiper: undefined,
  setHash: function(hash){
    window.location.hash=hash;
  },
  getHash: function(){
    return window.location.hash.slice(1);
  },
  createMenu: function(){ 
    var s = this;
    var $e = $('.swiper-wrapper .swiper-slide'); 
    for (var i=0; i<$e.length; i++){ 
      $('#menu ul').append('<li><button class="uk-button uk-button-text uk-button-small uk-text-meta" data-hash="'+$($e[i]).attr('data-hash')+'"><span uk-icon="file-text"></span>Slide '+(i+1)+'</button></li>'); 
    }    
    
    $('#menu ul button').on('click',function(){
      s.setHash($(this).attr('data-hash'));
      $('#btnCloseMenu').trigger('click');
      s.checkActiveSlideInMenu(); 
    });  
    s.checkActiveSlideInMenu();  
  },
  checkActiveSlideInMenu: function (){ 
    var s = this;
    $('#labelActiveMenu').remove();
    var $btn = $('#menu ul button');
    for(var i=0; i<$btn.length; i++){ 
      if($($('#menu ul li button')[i]).attr('data-hash')===s.getHash()){
        $($('#menu ul li button')[i]).prepend('<span id="labelActiveMenu" uk-icon="chevron-right"></span>'); 
        break;
      }
    } 
  },  
  resize: function(){
    $('#app').innerHeight($(window).innerHeight());
  }, 
  exe: function(){  
    var s = this; 
    
     
    s.swiper = new Swiper('.swiper-container', { 
      direction: 'horizontal',
      loop: false,
      hashNavigation: {
        replaceState: true
      },
      effect: 'cube',
      grabCursor: true,
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },      
      keyboard: {
        enabled: true,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
      },  
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      on: {
        slideChangeTransitionEnd: function () { 
          s.checkActiveSlideInMenu();
        },
      }  
    });
    s.createMenu();
    s.swiper.slideTo(0, 100, null); 
    $(window).on('hashchange',function(){ 
      s.swiper.slideTo(parseInt(s.getHash())-1, 100, null);
      s.checkActiveSlideInMenu();
    }); 
    s.resize();
    $(window).on('resize',function(){ 
      s.resize();
    }); 
  }
}
app.exe();
    