var ipcRenderer = require('electron').ipcRenderer;
var dm = {
  data: undefined,   
  getStart: function(fnSuccess,fnFail){
    var s = this;
    ipcRenderer.send('request01', true);
    s.data = undefined; 
    ipcRenderer.once('replyRequest01',function(event, arg){
      if(arg!==null||arg!==undefined){    
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
  addTerminal: function(text,removeclass){
    var time = new Date()-this.timestampTerminal;
    time = (Math.floor(time/60/60/1000)<10?'0'+Math.floor(time/60/60/1000):Math.floor(time/60/60/1000))+
    ':'+(Math.floor(time/60/1000%60)<10?'0'+Math.floor(time/60/1000%60):Math.floor(time/60/1000%60))+
    ':'+(Math.floor(time/1000%60)<10?'0'+Math.floor(time/1000%60):Math.floor(time/1000%60));
    var cl = '';
    if (removeclass===true){
      cl = 'removeTerminalIntro';
    }
    $('.removeTerminalIntro').remove();
    $('#terminal').append('<p class="'+cl+'">('+time+') > '+text+'</p>'); 
    var scrollSize = $('#terminal').height();
    $('#terminal p').each(function(){
      scrollSize = scrollSize + $(this).height();
    })
    $('#terminal').animate({ 
      scrollTop: scrollSize 
    },100); 
  }, 
  //Modal Loading
  exeModal: true, 
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
  //Btn2Terminal
  addReloadBtn2Terminal: function (){
    action.addTerminal('');
    action.addTerminal('<button type="button" class="btn btn-secondary  btn-sm btnTerminal" value="sell"><i class="fa fa-reload"></i> Reload</button>');
    action.addTerminal('');
    $('.btnTerminal').off('click');
    $('.btnTerminal').on('click',function(){ 
      ipcRenderer.send('request03', null);
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
            if(
              (s.pos.on===true&&s.pos.buySell==='buy'&&s.pos.openprice>event.yAxis[0].value)||
              (s.pos.on===true&&s.pos.buySell==='sell'&&s.pos.openprice<event.yAxis[0].value)
            ){  
              s.pos.stprice=Math.round(event.yAxis[0].value*10000)/10000;
              chart.yAxis[0].removePlotLine('stop');
              action.addTerminal('Stop price: '+s.pos.stprice,true);
              chart.yAxis[0].addPlotLine({
                value: event.yAxis[0].value,
                color: 'red',
                width: 2,
                id: 'stop'
              });
            }
            if(
              (s.pos.on===true&&s.pos.buySell==='buy'&&s.pos.openpriceSpread<event.yAxis[0].value)||
              (s.pos.on===true&&s.pos.buySell==='sell'&&s.pos.openpriceSpread>event.yAxis[0].value)
            ){
              s.pos.liprice=Math.round(event.yAxis[0].value*10000)/10000;
              chart.yAxis[0].removePlotLine('limit');
              action.addTerminal('Limit price: '+s.pos.liprice,true);
              chart.yAxis[0].addPlotLine({
                value: event.yAxis[0].value,
                color: 'green',
                width: 2,
                id: 'limit'
              }); 
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
  plotChartResult: function(){

  },
  //postion 
  pos: {
    on: false,
    buySell: undefined,
    openprice: undefined,
    spread: 0.00006,   
    openpriceSpread: undefined,
    stprice: undefined, 
    liprice: undefined,
    stpricept: undefined, 
    lipricept: undefined,
  },
  calPos: function(pos){
    if(pos.buySell==='buy'){
      pos.openpriceSpread = Math.round((pos.openprice+pos.spread)*10000)/10000; 
      pos.stpricept = Math.round((pos.openpriceSpread-pos.stprice)*100000)/10;
      pos.lipricept = Math.round((pos.liprice-pos.openpriceSpread)*100000)/10;
    }
    if(pos.buySell==='sell'){
      pos.openpriceSpread = Math.round((pos.openprice-pos.spread)*10000)/10000;  
      pos.lipricept = Math.round((pos.openpriceSpread-pos.liprice)*100000)/10;
      pos.stpricept = Math.round((pos.stprice-pos.openpriceSpread)*100000)/10;
    }
    return pos;
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
      var btnBuy  = '<button type="button" class="btn btn-success btn-sm btnTerminal" value="buy"><i class="fa fa-bar-chart"></i> Buy</button>';
      var btnSell = '<button type="button" class="btn btn-danger  btn-sm btnTerminal" value="sell"><i class="fa fa-bar-chart"></i> Sell</button>';
      action.addTerminal('Open Position: '+btnBuy+' '+btnSell);
      $('.btnTerminal').off('click'); 
      $('.btnTerminal').on('click',function(){ 
        s.pos.on=true;
        s.pos.buySell=$(this).attr('value'); 
        s.pos.openprice=Math.round(dm.data[dm.data.length-1][4]*10000)/10000;  
        s.pos = s.calPos(s.pos);
        s.chart.yAxis[0].addPlotLine({
          value: s.pos.openprice,
          color: 'grey',
          width: 1,
          id: 'open'
        }); 
        s.chart.yAxis[0].addPlotLine({
          value: s.pos.openpriceSpread,
          color: 'black',
          width: 1,
          id: 'openSpread'
        });
        action.addTerminal($(this).attr('value')+ ' (Reload to reset)'); 
        $('button').remove();  
        action.addTerminal('Now set Stop and limit and press <button type="button" class="btn btn-secondary btn-sm btnTerminal"><i class="fa fa-play"></i> Go!</button>');     
        $('.btnTerminal').off('click');
        $('.btnTerminal').on('click',function(){ 
        action.addTerminal('Go!'); 
        s.pos = s.calPos(s.pos);
        action.addTerminal('Resumen posición: '+s.pos.buySell);         
        action.addTerminal(' * Open: '+s.pos.openprice);             
        action.addTerminal(' * Open: '+s.pos.openpriceSpread+' ('+(s.pos.buySell==='buy'?'+':'-')+'spread='+s.pos.spread+')');     
        action.addTerminal(' * Stp: '+s.pos.stprice+' -> pt: '+s.pos.stpricept);        
        action.addTerminal(' * Lim: '+s.pos.liprice+' -> pt: '+s.pos.lipricept);  
        s.pos.on=false;
        $('button').remove();  

        action.showLoadingModal();  
        Snackbar.show({text: 'Getting simulation position ...'}); 
        dm.getSimulation(function(res){
          action.hideLoadingModal();
          Snackbar.show({text: 'Data Simulation Loaded'}); 
          action.addTerminal('Data Simulation Loaded'); 
          s.plotChartResult(res);
          action.addReloadBtn2Terminal();
        },function(){
          action.hideLoadingModal();
          Snackbar.show({text: 'Data Simulation error'}); 
          action.addTerminal('Data Simulation error');
          action.addReloadBtn2Terminal();
        },s.pos);   
        });  
      }); 
    },function(){
      action.hideLoadingModal();
      Snackbar.show({text: 'Getting Data error'}); 
      action.addTerminal('Getting Data error');      
      action.addReloadBtn2Terminal();
    });
  }
}

action.init();
app.exe();   
