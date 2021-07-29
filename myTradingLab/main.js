var electron = require('electron');
var path = require('path');
var url = require('url');
var fs = require('fs');
var folderData = 'dataResult';

function readData2Plot(){
  var list = []; 
  var directoryPath = undefined; 
  if(process.env.PORTABLE_EXECUTABLE_DIR){
    directoryPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR,folderData);
  }else{ 
    directoryPath = path.join(__dirname, folderData); 	
  }   
  /*
  electron.dialog.showMessageBox(null,{
    type: 'info',  
    title: 'Alert',
    message: 'directoryPath',
    detail: directoryPath,  
  });
  */     

  console.log('readData2Plot exe');
  fs.readdirSync(directoryPath).forEach(function (file) {
    console.log(file);
    list.push(path.join(directoryPath,file));
  }); 
  return list;
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
      console.log('request01 (readData2Plot)'); 
      var list = readData2Plot();
      event.sender.send('replyRequest01',list); 
    }
  });  

});  
/**/