/*globals require, console, clearInterval, setInterval, Promise, module*/ 
var mth = {
  //ATRIBUTES
  param: undefined, 
  nameLog: undefined, 
  outputFolder: 'output', 
  ig: undefined,
  spread: 0.00006,
  //GENERAL FUNCTIONS
  log: function(txt){
    var fs = require('fs');  
    var path = require('path');  
    fs.appendFileSync(path.join(path.resolve()+'/'+mth.nameLog), (new Date()).toISOString().substring(0, 19).replace(/T/g,' ')+' -> '+txt+'\n', 'utf8');
    console.log(txt);
  }, 
  init: function(user,pass,nameLog){ 
    var fs = require('fs');
    var path = require('path');     
    mth.ig = require('./igAPI');
    mth.ig.init(user,pass);
    
    var output = path.join(path.resolve()+'/'+mth.outputFolder);
    if (!fs.existsSync(output)){
      fs.mkdirSync(output);
    } 
    var dateFile = (new Date()).toISOString().substring(0, 19).replace(/:|T|-/g,'_');   
    mth.nameLog = mth.outputFolder+'/log_'+nameLog+'_'+dateFile+'.txt';
    
  },   
  exe: function (user,pass,nameLog){ 
    mth.init(user,pass,nameLog); 
    mth.log('');
    mth.log(' --- Exe'); 
    var timeSync = 5*60*1000; //5min 
    var marketName = 'EUR/USD Mini';
    var search = 'forex';
    
    var inc = {
      limit: 5,
      stop: 5,
    }; 
    
    mth.log(' Name: '+nameLog);
    mth.log(' limit: '+inc.limit);
    mth.log(' stop: '+inc.stop);
    
    var prices = [];
    var dir = 'NONE';
 
    mth.ig.getMarketEpic(search,marketName).then(function(idMarket){ 
      mth.log(search+' '+marketName+' -> '+idMarket);  
      async function start(count){ 
        var openPos = false; 
        dir = 'NONE'; 
        await mth.ig.getOpenPos(idMarket).then(function(data){
          openPos = !data;
        }); 
        if (method===mth.method[1].id){
          if (!openPos){
            prices = [];
            var slotInterval = 12*3;
            var slot = 'MINUTE_5';
            await mth.ig.getHisPrice(idMarket,slot,slotInterval).then(function(data){
              prices=data;
            }).catch(function(res){
              mth.log('getHisPrice');
              mth.log(res);
            }); 
            if (prices.length!==0){
              dir = mth.logicSlopeMean(prices);
            }
            dir = ('BUY'===dir||'SELL'===dir)?dir:'NONE'; 
          }
        }else if(method===mth.method[2].id) {
          openPos = false;
          prices = [];
          var slotInterval = 24*3;
          var slot = 'HOUR';
          await mth.ig.getHisPrice(idMarket,slot,slotInterval).then(function(data){
            prices=data;
          }).catch(function(res){
            mth.log('getHisPrice');
            mth.log(res);
          }); 
          if (prices.length!==0){
            dir = mth.logicSlopeMean(prices);
          }
          dir = ('BUY'===dir||'SELL'===dir)?dir:'NONE'; 
        }else{
          dir = (Math.floor(Math.random()*2)+1)===1?'BUY':'SELL'; 
        }  
        
        // open Position
        if (dir!=='NONE'&&!openPos){
          mth.ig.createPosition(dir,idMarket,inc).then(function(info){
            if (info!==undefined){
              mth.log('Pos created: type='+info.type+' dealStatus='+info.dealStatus+' reason='+info.reason);  
            }
          }).catch(function(res){ 
            mth.log('createPosition');
            mth.log(res);
          });  
        }else{
          mth.log('Pos not created: dir='+dir+' openPos?='+openPos);
        }        
      }
      var count = 0;
      start(count);
      mth.intervalMethod = setInterval(function(){
        count++; 
        start(count);
      },timeSync);  
      
    }).catch(function(res){ 
      mth.log('getMarketEpic');
      mth.log(res);
    });  
  },
  //MTH LOGIC 
  logicSlopeMean: function(prices){
    var i = 0;
    for (i=0; i<prices.length; i++){
      prices[i].timeDate = (new Date(prices[i].snapshotTimeUTC)).getTime()         
    }
    prices.sort(function(a, b){
      return b.timeDate-a.timeDate
    });
    
    var med = [];   
    var time = [];
    for (i = 0; i<prices.length; i++){
      med.push((prices[i].closePrice.bid+prices[i].closePrice.ask)/2);  
      time.push(prices[i].timeDate);  
    } 

    var ml = require('ml');  
    var reg = new ml.SimpleLinearRegression(time,med); 
    var type = 'NONE';  
    
    //ckeck SELL or BUY
    if(reg.slope<0){
      type ='SELL';
    }else{
      type ='BUY';
    } 
    
    return type; 
  }
}; 

var namefile = 'test';
var user = undefined;
var pass = undefined;


process.argv.forEach(function(val,index) {  
  if (index===2&&(val!==undefined||val!==null||val!=='')){
    namefile = val;
  } 
});

user='';
pass='';
mth.exe(user,pass,namefile); 

/*
var readline = require('readline');
var writable = require('stream').Writable;
var mutableStdout = new writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted)
      process.stdout.write(chunk, encoding);
    callback();
  }
});
mutableStdout.muted = false;
var readline = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
}); 

console.log('File Name: '+namefile);
readline.question('User: ',function(data){
  user=data; 
  readline.question('Pass: ',function(data){
    pass=data;  
    mth.exe(user,pass,namefile);
    mutableStdout.muted = false;    
    readline.close()
  }); 
  mutableStdout.muted = true;
});

*/