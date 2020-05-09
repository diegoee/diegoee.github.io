/*global $*/
var app = {
  idImpress: 'impress',
  impress: undefined,  
  getRndN: function(nstart,nEnd){
    return Math.floor(Math.random()*nEnd)+nstart;
  },
  createImpressjs: function(){    
    var s = this;
    s.impress = impress(s.idImpress);
    function checkOverview(){    
      $('#startBtn').removeClass('uk-animation-scale-down');
      $('#nextBtn').removeClass('uk-animation-scale-down');
      $('#prevBtn').removeClass('uk-animation-scale-down');      
      $('#overview').attr('data-rotate-x',0);
      $('#overview').attr('data-rotate-y',0);

      if($('#overview').hasClass('active')){
        $('#startBtn').addClass('noDisplay');
        $('#nextBtn').addClass('noDisplay');
        $('#prevBtn').addClass('noDisplay'); 
        $('.step').each(function(){
          $(this).addClass('viewSlide');
        });
        
        $('#overview').attr('data-rotate-x',20);
        $('#overview').attr('data-rotate-y',20);
        var time = parseInt($('#'+s.idImpress).attr('data-transition-duration'));
        setTimeout(function(){ 
          s.impress.goto('overview');
        },time);
        setTimeout(function(){
          $('#startBtn').removeClass('noDisplay');
        },time*2);

      }else{  
        $('#startBtn').addClass('noDisplay');
        $('#nextBtn').removeClass('noDisplay');
        $('#prevBtn').removeClass('noDisplay');  
        $('.step').each(function(){
          $(this).removeClass('viewSlide'); 
        }); 
      }
    }   

    $('#'+s.idImpress).attr('data-transition-duration',500);
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
    $(window).on('hashchange',function(){
      checkOverview(); 
    });

    var realoadExecuted=false;
    function reload(){
      if(!realoadExecuted){
        realoadExecuted=true; 
        UIkit.modal('#modalReload').show();           
      }
    }
    $('#modalReload').on('hidden',function(){
      realoadExecuted=false;
    });
    $('#modalReloadBtn').on('click',function(){
      location.reload();    
    });
    $(window).on('resize',function(){
      reload();      
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
    var s = this;

    // cube!
    var pos =[
      [ 1, 1, 2,   0,   0,   0], //1
      [ 2, 1, 1,   0,  90,   0], //2
      [ 1, 1, 0,   0, 180,   0], //3
      [ 0, 1, 1,   0, 270,   0], //4
      [ 1, 2, 1, 270,   0,   0], //5
      [ 1, 0, 1,  90,   0,   0]  //6 

    ];
    var aPos = [
      'data-x',
      'data-y',
      'data-z', 
      'data-rotate-x',
      'data-rotate-y',
      'data-rotate-z'
    ];
    var magni = Math.max($($('.step')[0]).innerHeight(),$($('.step')[0]).innerWidth())/2;
    var scale = 1;     

    for (var i=0; i<pos.length; i++){
      for (var ii=0; ii<3; ii++){  
        pos[i][ii]=pos[i][ii]*magni*scale;
      }  
      var $e = $($('.step')[0]).clone().attr('id','slide-'+(i+1));
      $e.attr('data-scale',scale); 
      for (var ii=0; ii<aPos.length; ii++){ 
        $e.attr(aPos[ii],pos[i][ii]);
      } 
      $('#'+s.idImpress).append($e);
    } 
    $($('.step')[0]).remove();   
 
    var max = [0,0,0]; 
    for (var i=0; i<pos.length; i++){ 
      for (var ii=0; ii<max.length; ii++){ 
        max[ii]=Math.max(max[ii],pos[i][ii]);
      } 
    }
    for (var ii=0; ii<max.length; ii++){ 
      max[ii]=max[ii]/2;
    }

    $('#'+s.idImpress).prepend('<div id="overview"></div>'); 
    $('#overview').addClass('step');
    $('#overview').attr('data-x',max[0]);
    $('#overview').attr('data-y',max[1]);
    $('#overview').attr('data-z',max[2]); 
    $('#overview').attr('data-rotate-x',20);
    $('#overview').attr('data-rotate-y',20);
    $('#overview').attr('data-rotate-z',5); 
    $('#overview').attr('data-scale',2.5*scale);   
    
    s.createImpressjs(); 
    s.createProgressBar(); 
    s.createMenu();  

  }
}
app.exe();
   