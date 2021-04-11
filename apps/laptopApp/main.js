function calcInfo(){
  var os = require('os');  
  var info = {}
  console.log('Start calcInfo');
  info.cpus = [];
  os.cpus().forEach(function(e){
    info.cpus.push(e.model);
  }); 
  info.cpuModel = info.cpus[0],
  info.cpuN = info.cpus.length 
  delete info.cpus;
  info.hostname = os.hostname();  
  info.os = os.platform()+' - '+os.type(); 
  info.user = os.userInfo().username; 
  info.tmpDir = os.tmpdir(); 
  info.timeon = os.uptime();   
  info.timeonStr = 'HH:mm:ss'; 
  
  var ss = info.timeon%60;
  var mm = Math.floor((info.timeon/60)%60);
  var hh = Math.floor((info.timeon/60/60)%24);
  var dd = Math.floor(info.timeon/60/60/24);
  info.timeonStr = dd+'d '+hh+':'+mm+':'+ss;
  
  console.log('End calcInfo'); 
  return info;
}  
//calcInfo();
 
var electron = require('electron');
var path = require('path');
var url = require('url');

electron.app.on('window-all-closed', function() { 
  if(process.platform!=='darwin') {
    electron.app.quit();
  }
});

electron.app.on('ready', function() {   
  var mainWindow = new electron.BrowserWindow({ 
    width: 800,
    minWidth: 600,
    height: 600,    
    minHeight: 500, 
    backgroundColor: '#ced4da' 
  }); 

  function reload(){
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname,'/www/index.html'),
      protocol: 'file',
      slashes: true
    }));
  }
  function devTools(){
    if(mainWindow.webContents.isDevToolsOpened()){
      mainWindow.webContents.closeDevTools(); 
    }else{
      mainWindow.webContents.openDevTools(); 
    }
  }
  
  mainWindow.on('closed', function() { 
    mainWindow = null;
  });         

  electron.Menu.setApplicationMenu(null);
  var menu = electron.Menu.buildFromTemplate([{
    label: 'Menu',
    submenu: [{
      label:'DevTools',
      click: devTools
    },{
      label:'Reload',
      click: reload
    },{
      type:'separator'
    },{
      label:'Exit',
      click: function(){
        electron.app.quit();
      }
    }]
  }]);
  electron.Menu.setApplicationMenu(menu);  
  
  //Init
  reload();  
  //mainWindow.maximize();
  
  electron.ipcMain.on('request01',function(event,arg){
    if(arg){  
      console.log('request01 (startData)'); 
      var info = calcInfo();
      event.sender.send('replyRequest01',info); 
    }
  });  

});  
/**/