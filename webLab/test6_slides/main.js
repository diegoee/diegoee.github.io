/*global $*/
var app = {   
  createMenu: function(){ 
    var $e = $('.reveal section');
    var l = $e.length;
    $('#menu ul').append('<li><button do-slide="overview" class="uk-button uk-button-text uk-button-small uk-text-meta active"><span uk-icon="home"></span> Overview</button></li>');  
    for (var i=0; i<l; i++){ 
      $('#menu ul').append('<li><button class="uk-button uk-button-text uk-button-small uk-text-meta"><span uk-icon="file-text"></span> Slide '+i+'</button></li>');
    } 
    $('#menu ul button').on('click',function(){
      var s = $(this).attr('go-slide');
      if(s==='overview'){

      }else{

      }
      $('#btnCloseMenu').trigger('click'); 
    }); 
    $('#labelActiveMenu').remove();
    $($('#menu ul li')[0]).prepend(' <span id="labelActiveMenu" uk-icon="chevron-right"></span>');         
  }, 
  exe: function(){  
    var s = this;
    s.createMenu();  
    Reveal.initialize().then(function(){ 
       
    }); 
    Reveal.toggleOverview();
  }
}
app.exe();
    