/*global $*/
var app = {
  impress: undefined,  
  getRndN: function(nstart,nEnd){
    return Math.floor(Math.random()*nEnd)+nstart;
  },
  r: function (){
    return this.getRndN(1,10)+'000';
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
    $('#app').after('<progress id="barProgress" value="0" max="'+l+'"></progress>');
    $('#app').after('<div id="status"></div>');
    function checkStepN(){ 
      for (var i=0; i<l; i++){
        if($($('.step')[i]).hasClass('active')){ 
          $('#barProgress').val(i);
          $('#status').html((i+1)+' of '+l);
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
    $('#app').after('<a class="btn btnNext" id="btnNext">></a>'); 
    $('#app').after('<a class="btn btnPrev" id="btnPrev"><</a>');        
    $('#btnNext').on('click',function(){
      s.impress.next();
    });         
    $('#btnPrev').on('click',function(){
      s.impress.prev(); 
    });   
  },
  exe: function(){   
    var s = this;
    var nStep = 5;
    $('#app').attr('data-transition-duration','500'); 
    $('#app').attr('data-scale','1');  
    $('#app').append('<div id="overview" class="step" data-x="5000" data-y="5000" data-z="0" data-scale="25"></div>');
    var $e = $('#template1').clone(); 
    $e.attr('id',null).addClass('step slide'); 
    $('#template1').remove();     
    for (var i=0; i<nStep; i++){ 
      $('#app').append($e.clone().attr('data-x',s.r()).attr('data-y',s.r()).attr('data-z',s.r()));
    } 
    s.createImpressjs(); 
    s.createProgressBar(); 
    s.createMoveBtn(); 
  }
}
app.exe();
   