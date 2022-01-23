/*globals require, window,document,location, setTimeout*/
require.config({
  baseUrl: 'js',
  paths: {
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min',
    bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min' 
  },
  shim: {
    bootstrap : {
      deps : ['jquery']
    }  
  }
});

require([
  'jquery',
  'bootstrap'
  ],
  function(
    $
  ){
  'use strict';
  // FUN WIT FLAGS: https://www.proinf.net/permalink/banderas_del_mundo

  var App = {
    tem: [
      '#home',
      '#experience',
      '#education',
      '#portfolio',
      '#other',
    ],
    language: 'language2',
    init: function init(){
      $(document).ready(function(){

        //Slide down-up effect
        $(window).scroll(function() {
          $('.slideanim').each(function(){
            var pos = $(this).offset().top;
            var winTop = $(window).scrollTop();
              if (pos < winTop + 500) {
                $(this).addClass("slide");
              }
          });
        });

        //Slide animate scroll
        $('.navbar a, footer a[href="#home"]').on('click',function(event){
          if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
              scrollTop: $(hash).offset().top
            }, 700, function(){
              window.location.hash = hash;
              $('#myNavbar').removeClass('in');
              $('#myNavbar').attr('aria-expanded','false');
              $('button[data-target="#myNavbar"]').attr('aria-expanded','false');
              $('button[data-target="#myNavbar"]').addClass('collapsed');
            });
          }
        });

        //Active Section
        $('body').scrollspy({target: ".navbar", offset: 50});

        //Print Button
        var checkPrint = 0;
        $('#printBtn').on('click',function(){
           
          if(checkPrint==5){
            App.printBtn();
          }else{
            checkPrint = 0;
            $("#modal").modal('show');
          }
        });
        $('#secretPrintBtn').on('click',function(){
          checkPrint++;
        });

        $('#language1').on('click',App.translate);
        $('#language2').on('click',App.translate);

        App.exeTranslate = false;
        App.activeSpinner(false);

      });

      //refresh Si hay un hash no controlado
      App.checkHash();
      $(window).on('hashchange', App.checkHash);

      window.beforeprint=App.beforeprint;
      window.afterprint=App.afterprint;  
      //setTimeout(function(){
      //  $('#myNavbar a[href="#portfolio"]').trigger('click');
      //},1000);
    },
    exeTranslate: false,
    beforeprint: function beforeprint(){
      $('#body').remove();
    },
    afterprint: function afterprint(){
      var file = 'assets/template/templateSP.html';
      if(App.language==='language1'){
        file = 'assets/template/templateEN.html';
      }else{
        file = 'assets/template/templateSP.html';
      }
      App.exeLoad(file);
    },
    translate: function translate(){
      if(!App.exeTranslate){
        App.exeTranslate = true;
        App.activeSpinner(true);

        var file = 'assets/template/templateSP.html';
        if(this.id==='language1'){
          App.language = 'language1';
          file = 'assets/template/templateEN.html';
        }else{
          App.language = 'language2';
          file = 'assets/template/templateSP.html';
        }

        setTimeout(function(){
          App.exeLoad(file);
        },1000);

      }
    },
    exeLoad: function exeLoad(file){
      $('body').load(file,function(responseTxt, statusTxt, xhr){
        //console.log('pass2');
        if(statusTxt === "success"){
          App.activeSpinner(true);
          App.init();
        }
        if(statusTxt === "error"){
          alert("Error: " + xhr.status + ": " + xhr.statusText);
          App.exeTranslate = false;
          App.activeSpinner(false);
        }
      }); 
    },
    activeSpinner: function activeSpinner(on){
      $('html, body').animate({
        scrollTop: 0
      }, 50);
      if(on){
        $('#spinnerLoading').addClass('showSpinner');
        $('#spinnerLoading').removeClass('notShowSpinner');
        $('#body').addClass('notShowSpinner');
        $('#body').removeClass('showSpinner');
        $('body').css({
          overflow: 'hidden'
        });
      }else{
        $('#spinnerLoading').addClass('notShowSpinner');
        $('#spinnerLoading').removeClass('showSpinner');
        $('#body').addClass('showSpinner');
        $('#body').removeClass('notShowSpinner');
        $('body').css({
          overflow: 'auto'
        });
      }
    },
    checkHash: function checkHash(){
      var hash = location.hash;
      var x = 0;
      for(var i=0; i<App.tem.length;i++){
        if(App.tem[i]===hash){ x=x+1; }
       }
      if(""===hash){ x=x+1; }
      if(x<1){  location.replace(location.pathname);}
    },
    printBtn: function printBtn(){
      //alert('Contactar por e-mail. Gracias:)');

      $('div').each(function(){
        $(this).addClass('visible');
        $(this).addClass('reset');
      });

      $('footer').remove();
      $('.border').remove();
      $('.modal').modal('hide');
      $('#printBtn').remove();

      var i;
      var $e = [];

      $e[0] = $($('#home div')[3]);
      $e[1] = $($('#home div')[2]);
      $e[0].removeClass('col-sm-4');
      $e[0].addClass('col-xs-4');
      $e[1].removeClass('col-sm-8');
      $e[1].addClass('col-xs-8');
      $e[1].addClass('mtop');
      $('#home').empty();
      $('#home').append($e[0]);
      $('#home').append($e[1]);

      $e = [];
      $e[0] = $('#experience h2');
      $e[0].addClass('mtop');
      for(i=1;i<=4;i++){
        $e[i] = $($('#experience div')[i+3]);
        $e[i].find('article').append($e[i].find('details').children());
        $e[i].find('summary').remove();
        $e[i].find('details').remove();
      }
      $('#experience').empty();
      for(i=0;i<5;i++){
        $('#experience').append($e[i]);
      }
      $e = $('#experience h3');
      for(i=0;i<$e.length;i++){
        var text = $($e[i]).text();
        $($e[i]).html('<b>'+text+'</b>');
      }

      var pos = [];
      
      /*
      $e = [];
      var pos = [2,3,5,6,8];
      
      $e[0] = $('#education h2');
      $e[0].addClass('mtop');
      for(i=0;i<pos.length;i++){
        $e[i+1] = $($('#education div')[pos[i]]);
        $e[i+1].removeClass('col-sm-6');
        $e[i+1].addClass('col-xs-12');
      }
      $('#education').empty();
      for(i=0;i<$e.length;i++){
        $('#education').append($e[i]);
      } 
      */ 
      
      $e = $('#education h3');
      for(i=0;i<$e.length;i++){
        var text = $($e[i]).text();
        $($e[i]).html('<b>'+text+'</b>');
      }

      pos=[];
      for(i=0;i<$('.panel-heading').length;i++){
        pos[i] = '<p>'+$($('.panel-heading')[i]).text()+' ('+$($($('.panel-heading')[i]).find('a')[0]).attr('href')+')</p>';
        console.log(pos[i]);
      }

      $e = [];
      $e[0] = $('#portfolio h2');
      $e[0].addClass('mtop');
      $e[0].addClass('mbottom'); 
      $('#portfolio').empty();
      $('#portfolio').append($e[0]);
      for(i=0;i<pos.length;i++){
        $('#portfolio').append(pos[i]);
      }
      
      $('#other div.col-sm-2').addClass('col-xs-2');
      $('#other div.col-sm-10').addClass('col-xs-10');
      $('#other div').removeClass('col-sm-2');
      $('#other div').removeClass('col-sm-10');
      

      $('#body').on('beforeprint',function(){
        $(this).remove();
      });

      window.beforeprint=null;
      window.afterprint=null;
      window.print();
      App.afterprint();

    }
  };

  App.exeLoad('assets/template/templateSP.html');
});


