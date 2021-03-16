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
  }, 
  getEurUsdIG: async function(){
    var fs = require('fs');
    var path = require('path');  
    mth.init(); 
    mth.log('');
    mth.log(' --- Start: getEurUsdIG');

    var marketName = 'EUR/USD Mini';
    var search = 'forex';
    var idMarket = undefined;

    await mth.ig.getMarketEpic(search,marketName).then(function(id){ 
      idMarket=id;
      mth.log('search:'+search+'  market:'+marketName+'  -> id:'+id);  
    }).catch(function(res){ 
      mth.log('getMarketEpic');
      mth.log(res);
    });     
    
    dates = [];
    var now = new Date();
    var nOfdays = 14; 
    for (var i=1; i<nOfdays; i++){
      var d = new Date();
      d.setDate(now.getDate()-i);
      if(d.getDay()!==0&&d.getDay()!==6){ //Saturday and Sunday 
        d = d.getFullYear()+'-'+((d.getMonth()+1)<10?'0'+(d.getMonth()+1):(d.getMonth()+1))+'-'+d.getDate();
        dates.push(d);
      } 
    } 
 
    var fileDateList = path.join(path.resolve()+'/'+mth.outputData+'/EURUSD_dates.json');
    var datesFile = undefined;
    var output = path.join(path.resolve()+'/'+mth.outputData);
    if (!fs.existsSync(output)){
      fs.mkdirSync(output);
    }
    if (fs.existsSync(fileDateList)) {
      datesFile = JSON.parse(fs.readFileSync(fileDateList)); 
      for (var i in datesFile){
        dates = dates.filter(function(e){
          return e!==datesFile[i];
        });
      } 
    }    
 
    var downloadedDates = [];
    for (var j in dates){ 
      mth.log('Downloading: ('+(parseInt(j)+1)+'/'+dates.length+') getHisPrice');
      await mth.ig.getHisPrice5minDay(idMarket,dates[j]).then(function(data){  
        var dataParse = [];
        for (var i in data){
          var time = (new Date(data[i].snapshotTime)).getTime();
          var o = Math.round((data[i].openPrice.bid+data[i].openPrice.ask)/2*100000)/100000;
          var h = Math.round((data[i].highPrice.bid+data[i].highPrice.ask)/2*100000)/100000;
          var l = Math.round((data[i].lowPrice.bid+data[i].lowPrice.ask)/2*100000)/100000;
          var c = Math.round((data[i].closePrice.bid+data[i].closePrice.ask)/2*100000)/100000;
          dataParse.push([time,o,h,l,c]);
        } 
        var file = path.join(path.resolve()+'/'+mth.outputData+'/EURUSD_'+dates[j]+'.json');
        try {
          fs.unlinkSync(file);  
        } catch(err) { 
        }
        fs.appendFileSync(file,JSON.stringify(dataParse),'utf8'); 
        downloadedDates.push(dates[j]);
      }).catch(function(res){ 
        mth.log(res);
      }); 
    };  

    if(downloadedDates.length!==0){
      fs.appendFileSync(fileDateList, JSON.stringify(downloadedDates), 'utf8');
    }
 
    mth.log(' --- End');
  } 
}; 

//ej: node main.js exe
process.argv.forEach(function(val,index) {  
  if (index===2&&(val!==undefined||val!==null||val!=='')){ 
    if(val==='data'){ 
      mth.getEurUsdIG();
    } 
    if(val==='exe'){ 
      mth.exe();
    } 
  }  
}); 

