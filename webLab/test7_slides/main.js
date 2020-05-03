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
    s.impress = impress('app');
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
    $('#app').after('<progress id="barProgress" value="0" max="'+(l-1)+'"></progress>');
    $('#app').after('<div id="status"></div>');
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
    $('#app').after('<span class="btn btnNext" id="btnNext" uk-icon="chevron-right"></span>'); 
    $('#app').after('<span class="btn btnPrev" id="btnPrev" uk-icon="chevron-left"></span>');   
    
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
  exe: function(){   
    var s = this; 
    var nStep = 10;
    $('#app').attr('data-transition-duration','500'); 
    $('#app').attr('data-scale','1');  
    $('#app').append('<div id="overview" class="step" data-x="500" data-y="500" data-z="0" data-scale="3"></div>');
    var $e = $('#template1').clone(); 
    $e.attr('id',null).addClass('step slide'); 
    $('#template1').remove();     
    for (var i=0; i<nStep; i++){ 
      $('#app').append($e.clone().attr('data-x',s.r()).attr('data-y',s.r()));
    } 
    s.createImpressjs(); 
    s.createProgressBar(); 
    s.createMenu(); 
    s.createMoveBtn(); 
  }
}
app.exe();
   