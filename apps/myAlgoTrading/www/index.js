var ipcRenderer = require('electron').ipcRenderer;
var dm = {
  data: undefined,   
  getStart: function(fnSuccess,fnFail){
    var s = this;
    ipcRenderer.send('request01', true);
    s.data = undefined; 
    ipcRenderer.once('replyRequest01',function(event, arg){
      if(arg!==null||!info.end){    
        s.data=arg;  
        fnSuccess();
      }else{
        fnFail();
      } 
    }); 
  },
  getSimulation: function(fnSuccess,fnFail,requestData){
    var s = this;
    ipcRenderer.send('request02', requestData);  
    function listener(event, arg){
      if(arg!==null){ 
        s.data=arg.data;
        fnSuccess();
      }else{
        fnFail();
      } 
    }
    ipcRenderer.once('replyRequest02',listener);
  }   
}
var action = {
  //Terminal 
  timestampTerminal: undefined,
  startTerminal: function(){
    var s = this;
    s.timestampTerminal = new Date(); 
    $('#btnDeleteTerminal').on('click',function(){
      $('#terminal').html(' '); 
      Snackbar.show({text: 'Terminal Deleted'}); 
      s.addTerminal('Terminal Restored'); 
    });     
  },
  addTerminal: function(text){
    var time = new Date()-this.timestampTerminal;
    time = (Math.floor(time/60/60/1000)<10?'0'+Math.floor(time/60/60/1000):Math.floor(time/60/60/1000))+
    ':'+(Math.floor(time/60/1000%60)<10?'0'+Math.floor(time/60/1000%60):Math.floor(time/60/1000%60))+
    ':'+(Math.floor(time/1000%60)<10?'0'+Math.floor(time/1000%60):Math.floor(time/1000%60));
    $('#terminal').append('<p>('+time+') > '+text+'</p>'); 
    var scrollSize = $('#terminal').height();
    $('#terminal p').each(function(){
      scrollSize = scrollSize + $(this).height();
    })
    $('#terminal').animate({ 
      scrollTop: scrollSize 
    },100); 
  }, 
  //Modal Loading
  exeModal: false, 
  showLoadingModal: function(){ 
    var s = this;
    s.exeModal = false; 
    $('#loadingModal').modal({ 
      backdrop: 'static',
      keyboard: false
    });
  }, 
  hideLoadingModal: function(){
    var s = this;
    s.exeModal = true; 
    $('#loadingModal').modal('hide');
    $('.modal-backdrop.fade').remove();
  },
  setLoadingModal: function(){
    var s = this;
    $('#loadingModal').on('shown.bs.modal', function (e) { 
      if(s.exeModal){ 
        s.hideLoadingModal();
      }
    });
  },
  //General Event
  resize: function(){ 
    var s = this; 
    function size(){
      $('#terminal').css({
        'height': $(window).innerHeight()*1/5
      }); 
      $('#chart').css({
        'height': $(window).innerHeight()-$('#terminal').innerHeight()
      });
    }
    size();
    $(window).off('resize'); 
    $(window).on('resize',size); 
    var event;
    if(typeof(Event) === 'function') { //CHROME
          event = new Event('resize');
    }else{ // IE
      event = window.document.createEvent('UIEvents'); 
      event.initUIEvent('resize', true, false, window, 0);  
    }
    window.dispatchEvent(event);
  },
  init: function(){ 
    this.startTerminal(); 
    this.addTerminal('start App!'); 
    this.setLoadingModal(); 
    this.resize(); 
  }
}    


var app = {  
  //charts 
  chart:  undefined, 
  createChart: function(id){ 
    var s = this; 
    $('#'+id).html(' ');    
    var chart = Highcharts.stockChart(id,{ 
      chart: {
        zoomType: 'xy',
        events: {
          click: function (event) { 
            if(s.pos.on===true){
              action.addTerminal('x:'+event.xAxis[0].value +' y:'+event.yAxis[0].value);      
            }         
          }
        }
      },
      subtitle: {
        text: 'EUR/USD'
      },   
      credits: {
        enabled: false
      },
      plotOptions: {
        candlestick: {
          color: 'red',
          upColor: 'green'
        }
      },  
      navigator: { 
        enabled: true,
        color: 'black'
      },
      scrollbar: {
        enabled: true
      },
      rangeSelector: {
        enabled: true,
        buttons: [{
          type: 'all',
          text: 'All'
        },{
          type: 'year',
          count: 3,
          text: '3y'
        },{
          type: 'year',
          count: 1,
          text: '1y'
        },{
          type: 'month',
          count: 6,
          text: '6m'
        },{
          type: 'month',
          count: 1,
          text: '1m'
        },{
          type: 'day',
          count: 1,
          text: '1d'
        },{
          type: 'hour',
          count: 1,
          text: '1h'
        }],
        selected: 0,
        inputEnabled: false
      }, 
      series: [{ 
        type: 'candlestick',
        data: dm.data, 
        dataGrouping: {
          units: [
            ['minute',[1,5]],
            ['hour',[1]],
            ['day',[1]], 
            ['month',[1]]
          ]
        },
        tooltip: {
          valueDecimals: 5
        }
      }]
    });   
    return chart;
  },
  //postion 
  pos: {
    on: false,
    buySell: undefined
  },
  createPos: function(){
    var s = this;  
    var btnBuy =  '<button type="button" class="btn btn-success btn-sm btnTerminal" value="buy"><i class="fa fa-bar-chart"></i> Buy</button>';
    var btnSell = '<button type="button" class="btn btn-danger  btn-sm btnTerminal" value="sell"><i class="fa fa-bar-chart"></i> Sell</button>';
    action.addTerminal('Open Position: '+btnBuy+' '+btnSell);
    $('.btnTerminal').off('click'); 
    $('.btnTerminal').on('click',function(){ 
      s.pos.on=true;
      s.pos.buySell=$(this).attr('value');
      action.addTerminal($(this).attr('value')+ ' (Reload to reset)'); 
      $('button').remove(); 
      action.addTerminal('Now set Stop and limit and press <button type="button" class="btn btn-secondary btn-sm btnTerminal"><i class="fa fa-play"></i> Go!</button>');     
      $('.btnTerminal').off('click');
      $('.btnTerminal').on('click',function(){ 
        action.addTerminal('Go!'); 
        s.pos.on=false;
        $('button').remove();     
      });  
    }); 
  },
  //exe
  exe: function(){ 
    var s = this;     
    action.showLoadingModal();    
    Snackbar.show({text: 'Loading Data ...'});
    dm.getStart(function(){
      action.hideLoadingModal();
      Snackbar.show({text: 'Data Loaded'}); 
      action.addTerminal('Data Loaded');
      s.chart = s.createChart('chart'); 
      s.createPos();
    },function(){
      action.hideLoadingModal();
      Snackbar.show({text: 'Data error'}); 
      action.addTerminal('Data error');
    });
    
    
    /* DEV **** 
    //$('#btnDebug').trigger('click');
    var time = 0; 
    var incT = 120000; 
    function incTime(){
      time=time+incT;
    }

    function comboValues(oper,stop,lim){
      $('#selectTradeOper option').removeAttr('selected');
      $('#selectTradeStop option').removeAttr('selected');
      $('#selectTradeLim option').removeAttr('selected');
      $($('#selectTradeOper option')[oper]).attr('selected',true);
      $($('#selectTradeStop option')[stop]).attr('selected',true);
      $($('#selectTradeLim option')[lim]).attr('selected',true);
      s.addTerminal('ComboValue -> Dir: '+$('#selectTradeOper').val()+', Stop:'+$('#selectTradeStop').val()+', Lim:'+$('#selectTradeLim').val());
    }

    function test(n,oper,stop,lim){
      if(time===0){
        time = 100;
      }
      setTimeout(function(){
        $('#btnRandomData').trigger('click'); 
        s.addTerminal(' --- '+n+'º Simulation');
        comboValues(oper,stop,lim);
        setTimeout(function(){
          $('#btnPosData').trigger('click');
          s.resize(); 
        },5000);
      },time);
      if(time===100){
        time = 0;
      }
      incTime();
    } 
    
    s.addTerminal(' *** Simulation (incTime: '+incT+') ***'); 
    test(1,0,1,1);  
    //test(2,1,1,1);
    //test(3,0,0,0);   
    //test(4,1,0,0); 

    //********/

  }
}

action.init();
app.exe();   

/*

setBtnPositionData: function(){
  var s = this;    
  s.onOffBtnPositionData(false);    
  $('#btnPosData').on('click',function(){ 
    //$('#btnRandomData').prop('disabled', false);
    s.onOffBtnPositionData(false); 
    s.showLoadingModal();    
    Snackbar.show({text: 'Simulating ...'});  
    s.addTerminal('Simulating ...'); 
    var pos = {
      dir: $('#selectTradeOper').val(),
      i: dm.data.length-1,
      init: Math.round((dm.data[dm.data.length-1][4]+s.getSpread()*($('#selectTradeOper').val()=='BUY'?1:-1))*10000)/10000,
      stop:  Math.round((dm.data[dm.data.length-1][4]+0.001*parseInt($('#selectTradeStop').val())*($('#selectTradeOper').val()=='BUY'?-1:1))*10000)/10000,
      lim:   Math.round((dm.data[dm.data.length-1][4]+0.001*parseInt( $('#selectTradeLim').val())*($('#selectTradeOper').val()=='BUY'?1:-1))*10000)/10000
    } 
    s.createChartResult(pos).then(function(){ 
      s.hideLoadingModal(); 
      Snackbar.show({text: 'Simulation ends'});  
      s.addTerminal('Simulation ends');  
    }); 
  }); 
},


calStadPos: function(pos){
    var s = this;
    var gain = 0;    
    [cond1,cond2,cond3,cond4] = s.closePos(pos); 
	
    if(cond1){
      gain = -1*Math.round(((pos.init-pos.stop)*10000)/10)+'pis';
    }else if(cond2){
      gain = +1*Math.round(((pos.lim-pos.init)*10000)/10)+'pis';
    }else if(cond3){
      gain = +1*Math.round(((pos.init-pos.lim)*10000)/10)+'pis';
    }else if(cond4){
      gain = -1*Math.round(((pos.stop-pos.init)*10000)/10)+'pis';
    }	
      
    s.addTerminal('Pos:'+pos.dir+', start:'+pos.init+', lim:'+pos.lim+', stop:'+pos.stop+' -> G/L:(aprox.) '+gain); 
  },

*/