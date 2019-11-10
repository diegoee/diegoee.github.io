/*globals require, console, clearInterval, setInterval, Promise, module*/ 
var mth = {
  //ATRIBUTES
  url: 'https://demo-api.ig.com/gateway',
  loginInfo: undefined, 
  param: undefined, 
  nameLog: undefined,
  outputFolder: '../output', 
  inputLoginFile: '../input/loginInfo.txt', 
  outputDataLog: 'datalog.json',  
  ig: undefined,
  spread: 0.00006,
  method:[{
    id: 'mth00',
    desc: 'Random - 1 pos'
   },{
    id: 'mth01',
    desc: 'BUY/SELL pend price - 1 pos - MINUTE_5 12*3'   
    },{
    id: 'mth02',
    desc: 'BUY/SELL pend price - inf pos - HOUR 24*3'   
  }],
  stopIncVal:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,35,40,45,50,100,200],
  limIncVal:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,35,40,45,50,100,200], 
  //GENERAL FUNCTIONS
  log: function(txt){
    var fs = require('fs');  
    var path = require('path');  
    fs.appendFileSync(path.join(path.resolve()+'/'+mth.nameLog), (new Date()).toISOString().substring(0, 19).replace(/T/g,' ')+' -> '+txt+'\n', 'utf8');
    console.log(txt);
  }, 
  init: function(ver){ 
    var fs = require('fs');
    var path = require('path');     
    mth.ig = require('./igAPI');
    
    var output = path.join(path.resolve()+'/'+mth.outputFolder);
    if (!fs.existsSync(output)){
      fs.mkdirSync(output);
    } 
    var dateFile = (new Date()).toISOString().substring(0, 19).replace(/:|T|-/g,'_');   
    mth.nameLog = mth.outputFolder+'/log_'+dateFile+'.txt';
    fs.writeFileSync(
      path.join(path.resolve()+'/'+mth.outputFolder+'/'+mth.outputDataLog),
      JSON.stringify({name: mth.nameLog}), 'utf8'
    ); 
    
  },
  //MTHs  
  intervalMethod: undefined, 
  paramMethod: {
    method: 'mth00',
    stopInc: 5,
    limInc: 5
  },
  exe: function(method,stopInc,limInc){  
    mth.paramMethod.method=(method===null||method===undefined)?mth.method[0].id:method
    mth.paramMethod.stopInc=(stopInc===null||stopInc===undefined)?mth.stopIncVal[8]:stopInc;
    mth.paramMethod.limInc=(limInc===null||limInc===undefined)?mth.limIncVal[8]:limInc;   
    if (mth.intervalMethod===undefined){ 
      mth.init();
      mth.startMethod();
      return true;
    }else{
      mth.stopMethod();
      return false;
    }
  },
  stopMethod: function(){
    clearInterval(mth.intervalMethod);
    mth.intervalMethod = undefined;
    mth.log('');
    mth.log(' --- Method: Stop');
  }, 
  startMethod: function (){  
    mth.log('');
    mth.log(' --- Method: Start'); 
    var timeSync = 5*60*1000; //5min 
    var marketName = 'EUR/USD Mini';
    var search = 'forex';
    
    var inc = {
      limit: mth.paramMethod.limInc,
      stop: mth.paramMethod.stopInc,
    };
    var method = mth.paramMethod.method;
    
    mth.log(' mth: '+method);
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
module.exports = mth; 