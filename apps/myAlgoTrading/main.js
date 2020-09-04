var electron = require('electron');
var path = require('path');
var url = require('url');
var fs = require('fs');
var moment = require('moment');
const { min } = require('moment');

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;  
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

  reload(); 
  devTools();

  mainWindow.on('closed', function() { 
    mainWindow = null;
  });   
     
  Menu.setApplicationMenu(null);   

  ipcMain.on('request01',reload);
  ipcMain.on('request02',devTools);
  ipcMain.on('request03',function(event,arg){
    if(arg){  
      lastValue = Math.floor((Math.random() * Math.floor(data.length*0.85)) + Math.floor(data.length*0.15));
      var firstValue = Math.floor(lastValue-Math.floor(data.length*0.15)); 
      event.sender.send('replyRequest03',data.slice(firstValue, lastValue)); 
    }
  }); 
  ipcMain.on('request04',function(event,arg){
    if(arg){ 
      var info = data[lastValue];
      if(lastValue<data.length){
        info = data[lastValue];
        lastValue++; 
      }else{
        info.end=true
      }
      event.sender.send('replyRequest04',info); 
    }
  });

});  

 