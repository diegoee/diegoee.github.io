var electron = require('electron');
var path = require('path');
var url = require('url');
var fs = require('fs'); 

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;  
var dialog  = electron.dialog ;  
var ipcMain = electron.ipcMain;  

var data  = [];
var lastValue = 0;
function loadData(){
  var files = [];
  fs.readdirSync('data').forEach(function(file){
    files.push('data/'+file);
  });  
  var aux = undefined;
  files.forEach(function(file){ 
    aux=aux+fs.readFileSync(file);
  }); 
  aux=aux.replace(/\n/g,';').replace(/ /g,'').replace(/undefined/g,'').split(';');  
  for (var i=0; i<aux.length; i=i+6){
    //'20170102020000' 
    //x,open,high,low,close
    data.push([
      (new Date(parseInt(aux[i].substring(0,4)), 
        parseInt(aux[i].substring(4,6))-1, 
        parseInt(aux[i].substring(6,8)), 
        parseInt(aux[i].substring(8,10)), 
        parseInt(aux[i].substring(10,12)), 0)).getTime(),
      parseFloat(aux[i+1]),
      parseFloat(aux[i+2]),
      parseFloat(aux[i+3]),
      parseFloat(aux[i+4])
    ]); 
  }    
  console.log('Data Loaded: l='+aux.length);   
}   
loadData();

app.on('window-all-closed', function() { 
  if(process.platform !='darwin') {
    app.quit();
  }
});

app.on('ready', function() {   
  var mainWindow = new BrowserWindow({ 
    width: 1200,
    minWidth: 400,
    height: 800,    
    minHeight: 700, 
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

  Menu.setApplicationMenu(null);
  var menu = Menu.buildFromTemplate([{
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
            app.quit();
          }
        }]
  }]);
  Menu.setApplicationMenu(menu);  
  
  //Init
  reload();  
  //devTools();
  mainWindow.maximize();
  
  ipcMain.on('request01',function(event,arg){
    if(arg){  
      lastValue = Math.floor((Math.random() * Math.floor(data.length)) + 0); 
      lastValue = 10000;
      event.sender.send('replyRequest01',data.slice(0, lastValue)); 
    }
  }); 
  ipcMain.on('request02',function(event,arg){
    if(arg){
      setTimeout(function(){ 
        event.sender.send('replyRequest02',null); 
      },5000);
    }
  });

});  

 