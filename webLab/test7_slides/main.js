/*global $*/
var app = {  
  getRndN: function(nstart,nEnd){
    return Math.floor(Math.random()*nEnd)+nstart;
  },
  exe: function(){  
    function r(){
      return app.getRndN(1,10)+'000';
    }

    $('#app').attr('data-transition-duration','500'); 
    $('#app').attr('data-scale','1');  
    $('#app').append('<div id="overview" class="step" data-x="5000" data-y="5000" data-z="0" data-scale="25"></div>');

    $($('.step')[0]).attr('data-x',r()).attr('data-y',r()).attr('data-z',r()).addClass('slide');  
    for (var i=0; i<3; i++){ 
      $('#app').append($($('.step')[0]).clone().attr('data-x',r()).attr('data-y',r()).attr('data-z',r()));
    } 
    $($('.step')[0]).remove();  

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
    $(window).on('hashchange',function(e){
      checkOverview();
    });

    //TODO: Crear Barra de estado y botone de continuar y retroceder

    //impress
    var imp = impress('app');
    imp.init();     
    location.hash='#/overview';
    checkOverview();
    setInterval(function(){
      imp.next();
    },5000);

  }
}
app.exe();
   