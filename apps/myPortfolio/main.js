var electron = require('electron');
var path = require('path');
var url = require('url');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;  
var ipcMain = electron.ipcMain;  
 
ipcMain.on('request1',function(event, arg){
  if(arg){ 
    var data = undefined; 
    event.sender.send('reply1', data); 
    require('./appPortfolio').exe().then(function(data){ 
      event.sender.send('reply1', data); 
      console.log('data sent');
    }).catch(function(e){ 
      console.log('Error in appPortfolio.js promise');
      console.log(e);
    });     
  } 
}); 

app.on('window-all-closed', function() { 
  if(process.platform !='darwin') {
    app.quit();
  }
});

app.on('ready', function() {   
  var mainWindow = new BrowserWindow({
    title: 'My Portfolio',
    width: 1200,
    minWidth: 400,
    height: 700,    
    minHeight: 400,
    icon: path.join(__dirname, 'icons/ic_launcher.ico'), 
    backgroundColor: '#ced4da'
  });  
  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'/www/index.html'),
    protocol: 'file',
    slashes: true
  }));

  mainWindow.on('closed', function() { 
    mainWindow = null;
  });   

  var templateMenu=[
    {
      label: 'Menu',
      submenu:[ 
        {
          label: 'Dev Tools',
          click: function(e){
            if (mainWindow!==null){ 
              if(mainWindow.webContents.isDevToolsOpened()){ 
                mainWindow.webContents.closeDevTools(); 
              }else{  
                mainWindow.webContents.openDevTools(); 
              }
            }
            menu = Menu.buildFromTemplate(templateMenu);
            Menu.setApplicationMenu(menu);  
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          click: function(){
            if (mainWindow!==null){
              mainWindow.close();
            }
            app.quit();
          }
        },
      ]
    }
  ];

  //templateMenu[0].submenu[2].label = 'Dev Tools';
  mainWindow.webContents.openDevTools(); 

  var menu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menu);  

});  