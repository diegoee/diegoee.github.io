const { chart } = require('highcharts');

var ipcRenderer = require('electron').ipcRenderer;
var dm = {
  data: undefined,   
  getStart: function(fnSuccess,fnFail){
    var s = this;
    ipcRenderer.send('request03', true);
    s.data = undefined;
    function listener(event, arg){
      if(arg!==null){    
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
    ipcRenderer.send('request04', null);  
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
  exeBtnRandomData: function(){ 
    $('#btnRandomData').trigger('click');
  },  
  setBtnPositionData: function(){
    var s = this;    
    s.onOffBtnPositionData(false);    
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
  createResultCharts: function(){
    $('#chartResult').html('<div class="col-12" >Push Start button to simulate ...</div>');
    $('#chartResult').append('<div class="col-6" id="chartResult01" style="height: 50%;"></div>');
    $('#chartResult').append('<div class="col-6" id="chartResult02" style="height: 50%;"></div>');
    $('#chartResult').append('<div class="col-6" id="chartResult03" style="height: 50%;"></div>');
    $('#chartResult').append('<div class="col-6" id="chartResult04" style="height: 50%;"></div>');
    s.createHighStock('chartResult01','months');
    s.createHighStock('chartResult02','days');
    s.createHighStock('chartResult03','hours');
    s.createHighStock('chartResult04','mins');  
    s.resize();
  },
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
    s.exeBtnRandomData();   
  }
}
app.exe();   