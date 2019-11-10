/*globals $, location, window, Snackbar, FormData*/
function start(path,tokensession){
  'use strict';  
  
  var on = false; 
  var method = 'mth00'; 
  var limit = 1; 
  var stop = 1;      
  
  function setSelectedItem(id,varCheck){
    $(id+' option:selected').removeAttr('selected');
    $.each($(id+' option'),function(i,e){  
      if($(e).val()===''+varCheck){ 
        $(id+" option[value='"+$(e).val()+"']").attr('selected', 'selected'); 
      } 
    });
  }
  
  function resetbody(){
    $('#body').html('<p class="text-center">-</p>'); 
  } 
  resetbody();
  
  function exeTerminal(file){
    console.log(file);
    $('#body').html('<p id="terminalLog" class="p-0 m-0 small align-bottom">-</p><div id="terminal"></div>');
    // style element   
    $('#terminalLog').html('<i class="fa fa-terminal"></i> '+file);
    $.get(file,function (data2){  
      data2 = data2.substring(data2.length-1-100000, data2.length-1);
      $('#terminal').html(data2.replace(/\n/g,'<br/>'));
      $('#terminal').animate({ 
        scrollTop: 10000000000000000000000000
      },1000); 
    }).fail(function(){
      $('#listLog').html('data not found: /'+data1.name);
    }); 
    $('#terminal').innerHeight($(window).innerHeight()-$('#card-header').innerHeight()-150);     
    $(window).on('resize',function(){ 
      $('#terminal').innerHeight($(window).innerHeight()-$('#card-header').innerHeight()-150);
    }); 
  }    
    
  function changeBtnExeAlgo(e,flag,name){
    $(e).attr('disabled', false);
    if(flag){
      $(e).removeClass('btn-success');
      $(e).addClass('btn-danger');
      $(e).html('<i class="fa fa-stop"></i> <span class="small">'+name+'</span>');
    }else{
      $(e).removeClass('btn-danger');
      $(e).addClass('btn-success'); 
      $(e).html('<i class="fa fa-play"></i> <span class="small">'+name+'</span>');
    } 
  }   
  
  function getStatusMethod(fnOk){
    $.ajax({
      url: '/onOffAlgo',
      type: 'get', 
      headers: {
        authorization: tokensession
      }, 
      success: function (data){
        fnOk(data); 
      },
      error: function (res){
        if (res.status===401){ 
          Snackbar.show({text: 'Error login Token'}); 
          location.hash='#login';                  
        } 
      }
    }); 
  }  
  
  function startMethod(fnOk){ 
    $.ajax({
      url: '/startStopAlgo',
      type: 'post', 
      headers: {
        authorization: tokensession
      }, 
      data: {
        method: $('#input0').val(), 
        stopInc: $('#input1').val(),
        limInc: $('#input2').val() 
      },
      success: function (data){
        fnOk(data); 
      },
      error: function (res){
        if (res.status===401){ 
          Snackbar.show({text: 'Error token Login'}); 
          location.hash='#login';
        } 
      }
    }); 
  }
    
  var usingLog;  
  
  function getLogFile(){ 
    resetbody();
    $.ajax({
      url: '/getLogList',
      type: 'get', 
      headers: {
        authorization: tokensession
      }, 
      success: function (data){   
        $('#body').html(''); 
        for (var i=0; i<data.length; i++){  
          if ((data[i].indexOf('datalog.json')===-1)&&(data[i]!==usingLog)){
            $('#body').append('<div class="container mb-2 "><div class="row pt-1 pb-1 border rounded"><div class="col-sm-6"><a class="btn btn-outline-dark btn-sm btn-block text-left" href="/'+data[i]+'" target="_blank">'+data[i]+'</a></div> <div class="col-sm-3"><button class="deleteBtn btn btn-outline-danger btn-sm btn-block h-100" ref='+data[i]+'><i class="fa fa-trash"></i></button> </div> <div class="col-sm-3"><button class="terminalBtn btn btn-outline-info btn-sm btn-block h-100" ref='+data[i]+'><i class="fa fa-terminal"></i></button> </div></div></div>'); 
          }else{
            if (data[i].indexOf('datalog.json')===-1){
              $('#body').append('<div class="container mb-2"><div class="row"><div class="col-12"><a class="btn btn-outline-dark btn-block text-left" href="/'+data[i]+'" target="_blank">'+data[i]+'</a></div></div></div>');
            }
          }
        }
        $('.deleteBtn').on('click',function(){  
          deleteFile($(this).attr('ref')); 
        });
        $('.terminalBtn').on('click',function(){  
          exeTerminal($(this).attr('ref')); 
        });
      },
      error: function (res){
        if (res.status===401){
          Snackbar.show({text: 'Error login token'}); 
          location.hash='#login';         
        } 
      }
    }); 
  }   
  getLogFile();
  
  function deleteFile(file){
    $.ajax({
      url: '/deleteLogFile',
      type: 'post', 
      data: {file: file},
      headers: {
        authorization: tokensession
      }, 
      success: function (){
        Snackbar.show({text: 'Log deleted: '+file});
        getLogFile(); 
      },
      error: function (res){
        if (res.status===401){ 
          Snackbar.show({text: 'Error:<br>'+res.responseText});
          location.hash='#login';
        } 
      }
    }); 
  }    
  
  function fillInput(){
    $('#loadingModal').modal({
      backdrop: 'static',
      keyboard: false
    });  
    $.ajax({
      url: '/getCombosValues',
      type: 'get', 
      headers: {
        authorization: tokensession
      }, 
      success: function (data){ 
        //console.log(data);    
        if (data.method!==undefined&&data.limInc!==undefined&&data.stopInc!==undefined){
          $.each(data.method,function(i,e){   
            $('#input0').append('<option value='+e.id+'>'+e.desc+'</option>'); 
          });
          $.each(data.stopInc,function(i,e){   
            $('#input1').append('<option value='+e+'>'+e+'</option>'); 
          });
          $.each(data.limInc,function(i,e){   
            $('#input2').append('<option value='+e+'>'+e+'</option>'); 
          });
        }else{ 
          Snackbar.show({text: 'Error combos Values'});
        }
        
        getStatusMethod(function(data){ 
          on = data.on; 
          method = data.method; 
          limit = data.limInc; 
          stop = data.stopInc;

          setSelectedItem('#input0',method);
          setSelectedItem('#input1',stop);
          setSelectedItem('#input2',limit);

          changeBtnExeAlgo('#btnApp',on,'AlgoTrading');
          if(on){
            $('#input0').attr('disabled',true); 
            $('#input1').attr('disabled',true); 
            $('#input2').attr('disabled',true); 
          }
        });
        
        $('#loadingModal').modal('hide');         
      },
      error: function (res){
        if (res.status===401){
          $('#loadingModal').modal('hide'); 
          Snackbar.show({text: 'Error login token'}); 
          location.hash='#login';         
        } 
      }
    });  
  }
  fillInput();   
  
  $('#btnApp').on('click',function(){ 
    $(this).attr('disabled',true);
    resetbody(); 
    $('#input0').attr('disabled',true); 
    $('#input1').attr('disabled',true); 
    $('#input2').attr('disabled',true); 
    startMethod(function(data){
      if(on){
        $('#input0').attr('disabled',false); 
        $('#input1').attr('disabled',false); 
        $('#input2').attr('disabled',false); 
      }
      on = data;  
      changeBtnExeAlgo('#btnApp',on,'AlgoTrading'); 
      Snackbar.show({text: (on?'AlgoTrading ON':'AlgoTrading OFF')});
      getLogFile();
    });
  });
  
      
}