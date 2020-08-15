/*globals*/ 
function app(){
  'use strict';  
  var fn ={
    keyToken: 'token_server',
    tokensession: undefined,
    start: function (){ 
      fn.loadTokenFromCookie(); 
      $.ajax({
        url: '/checktoken',
        type: 'post', 
        headers: {
          authorization: fn.tokensession
        }, 
        success: function (data){  
          bodyOn(data);
          if(data){
            Snackbar.show({
              text: 'login OK', 
              duration: 2000 
            });
          }
        },
        error: function (jqXHR){             
          if (jqXHR.status===401){   
            bodyOn(false);
          }              
        }
      });   
    },
    getSession: function(){
      fn.tokensession = sessionStorage.getItem(fn.keyToken);  
    },
    setSession: function(data){
      fn.tokensession = data;
      sessionStorage.setItem(fn.keyToken,data);
      fn.getSession();
    },
    createCookie: function(){ 
      var d = new Date();
      d.setTime(d.getTime() + (24*60*60*1000));
      var expires = 'expires='+ d.toUTCString();
      document.cookie = fn.keyToken + '=' + fn.tokensession + ';' + expires + ';path=/';    
    },
    loadTokenFromCookie: function(){
      var name = fn.keyToken + '=';
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';'); 
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          fn.tokensession = c.substring(name.length, c.length); 
          Snackbar.show({
            text: 'Load Token from Cookie', 
            duration: 2500,
            onClose: function(){ 
            } 
          });
        }else{
          Snackbar.show({text: 'Not Load Token from Cookie'});
        }
      } 
      console.log(fn.tokensession); 
    },
    deleteCookieAndSession: function(){
      fn.tokensession = undefined;
      fn.setSession(undefined);
      document.cookie = fn.keyToken + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };   

  function bodyOn(BodyOn){
    if(BodyOn){
      $('#login').css({      
        display: 'none'
      });    
      $('#body').css({
        display: 'flex'
      });
    }else{
      $('#login').css({
        display: 'flex'
      });    
      $('#body').css({
        display: 'none'
      });
    }                 
  } 
  $('#body button').on('click',function(){ 
    fn.deleteCookieAndSession(); 
    fn.start(); 
  }); 
   
  $('#login button').on('click',function(){  
    var $b = $(this);
    $b.attr('disabled', true);   
    $.ajax({
      url: '/login',
      type: 'post', 
      data: {
        username: $($('input')[0]).val(),
        password: $($('input')[1]).val()              
      }, 
      success: function (data){ 
        $b.attr('disabled', false);     
        fn.setSession(data);
        fn.createCookie(); 
        fn.start(); 
      },
      error: function (jqXHR){
        $b.attr('disabled', false); 
        if (jqXHR.status===401){  
          Snackbar.show({
            text: jqXHR.responseText, 
            duration: 2000 
          });
        }              
      }
    });   
  });  
  fn.start();  

  /*DEBUGING... ****/
  $($('input')[0]).val('user');
  $($('input')[1]).val('pass');  
  //$('#login button').trigger('click');
  /*****************/
}
app();