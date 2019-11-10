/*globals document,  Backbone, $, setTimeout, sessionStorage, start,info, bm, terminal, graph,Snackbar  */ 
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
          //console.log('loadTokenFromCookie');
          //console.log(fn.tokensession);
        }
      }
      
    },
    deleteCookieAndSession: function(){
      fn.tokensession=undefined;
      fn.setSession(undefined);
      document.cookie = fn.keyToken + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    resetTemplate: function(){
      $('#app').html('<div class="spinner"><div class="loader">Loading...</div></div>');
    },
    render: function (template,fnDone){ 
      $('.modal-backdrop').remove();
      fn.resetTemplate();
      $.get(template,function(data){  
        $(data).each(function(i,e){ 
          if($(e).attr('id')==='appTemplate'){ 
            $('#app').html($(e).html());   
            fnDone(); 
            return false;
          } 
        });       
      });            
    },
    menuActive: function (id){      
      $('#navbarMenu a').removeClass('active');
      $('#navbarMenu a[href^="'+id+'"]').addClass('active'); 
    },
    menuApp: function(){ 
      $('#menuNav a').on('click',function(){
        $('#navbarMenu').collapse('hide');
      });
      $('#navbarMenu').on('show.bs.collapse',function () {
        $('#nav-icon').toggleClass('open');
      });
      $('#navbarMenu').on('hide.bs.collapse',function () {
        $('#nav-icon').toggleClass('open');
      });
      //$('#btnMenu').on('click',function(){
		//$('#nav-icon').toggleClass('open');
      //});
      
    }
  };  
  fn.menuApp(); 
  fn.loadTokenFromCookie(); 
  
  var templatePath = 'templates/';
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'home', 
      'home': 'home', 
      'login': 'login', 
      'start': 'start', 
      'bm': 'bm', 
      'info': 'info'
    },
    home: function(){  
      fn.menuActive('');
      fn.render(templatePath+'home.html',function(){ 
        if(fn.tokensession===undefined){
          Backbone.history.navigate('#login', { 
            trigger: true 
          });
        }
        $('#btn1').on('click',function(){ 
          fn.deleteCookieAndSession();
          Backbone.history.navigate('#login', { 
            trigger: true 
          });
        });
        $('#btn2').on('click',function(){ 
          $('#modalServer').modal({
            backdrop: 'static',
            keyboard: false
          });
        });
        $('#resetServer').on('click',function(){ 
          $.ajax({
            url: '/resetServer',
            type: 'get', 
            headers: {
              authorization: fn.tokensession
            }, 
            success: function (data){
              $('#modalServer').modal('hide');
              Snackbar.show({text: 'Reset Server : '+data});
            },
            error: function (res){
              $('#modalServer').modal('hide');
              if (res.status===401){  
                Snackbar.show({text: 'Error login Token'}); 
                Backbone.history.navigate('#login', { 
                  trigger: true 
                });            
              } 
            }
          });
        });
      });
    },
    start: function(){ 
      fn.menuActive('#start');
      fn.render(templatePath+'start.html',function(){ 
        if(fn.tokensession===undefined){
          Backbone.history.navigate('#login', { 
            trigger: true 
          });
        }
        start('/output',fn.tokensession); 
      });
    },
    info: function(){  
      fn.menuActive('#info');
      fn.render(templatePath+'info.html',function(){
        if(fn.tokensession===undefined){
          Backbone.history.navigate('#login', { 
            trigger: true 
          });
        }
        info('/output',fn.tokensession); 
      });
    }, 
    login: function(){  
      fn.menuActive('');
      fn.render(templatePath+'login.html',function(){
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
              Snackbar.show({text: '<strong>Nota: </strong> Nueva sessión iniciada'});
              Backbone.history.navigate('#home', { 
                trigger: true 
              }); 
            },
            error: function (jqXHR){
              if (jqXHR.status===401){  
                $('#loginBtn').attr('disabled', false);
                Snackbar.show({text: '<strong>Nota: </strong>'+jqXHR.responseText}); 
              }              
            }
          });   
        }); 
      });
    }
  });
  
  new AppRouter();
  Backbone.history.start(); 
}
app();