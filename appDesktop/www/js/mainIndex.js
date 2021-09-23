var ipcRenderer = require('electron').ipcRenderer; 
var app = {
  //Terminal 
  timestampTerminal: undefined,
  setTerminal: function(){
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
  //General Event
  resize: function(){ 
    var s = this; 
    function size(){
      var h = $(window).innerHeight()-$('#menu').innerHeight()-10;
      $('#terminal').css({
        'height': h
      }); 
      $('#chart').css({
        'height': h
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
  listData: undefined,   
  getLoadListData: function(fnSuccess,fnFail){
    var s = this;
    ipcRenderer.send('request01', true);
    ipcRenderer.once('replyRequest01',function(event, arg){ 
      if(arg!==null||arg!==undefined){    
        s.listData=arg;  
        fnSuccess();
      }else{
        fnFail();
      } 
    }); 
  }, 
  setDataList: function(){
    var s = this; 
    $('#selectData').html(' ');
    $.each(s.listData,function(i,e){
      var namefile = e.split('\\');
      namefile = namefile[namefile.length-1];
      if(i===0){
        $('#selectData').append('<option value="'+e+'" selected>'+namefile+'</option>');
      }else{
        $('#selectData').append('<option value="'+e+'">'+e+'</option>');
      } 
    });          
  },
  setPlotBtn: function(){
    var s = this; 
    $('#plotBtn').on('click',function(){
      s.plot(); 
    });
  },
  readPlotData: function(file,fnSuccess,fnFail){
    $.ajax({
      url: file, 
      success: function (data){
        try{
          data = JSON.parse(data);
          fnSuccess(data);
        }catch(e){
          fnFail();
        } 
      },
      error: function (){
        fnFail();
      }
    });
  },
  plot: function(){ 
    var s = this; 
    function endPlot(err){
      s.hideLoadingModal();
      if(err){
        $('#chart').html('<div class="alert alert-danger" role="alert"><h4 class="alert-heading">Error</h4> <p>Ploting Data with plot type or reading data</p> <hr> <p class="mb-0">Try again!</p></div>'); 
        s.addTerminal('Error ploting or reading data'); 
      }else{
        s.addTerminal('ploting and reading data done'); 
      }
    }
    var plotType = parseInt($('#selectPlot').val());
    var plotData = $('#selectData').val();          
    s.showLoadingModal();
    $('#chart').html(' ');
    s.readPlotData(plotData,function(data){ 
      var namefile = plotData.split('\\');
      namefile = namefile[namefile.length-1];
      try{
        if(plotType===1){ //Candlestick 
          Highcharts.stockChart('chart', { 
            rangeSelector: {
              selected: 1
            }, 
            title: {
              text: ' '
            }, 
            credits: {
                enabled: false
            },
            chart: { 
              zoomType: 'x'
            },
            series: [{
              type: 'candlestick',
              name: namefile,
              data: data.data,
              dataGrouping: {
                units: [
                  [
                    'week', // unit name
                    [1] // allowed multiples
                  ], [
                    'month',
                    [1, 2, 3, 4, 6]
                  ]
                ]
              }
            }]
          });
          endPlot(); 
        }else{
          endPlot(true);
        } 
      }catch(err){
        endPlot(true);
      }
    },function(){
      endPlot(true);
    }); 
  },
  exe: function(){ 
    var s = this; 
    s.showLoadingModal();  
    s.setTerminal(); 
    s.addTerminal('start App!'); 
    s.setLoadingModal(); 
    s.setPlotBtn(); 
    s.resize(); 
    Snackbar.show({text: 'Getting Data ...'});
    s.getLoadListData(function(){
      s.hideLoadingModal();
      s.addTerminal('List data loaded'); 
      s.setDataList();
      Snackbar.show({text: 'List data loaded'});  
      $('#plotBtn').trigger('click');
    },function(){
      s.hideLoadingModal(); 
      s.addTerminal('Getting Data error');  
      Snackbar.show({text: 'Getting Data error'});
    });
  }
}
app.exe();