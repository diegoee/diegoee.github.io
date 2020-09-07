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
        s.createInitCharts();
        s.onOffBtnPositionData(true);
      },function(){
        s.hideLoadingModal();
        Snackbar.show({text: 'Data error'}); 
        s.addTerminal('Data error');
      });

    }); 
  },   
  setBtnPositionData: function(){
    var s = this;    
    s.onOffBtnPositionData(false);    
    $('#btnPosData').on('click',function(){ 
      s.onOffBtnPositionData(true); 
      s.showLoadingModal();    
      Snackbar.show({text: 'Simulating ...'});  
      s.addTerminal('Simulating ...'); 
      var pos = {
        dir: $('#selectTradeOper').val(),
        i: dm.data.length-1,
        start: dm.data[dm.data.length-1][4],
        stop:  Math.round((dm.data[dm.data.length-1][4]+0.001*parseInt($('#selectTradeStop').val())*($('#selectTradeOper').val()=='BUY'?-1:1))*10000)/10000,
        lim:   Math.round((dm.data[dm.data.length-1][4]+0.001*parseInt( $('#selectTradeLim').val())*($('#selectTradeOper').val()=='BUY'?1:-1))*10000)/10000
      } 
      s.createResultCharts(pos).then(function(){ 
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
    }else{ 
      $('#btnPosData').prop('disabled', true);
      $('select').prop('disabled', true); 
    }
  },     
  //charts   
  createHighStock: function(id,zoom){
    var selector = 0;
    var title = 'All';
    var units = [
      ['minute',[1,5]],
      ['hour',[1]],
      ['day',[1]], 
      ['month',[1]]
    ];

    if(zoom==='mi'){
      selector=5;
      title = '5% Data';
      //units = [units[0]];  
    }else if(zoom==='h'){
      selector=4;
      title = '15% Data';
      //units = [units[1]];  
    }else if(zoom==='d'){
      selector=3;
      title = '45% Data';
      //units = [units[2]];  
    }else if(zoom==='mo'){
      selector=2
      title = 'All Data';
      //units = [units[3]];  
    }

    var chart = Highcharts.stockChart(id, { 
      subtitle: {
        text: title
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
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      rangeSelector: {
        enabled: false,
        buttons: [{
          type: 'all',
          text: 'All'
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
        },{
          type: 'minute',
          count: 5,
          text: '5min'
        }],
        selected: selector,
        inputEnabled: false
      }, 
      series: [{ 
        type: 'candlestick',
        data: dm.data, 
        dataGrouping: {
          units: units
        },
        tooltip: {
          valueDecimals: 4
        }
      }]
    }); 
 
    if(zoom==='mi'){
      chart.xAxis[0].setExtremes(dm.data[Math.floor(dm.data.length-1-dm.data.length*0.05)][0], dm.data[dm.data.length-1][0], true);
    }else if(zoom==='h'){ 
      chart.xAxis[0].setExtremes(dm.data[Math.floor(dm.data.length-1-dm.data.length*0.15)][0], dm.data[dm.data.length-1][0], true);
    }else if(zoom==='d'){ 
      chart.xAxis[0].setExtremes(dm.data[Math.floor(dm.data.length-1-dm.data.length*0.45)][0], dm.data[dm.data.length-1][0], true);
    }  
    return chart;
  },
  createHighStockWithPos: function(id,zoom,pos){
    var s = this;
    var chart = s.createHighStock(id,zoom);
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
      tooltip: {
        valueDecimals: 4
      }
    });
    chart.addSeries({
      name: 'Limit',
      color: '#00CA28',
      data: limA,
      tooltip: {
        valueDecimals: 4
      }
    }); 
    chart.addSeries({
      name: 'Start',
      color: '#000',
      data: [[dm.data[pos.i][0],pos.start]],
      marker: {  
        radius: 4
      },
      tooltip: {
        valueDecimals: 4
      }
    });
    //chart.update();
    return chart;
  },
  createInitCharts: function(){ 
    var s = this;
    $('#chartResult').html('<div class="col-12" >Push <button type="button" class="btn btn-success btn-sm" disabled><i class="fa fa-play"></i> <i class="fa fa-chart-line"></i></button> to simulate ...</div>');
    $('#chartInit').html(' ');
    $('#chartInit').append('<div class="col-6" id="chartInit01" ></div>');
    $('#chartInit').append('<div class="col-6" id="chartInit02" ></div>');
    $('#chartInit').append('<div class="col-6" id="chartInit03" ></div>');
    $('#chartInit').append('<div class="col-6" id="chartInit04" ></div>');
    s.createHighStock('chartInit01','mo');
    s.createHighStock('chartInit02','d');
    s.createHighStock('chartInit03','h');
    s.createHighStock('chartInit04','mi');  
    s.resize();  
  },
  createResultCharts: function(pos){
    var s = this;    
    $('#chartResult').html(' ');
    $('#chartResult').append('<div class="col-6" id="chartResult01"></div>');
    $('#chartResult').append('<div class="col-6" id="chartResult02"></div>');
    $('#chartResult').append('<div class="col-6" id="chartResult03"></div>');
    $('#chartResult').append('<div class="col-6" id="chartResult04"></div>');
    console.log(pos);
    return new Promise(function(resolve,reject){
      var n = 0;
      function getData(){
        dm.getNext(function(){
          n++;
          if(n<5000){
            getData();
          }else{ 
            s.createHighStockWithPos('chartResult01','mo',pos);
            s.createHighStockWithPos('chartResult02','d',pos);
            s.createHighStockWithPos('chartResult03','h',pos);
            s.createHighStockWithPos('chartResult04','mi',pos);  
            s.resize();
            resolve();
          }
        });
      } 
      getData(); 
    })
  },
  //exe app
  resize: function(){ 
    var s = this; 
    function size(){
      $('#terminal').css({
        'height': $('#comboContainer').innerHeight() 
      }); 
      $('#chartInit').css({
        'height': $(window).innerHeight()-$('.row[row="01"]').innerHeight()-$($('.row[row="02"] div')[0]).innerHeight()
      });
      $('#chartInit div').css({
        'height': Math.floor(($('#chartInit').innerHeight()-$($('.row[row="02"] div')[0]).innerHeight())/2) 
      });
      $('#chartResult').css({
        'height': $(window).innerHeight()-$('.row[row="01"]').innerHeight()-$($('.row[row="02"] div')[0]).innerHeight()
      });
      $('#chartResult div').css({
        'height': Math.floor(($('#chartResult').innerHeight()-$($('.row[row="02"] div')[0]).innerHeight())/2) 
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
    s.setLoadingModal();
    s.resize();     
    
    //*DEV ****
    $('#btnDebug').trigger('click');
    $('#btnRandomData').trigger('click');
    setTimeout(function(){
      $('#btnPosData').trigger('click');
      $($('.nav-pills .nav-link')[1]).trigger('click');
      s.resize();
    },12000);
    //********/
  }
}
app.exe();   