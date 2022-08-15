var ipcRenderer = require('electron').ipcRenderer; 
var app = {
  //aux fn
  parseInt: function (str){
    var n = null; 
    if(typeof str==='string'){
        n=parseInt(str.replace('.','').replace(',','.'));
    }else{
        n=str;
    } 
    return n; 
  },
  parseFloat: function (str){
      var n = null; 
      if(typeof str==='string'){ 
          n=parseFloat(str.replaceAll('.','').replace(',','.'));
      }else{
          n=str;
      }  
      return n;
  }, 
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
  listData: [],   
  timerData: undefined,
  getData: function(fnSuccess,fnFail){
    var s = this;
    ipcRenderer.send('request01', true);
    ipcRenderer.once('replyRequest01',function(event, arg){ 
      if(arg!==null||arg!==undefined){    
        s.listData.push(arg);  
        fnSuccess();
      }else{
        fnFail();
      } 
    }); 
  },  
  setPlayBtn: function(){
    var s = this;  
    var counter = 0;
    var limit = s.parseInt($('#selectData').val()); 
    $('#playBtn').on('click',function(){  
      $('#playBtn').attr('disabled',true); 
      limit = s.parseInt($('#selectData').val()); 
      s.addTerminal('start getJoke exe'); 
      counter = 0;
      function play(){
        s.getData(function(){
          Snackbar.show({text: 'Added new joke'});
          s.addTerminal('added new joke');  
          s.plotData();   
          counter++;
          if(counter>=limit){
            clearInterval(s.timerData); 
            s.addTerminal('end getJoke exe');
            $('#playBtn').attr('disabled',false);   
          }
        },function(){ 
          Snackbar.show({text: 'Error getting joke'}); 
          s.addTerminal('Error getting joke');  
        });
      }

      play();
      s.timerData = setInterval(play,5000);  

    });
  },
  plotData: function(){
    $('#plot').html(' ');
    for(var i=0; i<this.listData.length; i++){
      $('#plot').prepend('<div class="alert alert-secondary" role="alert">'+this.listData[i]+'</div>');
    }
  },  
  exe: function(){ 
    var s = this; 
    s.showLoadingModal();  
    s.setTerminal(); 
    s.addTerminal('start App!'); 
    s.setLoadingModal(); 
    s.setPlayBtn(); 
    s.resize(); 
    s.hideLoadingModal();
    Snackbar.show({text: 'App Ok'});
    $('#playBtn').trigger('click'); 
  }
}
app.exe();