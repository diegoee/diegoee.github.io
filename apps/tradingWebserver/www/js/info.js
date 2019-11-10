/*globals  location,  $, Snackbar,Backbone */
function info(path,tokensession){
  'use strict';
  var spread = 0; 
  
  //GET SPREAD COMISION  
  $.ajax({
    url: '/getSpread',
    type: 'get', 
    headers: {
      authorization: tokensession
    }, 
    success: function (data){    
      spread=data.spread;  
    },
    error: function (res){
      if (res.status===401){ 
        $('#loadingModal').modal('hide');
        Snackbar.show({text: 'Error login Token'}); 
        location.hash='#login';                  
      } 
    }
  });
  
  
  $('#btn0').on('click',function(){    
    $('#loadingModal').modal({
      backdrop: 'static',
      keyboard: false
    });   
    $.ajax({
      url: '/getHistMov',
      type: 'get', 
      headers: {
        authorization: tokensession
      }, 
      success: function (data){    
        $('#body').html(JSON.stringify(data)); 
        var e ='<ul class="list-group">'; 
        for (var i=0; i<data.length; i++){ 
          e = e+'<li class="list-group-item">';
          e = e+'<div style="cursor: pointer;" class="container detailRefMov" reference="'+data[i].reference+'"><div class="row"><div class="col-12">'+ (new Date((new Date(data[i].dateUtc)).getTime()+4*3600*1000)).toISOString() +' - '
            +data[i].reference+' - '
            +'<b class="'+(data[i].profitAndLoss.indexOf('-')>0?'text-danger':'text-success')+'">'+data[i].profitAndLoss+'</b></br>'
            +'<b>'+data[i].instrumentName+'</b></br>'
            +'<div class="small"><b class="'+(data[i].size>0?'text-success':(data[i].size<0?'text-danger':'text-warning'))+'">'+(data[i].size>0?'BUY':(data[i].size<0?'SELL':'OTHER'))+'</b> - '
            +'Size: <b class="'+(data[i].size>0?'text-success':'text-danger')+'">'+data[i].size+'</b> '+
            'Transition Type: '+data[i].transactionType+' - '+
            'Open Level: '+data[i].openLevel+' - '+
            'Close Level: '+data[i].closeLevel+'</div></div></div></div>'; 
          e = e+'</li>';
        }
        e = e+'</ul>';
        $('#body').html(e);     
        $('.detailRefMov').on('click',function(){ 
          detailRefMov($(this).attr('reference'),$(this).html());
        }); 
        $('#loadingModal').modal('hide'); 
      },
      error: function (res){
        if (res.status===401){ 
          $('#loadingModal').modal('hide');
          Snackbar.show({text: 'Error login Token'}); 
          location.hash='#login';                  
        } 
      }
    });      
  });  
  
  $('#btn1').on('click',function(){      
    $('#loadingModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $.ajax({
      url: '/getAccountsInfo',
      type: 'get', 
      headers: {
        authorization: tokensession
      }, 
      success: function (data){        
        $('#body').html(JSON.stringify(data));
        var e ='<ul class="list-group">'; 
        for (var i=0; i<data.length; i++){ 
          e = e+'<li class="list-group-item">';
          e = e+'<p> Id: <b>'+data[i].accountId+'</b> - Name: <b>'+data[i].accountName+'</b> - Currecy: '+data[i].currency+' - '+data[i].status+'</p>';
          e = e+'<p class="small"> Available: '+data[i].balance.available+' <br>Balance: '+data[i].balance.balance+' <br>Deposit: '+data[i].balance.deposit+' <br>ProfitLoss: <span class="'+(data[i].balance.profitLoss<0?'text-danger':'text-success')+'">'+data[i].balance.profitLoss+'<span></p>';
          e = e+'</li>';
        }
        e = e+'</ul>';
        $('#body').html(e);
        $('#loadingModal').modal('hide');
      },
      error: function (res){
        if (res.status===401){ 
          $('#loadingModal').modal('hide');
          Snackbar.show({text: 'Error login Token'}); 
          location.hash='#login';                  
        } 
      }
    });      
  });
   
  $('#btn2').on('click',function(){      
    $('#loadingModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $.ajax({
      url: '/getOpenPositions',
      type: 'get', 
      headers: {
        authorization: tokensession
      }, 
      success: function (data){        
        $('#body').html(JSON.stringify(data));  
        var e ='<ul class="list-group">';
        for (var i=0; i<data.length; i++){ 
          var diff = (data[i].position.direction==='BUY'?(data[i].market.bid+data[i].market.offer)/2-spread-data[i].position.openLevel:data[i].position.openLevel-spread-(data[i].market.bid+data[i].market.offer)/2).toFixed(5);
          var levelMarket = ((data[i].market.bid+data[i].market.offer)/2).toFixed(5);
          
          e = e+'<li class="list-group-item">';
          e = e+'<div> <b>'+data[i].position.createdDate+'</b> - '
            +data[i].market.instrumentName+' - ' 
            +'<b class="'+(data[i].position.direction==='SELL'?'text-danger':'text-success')+'">'+data[i].position.direction+'</b> </div>';
          e = e+'<div class="small">'+
            'dealId: '+data[i].position.dealId+'<br>'+
            'Currency: '+data[i].position.currency+' - '+
            'Size: '+data[i].position.dealSize+'<br>'+ 
            'Level: '+data[i].position.openLevel+' - '+
            'spread: '+spread+' - '+
            'Stop: '+data[i].position.stopLevel+' - '+
            'Limit: '+data[i].position.limitLevel
            +'</div>';          
          e = e+'<div class="container"><div class="row  mt-1 "><div class="col-4"><button class="btn btn-danger btn-sm btn-block deletePos" type="button" dealId="'+data[i].position.dealId+'" dealSize="'+data[i].position.dealSize+'" direction="'+data[i].position.direction+'"><i class="fa fa-trash"></i> <span class="small">Close</span></button></div><div class="col-8"><p class="small border border-dark rounded p-1">Market: '+levelMarket+' - Diff: <span class="'+(diff>0?'text-success':'text-danger')+'">'+diff+'</span></p></div></div></div>';
          e = e+'</li>';
        }
        e = e+'</ul>';
        $('#body').html(e); 
        if (data.length===0){
          $('#body').html('<p><b>NO</b> hay posiciones abiertas</p>');
        }
        $('.deletePos').on('click',function(){ 
          var data = {
            dealId: $(this).attr('dealId'),
            dealSize: $(this).attr('dealSize'),
            direction: ($(this).attr('direction')==='SELL')?'BUY':'SELL',
          };
          $('#deleteModal .modal-title').html('Delete Pos: <b>'+$(this).attr('dealId')+'<b> ?');          
          var e = '<div class="container"><div class="row  mt-1 "><div class="col-6"><button id="deleteDealId" class="btn btn-outline-success btn-sm btn-block" type="button" data-dismiss="modal"><i class="fa fa-check"></i> <span class="small">Accept</span></button></div><div class="col-6"><button class="btn btn-outline-danger btn-sm btn-block" type="button" data-dismiss="modal"><i class="fa fa-times"></i> <span class="small">Cancel</span></button></div></div></div>';          
          $('#deleteModal .modal-body').html(e);
          $('#deleteModal').modal({ 
          });
          $('#deleteDealId').on('click',function(){ 
            deletePosition(data); 
          });
        });
        $('#loadingModal').modal('hide');
      },
      error: function (res){
        if (res.status===401){ 
          $('#loadingModal').modal('hide');
          Snackbar.show({text: 'Error login Token'}); 
          location.hash='#login';                  
        } 
      }
    });      
  });
  
  function detailRefMov(reference,htmlTitle){ 
    //Snackbar.show({text: reference}); 
    $('#loadingModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    $.ajax({
      url: '/getActMov',
      type: 'get', 
      headers: {
        authorization: tokensession
      }, 
      success: function (data){          
        data = data.filter(function(value){
          return value.description.indexOf(reference)>0;          
        }); 
        //$('#body').html(JSON.stringify(data));
        var e ='<ul class="list-group">';
        for (var i=0; i<data.length; i++){ 
          e = e+'<li class="list-group-item">';
          e = e+'<div> <b>'+(new Date((new Date(data[i].date)).getTime()+4*3600*1000)).toISOString() +'</b> - '
            +data[i].description+' <br> ' 
            +data[i].channel+' - ' 
            +data[i].type+' - ' 
            +data[i].status+' - '
            +'<b class="'+(data[i].details.direction==='SELL'?'text-danger':'text-success')+'">'+data[i].details.direction+'</b> </div>';
          e = e+'<div class="small">'+data[i].details.marketName+' - ' 
            +'Currency: '+data[i].details.currency+' - ' 
            +'Size: '+data[i].details.size+' <br> ' 
            +'Level: '+data[i].details.level+' <br> ' 
            +'Stop level: '+data[i].details.stopLevel+' <br> ' 
            +'Limit level: '+data[i].details.limitLevel+' <br></div>';
          e = e+'</li>';
        }
        e = e+'</ul>';    
               
        $('#detailModal .modal-title').html(htmlTitle);
        $('#detailModal .modal-body').html(e);
        $('#loadingModal').modal('hide'); 
        $('#detailModal').modal();
      },
      error: function (res){
        if (res.status===401){ 
          $('#loadingModal').modal('hide');
          Snackbar.show({text: 'Error login Token'}); 
          location.hash='#login';                  
        } 
      }
    }); 
  }
  
  function deletePosition(data){ 
    $.ajax({
      url: '/deletePosition',
      type: 'post', 
      headers: {
        authorization: tokensession
      }, 
      data:{
        dealId: data.dealId, 
        direction: data.direction,
        size: data.dealSize 
      },
      success: function (res){          
        Snackbar.show({
          text: 'Deleted ('+data.dealId+'): '+res,
          duration: 2500,
          showAction: false,
          onClose: function(){
            Backbone.history.loadUrl();
          }
        });
      },
      error: function (res){
        if (res.status===401){ 
          $('#loadingModal').modal('hide');
          Snackbar.show({text: 'Error login Token'}); 
          location.hash='#login';                  
        } 
      }
    }); 
  } 
  
}
