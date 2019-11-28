var electron = require('electron');
var path = require('path');
var url = require('url');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;  
var ipcMain = electron.ipcMain;  

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
    icon: path.join(__dirname, '/www/icons/ic_launcher.ico'), 
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
          label: 'Reload Data', 
          enabled: true,
          click: function(e){ 
            mainWindow.loadURL(url.format({
              pathname: path.join(__dirname,'/www/index.html'),
              protocol: 'file',
              slashes: true
            }));
          }
        },{
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
 
  Menu.setApplicationMenu(Menu.buildFromTemplate(templateMenu));  
  function enableReloadButton(flag){
    templateMenu[0].submenu[0].enabled = flag;
    Menu.setApplicationMenu(Menu.buildFromTemplate(templateMenu));
  }
  
  ipcMain.on('requestStart',function(event, arg){ 
    if(arg!==undefined){   
      enableReloadButton(false);    
      var data = undefined;  
      require('./appPortfolio').exe(function(log){
        event.sender.send('replyConsole','TERMINAL: '+log);
      },arg).then(function(data){ 
        event.sender.send('replyConsole','TERMINAL: data sent');
        console.log('data sent'); 
        event.sender.send('replyStart', data);  
        enableReloadButton(true);         
      }).catch(function(e){ 
        console.log('Error in appPortfolio.js promise');
        console.log(e);  
        enableReloadButton(true);    
      });     
    }
  });

});  