var ipcRenderer = require('electron').ipcRenderer; 
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
      $('#terminal').css({
        'height': $(window).innerHeight()*1/3
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
  info: undefined,   
  getStart: function(fnSuccess,fnFail){
    var s = this;
    ipcRenderer.send('request01', true);
    s.data = undefined; 
    ipcRenderer.once('replyRequest01',function(event, arg){ 
      if(arg!==null||arg!==undefined){    
        s.info=arg;  
        fnSuccess();
      }else{
        fnFail();
      } 
    }); 
  }, 
  exe: function(){ 
    var s = this; 
    s.startTerminal(); 
    s.addTerminal('start App!'); 
    s.setLoadingModal(); 
    s.resize();
    s.showLoadingModal();   
    Snackbar.show({text: 'Getting Data ...'});
    s.getStart(function(){
      s.hideLoadingModal();
      Snackbar.show({text: 'Info loaded'});  
      s.addTerminal(' '); 
      s.addTerminal('CPU: '+s.info.cpuModel);  
      s.addTerminal('N core CPU: '+s.info.cpuN);  
      s.addTerminal('OS: '+s.info.os);  
      s.addTerminal('Laptop Name : '+s.info.user); 
      s.addTerminal('User Name : '+s.info.hostname);   
      s.addTerminal('Temp folder laptop: '+s.info.tmpDir);  
      s.addTerminal(' '); 
      $('#info').html('<div class="jumbotron"><p class="lead">Time latop on</p><hr class="my-4"><h1 class="">'+s.info.timeonStr+'</h1></div>');  
    },function(){
      s.hideLoadingModal();
      Snackbar.show({text: 'Getting Data error'}); 
      s.addTerminal('Getting Data error');  
    });
  }
}
app.exe();   
