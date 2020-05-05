/*global $*/
var app = {
  impress: undefined,  
  getRndN: function(nstart,nEnd){
    return Math.floor(Math.random()*nEnd)+nstart;
  },
  r: function (){
    return this.getRndN(1,10)+'00';
  },
  createImpressjs: function(){    
    var s = this;
    s.impress = impress();
    function checkOverview(){
      if($('#overview').hasClass('active')){
        $('.step').each(function(){
          $(this).addClass('viewSlide');
        });
      }else{        
        $('.step').each(function(){
          $(this).removeClass('viewSlide'); 
        });
      }
    }
    s.impress.init();     
    location.hash='#/overview';
    checkOverview();
    $(window).on('hashchange',function(e){
      checkOverview(); 
    });
  },
  createProgressBar: function(){    
    var s = this;
    var l = $('.step').length;     
    $('#impress').after('<progress id="barProgress" value="0" max="'+(l-1)+'"></progress>');
    $('#impress').after('<div id="status"></div>');
    function checkStepN(){ 
      for (var i=0; i<l; i++){
        if($($('.step')[i]).hasClass('active')){ 
          $('#barProgress').val(i);
          $('#status').html((i)+' of '+(l-1));
          break;
        }
      } 
    }
    checkStepN();     
    $(window).on('hashchange',function(e){
      checkStepN();  
    });  
  },
  createMoveBtn: function(){ 
    var s = this;  
    $('#impress').after('<span class="btn btnNext" id="btnNext" uk-icon="chevron-right"></span>'); 
    $('#impress').after('<span class="btn btnPrev" id="btnPrev" uk-icon="chevron-left"></span>');   
    
    $('#btnNext').on('click',function(){
      s.impress.next(); 
      $('.step').each(function(){
        $(this).removeClass('viewSlide'); 
      });
    });         
    $('#btnPrev').on('click',function(){
      s.impress.prev(); 
      $('.step').each(function(){
        $(this).removeClass('viewSlide'); 
      });
    });   
  },
  createMenu: function(){ 
    var s = this;
    $('#menu div').append('<h1 class="uk-heading-divider">Menu</h1>');
    $('#menu div').append('<ul class="uk-list uk-list-divider"></ul>');   
    var l = $('.step').length;  
    for (var i=0; i<l; i++){
      var icon = '';
      if($($('.step')[i]).attr('id')==='overview'){  
        icon = 'home';
      } else {
        icon = 'file-text';
      }
      $('#menu ul').append('<li><button go-id="'+$($('.step')[i]).attr('id')+'" class="uk-button uk-button-text uk-button-small uk-text-meta"><span uk-icon="'+icon+'"></span> '+$($('.step')[i]).attr('id')+'</button></li>');
    } 
    $('#menu ul button').on('click',function(){
      var id = $(this).attr('go-id');
      $('#btnCloseMenu').trigger('click');
      s.impress.goto(id);
    });   
    
    function checkActiveSlide(){
      $('#labelActiveMenu').remove();
      var label = ' <span id="labelActiveMenu" uk-icon="chevron-right"></span>'; 
      for (var i=0; i<l; i++){ 
        if($($('.step')[i]).hasClass('active')){  
          $($('#menu ul li')[i]).prepend(label);
          break;
        }
      } 
    }
    checkActiveSlide();
    $(window).on('hashchange',function(e){
      checkActiveSlide(); 
    });  
  },
  isTouchEvent: function (){      
    if ("ontouchstart" in document.documentElement) { 
      return true;
    }else{
      return false;
    }
  },
  exe: function(){       
    for (var i=0; i<$('.step').length; i++){ 
      $($('.step')[i]).attr('data-x',this.r()).attr('data-y',this.r());
    } 
    this.createImpressjs(); 
    this.createProgressBar(); 
    this.createMenu(); 
    if(!this.isTouchEvent()){
      this.createMoveBtn();   
    } 
  }
}
app.exe();
   