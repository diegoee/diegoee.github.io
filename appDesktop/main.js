var electron = require('electron');
var path = require('path');
var url = require('url'); 
var request = require('request'); 
 
function getDataByAPI(){ 
  return new Promise(function (resolve, reject){
    console.log('getDataByAPI exe');
    var url = 'https://v2.jokeapi.dev/joke/Any?lang=en&safeMode'   
    request({
      url: url,
      method: 'GET' 
    }, function(err, res, body) {
      var json = JSON.parse(body); 
      var data = ':('; 
      if(json.type==='single'){
        data=json.category+':<br>'+json.joke;
      } 
      if(json.type==='twopart'){
        data=json.category+':<br>-'+json.setup+'<br>-'+json.delivery;
      }
      resolve(data);
    });
  });;
}    

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
      accelerator: 'F12', //darwin=MACOS
      click: devTools
    },{
      label:'Reload',
      accelerator: 'F5', 
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
      console.log('request01'); 
      getDataByAPI().then(function(data){ 
        event.sender.send('replyRequest01',data); 
      }).catch(function(data){ 
        event.sender.send('replyRequest01','Error getting Data.'); 
      });;
    }
  });  

});  
/**/