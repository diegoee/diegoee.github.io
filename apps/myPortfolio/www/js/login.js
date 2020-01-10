/*globals*/ 
function app(){
  'use strict';  
  var fn ={
    keyToken: 'token_server_VPS_diegop_EE',
    tokensession: undefined,
    getSession: function(){
      fn.tokensession = sessionStorage.getItem(fn.keyToken); 
      //console.log('getSession');
      //console.log(fn.tokensession);
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
            duration: 1000,
            onClose: function(){
              callIndex();
            } 
          });
        }else{
          Snackbar.show({text: 'Not Load Token from Cookie'});
        }
      } 
    },
    deleteCookieAndSession: function(){
      fn.tokensession = undefined;
      fn.setSession(undefined);
      document.cookie = fn.keyToken + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };  
  //fn.loadTokenFromCookie(); 
  $('#trashBtn').on('click',function(){  
    fn.deleteCookieAndSession();
    Snackbar.show({text: 'Delete Cookies'}); 
  }); 
  $('#cookieBtn').on('click',function(){  
    fn.loadTokenFromCookie();  
  }); 
 
  $('#loginBtn').on('click',function(){  
    $('#loginBtn').attr('disabled', true);   
    $.ajax({
      url: '/login',
      type: 'post', 
      data: {
        username: $('#user').val(),
        password: $('#pass').val()              
      }, 
      success: function (data){   
        fn.setSession(data);
        fn.createCookie();
        callIndex();
      },
      error: function (jqXHR){
        if (jqXHR.status===401){  
          $('#loginBtn').attr('disabled', false);
          Snackbar.show({text: '<strong>Nota: </strong>'+jqXHR.responseText}); 
        }              
      }
    });   
  });  

  function callIndex(){
    $.ajax({
      url: '/index',
      type: 'get', 
      headers: {
        authorization: fn.tokensession
      }, 
      success: function (data){ 
        Snackbar.show({
          text: 'Ok',
          duration: 1000,
          onClose: function(){
            document.write(data); 
          }
        });
      },
      error: function (res){
        if (res.status===401){ 
          Snackbar.show({text: 'Error login Token'});  
        } 
      }
    }); 
  }
  
}
app();