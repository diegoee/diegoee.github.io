var ipcRenderer = require('electron').ipcRenderer;
var dm = {
  data: undefined,   
  getStart: function(fnSuccess,fnFail){
    var s = this;
    ipcRenderer.send('request03', true);
    s.data = undefined;
    function listener(event, arg){
      if(arg!==null||!info.end){    
        s.data=arg;  
        fnSuccess();
      }else{
        fnFail();
      } 
    } 
    ipcRenderer.once('replyRequest03',listener); 
  },
  getNext: function(fnSuccess,fnFail){
    var s = this;
    ipcRenderer.send('request04', true);  
    function listener(event, arg){
      if(arg!==null){ 
        s.data.push(arg);
        fnSuccess();
      }else{
        fnFail();
      } 
    }
    ipcRenderer.once('replyRequest04',listener);
  }   
}

var app = {  
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
  //button
  disableAllButton: function(){
    $('button').prop('disabled', true);
    $('select').prop('disabled', true); 
    $('input').prop('disabled', true);  
    $('#btnDeleteTerminal').prop('disabled', false);
    $('#btnRefresh').prop('disabled', false);
    $('#btnDebug').prop('disabled', false);
  }, 
  setBtnRefresh: function(){
    var s = this; 
    $('#btnRefresh').off('click');
    $('#btnRefresh').on('click',function(){ 
      Snackbar.show({text: 'Reload App'});   
      s.showLoadingModal();
      ipcRenderer.send('request01', null);    
    });
  },
  setBtnDebug: function(){
    var s = this; 
    $('#btnDebug').off('click');
    $('#btnDebug').on('click',function(){  
      Snackbar.show({text: 'Open/close DevTools'}); 
      s.addTerminal('Open/close DevTools'); 
      ipcRenderer.send('request02', null);    
    });
  },   
  setBtnRandomData: function(){
    var s = this;  
    $('#btnRandomData').prop('disabled', false);
    $('#btnRandomData').on('click',function(){ 
      s.showLoadingModal();    
      Snackbar.show({text: 'Loading Data ...'}); 
      dm.getStart(function(){
        s.hideLoadingModal();
        Snackbar.show({text: 'Data Loaded'}); 
        s.addTerminal('Data Loaded');
        s.createChart();
        s.onOffBtnPositionData(true);
      },function(){
        s.hideLoadingModal();
        Snackbar.show({text: 'Data error'}); 
        s.addTerminal('Data error');
      });

    }); 
  },  
  setInputSpread: function(){ 
    $('[data-toggle="tooltip"]').tooltip(); 
    $('#inputSpread').val(0.00006); 
  }, 
  getSpread: function(){
    return parseFloat($('#inputSpread').val());
  },
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
  onOffBtnPositionData: function(on){
    var s = this;  
    if(on){ 
      $('#btnPosData').prop('disabled', false);
      $('select').prop('disabled', false);  
      $('input').prop('disabled', false);  
    }else{ 
      $('#btnPosData').prop('disabled', true);
      $('select').prop('disabled', true);  
      $('input').prop('disabled', true);  
    }
  },     
  //charts   
  createChart: function(){ 
    var id = 'chart';
    $('#'+id).html(' ');    
    var chart = Highcharts.stockChart(id, { 
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
 
    var xAxis = [dm.data[Math.floor(dm.data.length-1-dm.data.length*0.15)][0], dm.data[dm.data.length-1][0]];
    chart.xAxis[0].setExtremes(xAxis[0], xAxis[1], true);  
    return [chart, xAxis];
  }, 
  createChartResult: function(pos){
    var s = this;      
    var xAxis = s.createChart()[1];
    return new Promise(function(resolve,reject){
      var n = 0;
      function getData(){
        dm.getNext(function(){
          n++;
          //x,open,high,low,close
          var cond1 = (pos.dir==='BUY')&&((pos.stop<dm.data[dm.data.length-1][3])&&(pos.lim>dm.data[dm.data.length-1][2]));
          var cond2 = (pos.dir!=='BUY')&&((pos.stop>dm.data[dm.data.length-1][2])&&(pos.lim<dm.data[dm.data.length-1][3]));
          if(cond1||cond2||n<5000){
            getData();
          }else{   
            var chart = s.createChart()[0]; 
            chart.xAxis[0].setExtremes(xAxis[0], xAxis[1], true); 
            var limA = [];
            var stopA = [];
            for (var i=pos.i; i<dm.data.length; i++){
              limA.push([dm.data[i][0],pos.lim]);
              stopA.push([dm.data[i][0],pos.stop]);
            } 
            chart.addSeries({
              name: 'Stop',
              color: '#CA0000',
              data: stopA,
              dashStyle: 'shortdot',
              tooltip: {
                valueDecimals: 4
              }
            });
            chart.addSeries({
              name: 'Limit',
              color: '#00CA28',
              data: limA,
              dashStyle: 'shortdot',
              tooltip: {
                valueDecimals: 4
              }
            }); 
            chart.addSeries({
              name: 'Init',
              color: 'black',
              data: [[dm.data[pos.i][0],pos.init]],
              marker: {  
                radius: 4, 
                symbol: 'cross'
              },
              tooltip: {
                valueDecimals: 4
              }
            });  
             
            s.calStadPos(pos);
            s.resize();
            resolve();
          }
        });
      } 
      getData(); 
    })
  },
  //Pos cal
  calStadPos: function(pos){
    var s = this;
	  var gain = 0;
	
    var cond1 = (pos.dir==='BUY')&&(pos.stop<dm.data[dm.data.length-1][3]);
    var cond2 = (pos.dir==='BUY')&&(pos.lim<dm.data[dm.data.length-1][2]);
    var cond3 = (pos.dir!=='BUY')&&(pos.stop>dm.data[dm.data.length-1][2]);
    var cond4 = (pos.dir!=='BUY')&&(pos.lim<dm.data[dm.data.length-1][3]);
	
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
  //exe app
  resize: function(){ 
    var s = this; 
    function size(){
      $('#terminal').css({
        'height': $('#comboContainer').innerHeight() 
      }); 
      $('#chart').css({
        'height': $(window).innerHeight()-$('.row[row="01"]').innerHeight()
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
  exe: function(){ 
    var s = this;      
    s.startTerminal(); 
    s.addTerminal('start!'); 
    s.disableAllButton();  
    s.setBtnRefresh();   
    s.setBtnDebug(); 
    s.setBtnRandomData();
    s.setBtnPositionData(); 
    s.setInputSpread();   
    s.setLoadingModal();
    s.resize();     
    
    //* DEV **** 
    $('#btnDebug').trigger('click');
    var time = 0;
    var incT = 60000; 
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
      s.addTerminal('ComboValue -> Dir: '+$('#selectTradeOper option').val()+', Stop:'+$('#selectTradeStop option').val()+', Lim:'+$('#selectTradeLim option').val());
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
    test(2,1,1,1);
    test(3,0,0,0);   
    test(4,1,0,0); 

    //********/

  }
}
app.exe();   