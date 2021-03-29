var electron = require('electron');
var path = require('path');
var url = require('url');
var fs = require('fs');  

var data  = [];
var lastValue = 0;
var endValue = 0;
var pos = undefined;

function loadData(){
  var files = [];
  data = [];
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
 

//[ 1483326300000, 1.04765, 1.0478, 1.04765, 1.04778 ]
//[ time,          open,    high,   low,     close   ]
//arg: data, lastValue, pos
function calcSimulation(){
  console.log('Start calcSimulation');
  console.log(pos);
  console.log('Start value: '+data.length+'/'+lastValue);
  var exit = false;
  var i = lastValue+1; 
  while(!exit){ 
    endValue=i;
    if(pos.buysell==='buy'){
      if(data[i][2]>=pos.liprice||data[i][2]>=pos.stprice){
        exit=true;
      }
    }
    if(pos.buysell==='sell'){
      if(data[i][2]<=pos.stprice||data[i][2]<=pos.liprice){
        exit=true;
      } 
    }
    if (i>=data.length){ 
      exit=true;
    }else{
      i++;
    } 
  } 
  console.log('End   value: '+data.length+'/'+endValue);
  console.log('End calcSimulation');
}

lastValue = 10000; 
pos = { 
  buySell: 'sell',
  liprice: 1.0508,
  lipricept: 44,
  on: false,
  openprice: 1.0553,
  openpriceSpread: 1.0552,
  spread: 0.00006,
  stprice: 1.0626,
  stpricept: 74 
}; 
calcSimulation();

 
electron.app.on('window-all-closed', function() { 
  if(process.platform!=='darwin') {
    electron.app.quit();
  }
});

electron.app.on('ready', function() {   
  var mainWindow = new electron.BrowserWindow({ 
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
  //devTools();
  mainWindow.maximize();
  
  electron.ipcMain.on('request01',function(event,arg){
    if(arg){  
      console.log('request01 (startData)');
      lastValue = Math.floor((Math.random() * Math.floor(data.length)) + 0);  
      console.log('lastValue: '+lastValue); 
      event.sender.send('replyRequest01',data.slice(0, lastValue)); 
    }
  }); 
  electron.ipcMain.on('request02',function(event,arg){ 
    if(arg){
      console.log('request02 (calcSimulation)');
      pos = arg; 
      calcSimulation(); 
      event.sender.send('replyRequest02',{
        data: data.slice(0,endValue),
        pos: pos 
      });  
    }
  });
  electron.ipcMain.on('request03',function(){ 
    console.log('request03 (reload)');
    reload();   
  }); 

});  
 