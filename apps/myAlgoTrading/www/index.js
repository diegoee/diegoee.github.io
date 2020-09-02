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
  resize: function(){ 
    var s = this; 
    $('#terminal').css({
      'height': $('#comboContainer').innerHeight() 
    }); 
    $(window).off('resize'); 
    $(window).on('resize',function(){  
      $('#terminal').css({
        'height': $('#comboContainer').innerHeight() 
      });  
    }); 
  },
  exe: function(){ 
    var s = this;      
    s.startTerminal(); 
    s.addTerminal('start!'); 
    s.disableAllButton();  
    s.setBtnRefresh();   
    s.setBtnDebug(); 
    s.setBtnRandomData();
    s.setLoadingModal();
    s.resize();    
    s.exeBtnRandomData();   
  }
}
app.exe();  

function createChart(){
  var s = this;
  s.chart = Highcharts.stockChart('chart', { 
    title: {
      text: ''
    },  
    loading: {
      hideDuration: 500,
      showDuration: 500
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
    rangeSelector: {
      buttons: [{
        type: 'all',
        count: 1,
        text: 'All'
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
        type: 'week',
        count: 1,
        text: '1w'
      },{
        type: 'day',
        count: 1,
        text: '1D'
      },{
        type: 'hour',
        count: 4,
        text: '4h'
      },{
        type: 'hour',
        count: 1,
        text: '1h'
      },{
        type: 'minute',
        count: 30,
        text: '30mi'
      },{
        type: 'minute',
        count: 5,
        text: '5mi'
      }],
      selected: 0,
      inputEnabled: false
    }, 
    series: [{
      name: $('#selectTradeMark option:selected').text(),
      type: 'candlestick',
      data: [],
      tooltip: {
        valueDecimals: 4
      }
    }]
  });
}

function setBtnPlayChart(){ 
  var s = this;    
  $('#btnOn').prop('disabled', false);
  $('#btnFast').prop('disabled', true); 
  var s = this;  
  $('#btnOn').on('click',function(){ 
    if($(this).hasClass('btn-success')){
      $(this).removeClass('btn-success');
      $(this).addClass('btn-danger');
      $(this).html('<i class="fas fa-stop"></i> <i class="fas fa-chart-line"></i>'); 
      $('#btnFast').prop('disabled', false);   
      s.addTerminal('On:  PlayChart');  
      s.exeStartChart();
    }else{
      $(this).addClass('btn-success');
      $(this).removeClass('btn-danger');
      $(this).html('<i class="fas fa-play"></i> <i class="fas fa-chart-line"></i>'); 
      $('#btnFast').prop('disabled', true); 
      s.tempo=1;
      $('#btnFast').html('<i class="fas fa-forward"></i> x'+s.tempo); 
      s.addTerminal('Off: PlayChart'); 
      s.exeStopChart();  
    }
  });
  s.tempo = 1;
  $('#btnFast').on('click',function(){   
    s.tempo++;
    $(this).html('<i class="fas fa-forward"></i> x'+s.tempo); 
    s.addTerminal('tempo x'+s.tempo); 
    s.exeStopChart();  
    s.exeStartChart();  
    if(s.tempo>4){
      s.tempo=0;
    }
  });   
}

function exeStartChart(){ 
    var s = this;  
    var time = 1000/s.tempo;  
    $('#selectDate').prop('disabled', true);  
    $('#selectTradeMark').prop('disabled', true);  
    this.intervalChart = setInterval(function (){ 
      if(s.data[1].length===0){
        s.exeBtnPlayChart();
      }else{ 
        var point = s.data[1].shift()
        s.data[0].push(point);       
        s.chart.series[0].addPoint(point);
        s.chart.redraw(); 
      }
    },time);   
}

function setDataOnChart(){
    var s = this;
    s.exeStopChart();
    for (var i=5; i>0 ;i--){
      $('#selectDate').append('<option value="20200'+i+'">20200'+i+'</option>');
    }
    $('#selectDate').on('change',function(){
      var yyyymm = $('#selectDate').val();
      s.addTerminal('date: '+yyyymm);   
      s.getData(yyyymm).then(function(){ 
        var n = 10; //s.getRndInteger(1,10);  
        s.data = [
          s.data.slice(0, Math.round(s.data.length/n)-1),
          s.data.slice(Math.round(s.data.length/n), s.data.length-1)
        ];  
        s.chart.series[0].setData([]);
        s.chart.series[0].setData(s.data[0]);   
        s.chart.redraw(); 
        s.resize(); 
      });  
    });
    s.exeBtnData();
} 
