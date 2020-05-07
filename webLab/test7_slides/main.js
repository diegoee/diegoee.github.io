/*global $*/
var app = {
  idImpress: 'impress',
  impress: undefined,  
  getRndN: function(nstart,nEnd){
    return Math.floor(Math.random()*nEnd)+nstart;
  },
  r: function (){
    return this.getRndN(1,10)+'00';
  },
  createImpressjs: function(){    
    var s = this;
    s.impress = impress(s.idImpress);
    function checkOverview(){    
      $('#startBtn').removeClass('uk-animation-scale-down');
      $('#nextBtn').removeClass('uk-animation-scale-down');
      $('#prevBtn').removeClass('uk-animation-scale-down');  
      if($('#overview').hasClass('active')){
        $('#startBtn').removeClass('noDisplay');
        $('#nextBtn').addClass('noDisplay');
        $('#prevBtn').addClass('noDisplay'); 
        $('.step').each(function(){
          $(this).addClass('viewSlide');
        });
      }else{  
        $('#startBtn').addClass('noDisplay');
        $('#nextBtn').removeClass('noDisplay');
        $('#prevBtn').removeClass('noDisplay');  
        $('.step').each(function(){
          $(this).removeClass('viewSlide'); 
        }); 
      }
    }
    s.impress.init();   
    $('#startBtn').addClass('noDisplay');
    $('#nextBtn').addClass('noDisplay');
    $('#prevBtn').addClass('noDisplay'); 
    $('#startBtn').on('click',function(){          
      s.impress.next(); 
      $(this).addClass('uk-animation-scale-down');      
    }); 
    $('#nextBtn').on('click',function(){
      s.impress.next(); 
      $(this).addClass('uk-animation-scale-down');    
    });         
    $('#prevBtn').on('click',function(){
      s.impress.prev();
      $(this).addClass('uk-animation-scale-down');    
    });
    location.hash='#/overview';
    checkOverview();
    $(window).on('hashchange',function(e){
      checkOverview(); 
    });
  },
  createProgressBar: function(){    
    var s = this;
    var l = $('.step').length;     
    $('#'+s.idImpress).after('<progress id="barProgress" value="0" max="'+(l-1)+'"></progress>');
    $('#'+s.idImpress).after('<div id="status"></div>');
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
    var n = 10; 
    var s = this;
    for (var i=0; i<n; i++){ 
      $('#'+s.idImpress).append($($('.step')[0]).clone().attr('id','slide-'+(i+1)).attr('data-x',this.r()).attr('data-y',this.r()));
    } 
    $($('.step')[0]).remove();   
    $('#'+s.idImpress).prepend('<div id="overview" class="step" data-x='+this.r()+' data-y='+this.r()+' data-z="0" data-scale="3"></div>'); 
    s.createImpressjs(); 
    s.createProgressBar(); 
    s.createMenu();
  }
}
app.exe();
   