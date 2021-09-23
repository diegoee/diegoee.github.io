/*globals require, console, clearInterval, setInterval, Promise, module*/ 
var mth = {
  //ATRIBUTES
  param: undefined, 
  nameLog: 'log', 
  outputLog: 'outputLog', 
  outputData: 'data', 
  credentialroot: 'C:\\Users\\alamo\\Downloads\\IGuser.json', //YOUR PAREMETER
  ig: undefined,
  //GENERAL FUNCTIONS
  log: function(txt){
    var fs = require('fs');  
    var path = require('path');  
    fs.appendFileSync(path.join(path.resolve()+'/'+mth.nameLog), (new Date()).toISOString().substring(0, 19).replace(/T/g,' ')+' -> '+txt+'\n', 'utf8');
    console.log(txt);
  }, 
  init: function(){ 
    var fs = require('fs');
    var path = require('path');     
    mth.ig = require('./igAPI');
 
    var userPass = JSON.parse(fs.readFileSync(mth.credentialroot,'utf8')); 
    mth.ig.init(userPass.user,userPass.pass);
    
    var output = path.join(path.resolve()+'/'+mth.outputLog);
    if (!fs.existsSync(output)){
      fs.mkdirSync(output);
    } 
    var dateFile = (new Date()).toISOString().substring(0, 19).replace(/:|T|-/g,'_');   
    mth.nameLog = mth.outputLog+'/log_mth_'+dateFile+'.txt'; 
  },   
  exe: async function (){ 
    mth.init();
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

    mth.log(' - Lets open a position!!');
    await mth.ig.getMarketEpic(search,marketName).then(function(id){ 
      idMarket=id;
      mth.log('search:'+search+'  market:'+marketName+'  -> id:'+id);  
    }).catch(function(res){ 
      mth.log('getMarketEpic');
      mth.log(res);
    });  
 
    var dir = (Math.random()<0.5?'BUY':'SELL');
    var stopLim = 30;      
    mth.ig.createPosition(dir,idMarket,stopLim,stopLim).then(function(info){
      if (info!==undefined){
        mth.log('Pos created?: type='+info.type+' dealStatus='+info.dealStatus+' reason='+info.reason);  
      }
    }).catch(function(res){ 
      mth.log('createPosition');
      mth.log(res);
    }); 
  } 
}; 

//ej: node main.js exe
process.argv.forEach(function(val,index) {  
  if (index===2&&(val!==undefined||val!==null||val!=='')){ 
    if(val==='exe'){ 
      mth.exe();
    } 
  }  
}); 

