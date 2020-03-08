/*globals require, console, clearInterval, setInterval, Promise, module*/ 
var mth = {
  //ATRIBUTES
  param: undefined, 
  nameLog: undefined, 
  outputFolder: 'output', 
  ig: undefined,
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
  exe: async function (user,pass,nameLog){ 
    mth.init(user,pass,nameLog); 
    mth.log('');
    mth.log(' --- Exe');     

    await mth.ig.getAccountsInfo().then(function(res){ 
      mth.log(' - Accounts Info:');
      res.forEach(function(val,i){
        mth.log(
          'Acount: '+i+' \t'+
          val.accountId+' \t'+
          val.accountName+'  type: '+
          val.accountType+'  currency: '+
          val.currency+'  status: '+
          val.status+' --> Balance: ' +
          val.balance.balance+' \tdeposit: '+
          val.balance.deposit+' \tprofitLoss: '+
          val.balance.profitLoss+' \tavailable: '+
          val.balance.available+''
        );
      });
    }).catch(function(res){ 
      mth.log('getAccountsInfo');
      mth.log(res);
    }); 

    await mth.ig.getHistMov().then(function(res){ 
      mth.log(' - Historical Mov. Info: (last 20)');  
      res = res.slice(0,20);  
      res.forEach(function(val,i){  
        mth.log(
          'Mov: '+i+' -> Date:'+
          val.openDateUtc+'  Name:'+
          val.instrumentName+'  size: '+
          val.size+'  currency: '+
          val.currency+'  status: '+
          val.status+' --> profitAndLoss: ' +
          val.profitAndLoss+''
        ); 
      });
    }).catch(function(res){ 
      mth.log('getActMov');
      mth.log(res);
    });  

    await mth.ig.getOpenPositions().then(function(res){ 
      mth.log(' - Open Positions Info:'); 
      res.forEach(function(val,i){
        mth.log(
          'Pos: '+i+' \t'+
          val.position.dealId+' '+
          val.market.instrumentName+' --> '+
          val.position.createdDate+' \tSize:'+
          val.position.dealSize+' \t'+
          val.position.direction+' \topen:'+
          Math.round(val.position.openLevel*10000)/10000+' \tlim:'+
          Math.round(val.position.limitLevel*10000)/10000+' \tstp:'+
          Math.round(val.position.stopLevel*10000)/10000+' \t Market:'+
          Math.round((val.market.bid+val.market.offer)/2*10000)/10000
        );
      });
    }).catch(function(res){ 
      mth.log('getOpenPositions');
      mth.log(res);
    }); 
    
    var marketName = 'EUR/USD Mini';
    var search = 'forex';
    var idMarket = undefined;
    var spread = 0.00006; 

    mth.log(' - Lets open a position!!');
    await mth.ig.getMarketEpic(search,marketName).then(function(id){ 
      idMarket=id;
      mth.log('search:'+search+'  market:'+marketName+'  -> id:'+id);  
    }).catch(function(res){ 
      mth.log('getMarketEpic');
      mth.log(res);
    });  
        
    var prices = undefined;
    var slot = 'HOUR_4';
    var slotInterval = 4*6*7;
    await mth.ig.getHisPrice(idMarket,slot,slotInterval).then(function(data){
      prices=data;
    }).catch(function(res){
      mth.log('getHisPrice');
      mth.log(res);
    }); 

    var dir = 'NONE';
    var stopLim = 30;
    if (prices.length!==0){
      dir = mth.logicSlopeMean(prices);
    }  
    
    if (dir!=='NONE'){
      mth.ig.createPosition(dir,idMarket,stopLim,stopLim).then(function(info){
        if (info!==undefined){
          mth.log('Pos created?: type='+info.type+' dealStatus='+info.dealStatus+' reason='+info.reason);  
        }
      }).catch(function(res){ 
        mth.log('createPosition');
        mth.log(res);
      });
    }else{
      mth.log('Pos not created dir='+dir);
    }
  },
  //MTH LOGIC 
  logicSlopeMean: function(prices){
    var i = 0;
    var type ='NONE';
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
    var math = require('mathjs');
    var reg = new ml.SimpleLinearRegression(time,med); 
    var type = 'NONE';  
    //ckeck SELL or BUY
    if(reg.slope<0){
      type ='SELL';
    }else{
      type ='BUY';
    } 
    
    return type; 
  },
  getIGData: async function(user,pass){
    mth.init(user,pass,'getData'); 
    mth.log('');
    mth.log(' --- Start: getData');

    var marketName = 'Gold';
    var search = 'forex';
    var idMarket = undefined;

    await mth.ig.getMarketEpic(search,marketName).then(function(id){ 
      idMarket=id;
      mth.log('search:'+search+'  market:'+marketName+'  -> id:'+id);  
    }).catch(function(res){ 
      mth.log('getMarketEpic');
      mth.log(res);
    }); 

    mth.log(' --- End: getData');
  }
}; 

var namefile = 'test';
var user = undefined;
var pass = undefined; 
var exe = undefined;
process.argv.forEach(function(val,index) { 
  if (index===2&&(val!==undefined||val!==null||val!=='')){
    user = val;
  } 
  if (index===3&&(val!==undefined||val!==null||val!=='')){
    pass = val;
  }  
  if (index===4&&(val!==undefined||val!==null||val!=='')){
    exe = val;
  }
  if (index===5&&(val!==undefined||val!==null||val!=='')){
    namefile = val;
  }   
}); 
if(exe==='getdata'){ 
  mth.getIGData(user,pass);
}
if(exe==='exe'){ 
  mth.exe(user,pass,namefile);
}
