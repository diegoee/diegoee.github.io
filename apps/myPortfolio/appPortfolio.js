var appPortfolio = {  
  log: function(data,fnLog){
    console.log(data);
    fnLog(data);    
  },
  requestYahooValue: function(ticker){
    var request = require('request');    
    return new Promise(function(resolve,reject){  
      request({
        method: 'GET',
        headers: { 
        },
        url: 'https://es.finance.yahoo.com/quote/'+ticker
      }, function(error,response){ 
        if (response.statusCode===200){ 
          resolve(response.body);
        }else{
          reject('Error');
        } 
      }); 
    });  
  },
  requestYahooValueHist: function(ticker){
    var request = require('request'); 
    var moment = require('moment');
    function getCrumb(body){
      var aux = body.indexOf('CrumbStore'); 
      aux = body.substring(aux-1,aux+50);
      aux = aux.split('"')[5];
      return aux;
    }
    return new Promise(function(resolve,reject){  
      request({
        method: 'GET',
        headers: { 
        },
        url: 'https://es.finance.yahoo.com/quote/'+ticker
      }, function(error,response){ 
        if (response.statusCode===200){  
          var crumb = getCrumb(response.body); 
          var startDate = 1533074400; //moment('01/08/2019','DD/MM/YYYY').valueOf()/1000; //1533074400; //01/08/2019
          var n = 365*20; // 20años aprox.
          var endDate = startDate+n*86400; //moment().valueOf()/1000;  
          var cookie = response.headers['set-cookie'][0].split(';')[0];          
          request({
            method: 'GET',
            headers: { 
              'Cookie': cookie
            },
            url: 'https://query1.finance.yahoo.com/v7/finance/download/'+ticker+'?period1='+startDate+'&period2='+endDate+'&interval=1d&events=history&crumb='+crumb
          },function(error,response){  
            if (response.statusCode===200){ 
              var data = response.body.replace(/\n/g,',');
              data = data.split(','); 
              var date = [];
              var close = []; 
              for( var i=7; i<data.length; i=i+7){ 
                date.push(moment(data[i],'YYYY-MM-DD').format('DD/MM/YYYY')); 
              }
              for( var i=11; i<data.length; i=i+7){ 
                close.push(parseFloat(data[i]));
              } 
              data= [];
              for(var i=0; i<date.length; i++){ 
                data.push([
                  date[i],
                  close[i]
                ]);
              } 
              delete close;
              delete date;
              resolve(data);
            }else{
              reject(response.statusCode);
            }
          });           
        }else{
          reject(response.statusCode);
        } 
      }); 
    });
  },
  exe: async function(fnLog,rootFile){
    //load require  
    var excelToJson = require('convert-excel-to-json');
    var jsdom = require('jsdom').JSDOM;
    var moment = require('moment');

    var time = moment();
    appPortfolio.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> Start Exe',fnLog);
 
    var res = { 
      name: 'ING Direct Cartera',
      cValue: 0,
      cashValue: 0,
      shareValue: 0,
      gDia: 0,
      gDiaPor: 0,
      gDiaClass: 0,
      gTot: 0,
      gTotPor: 0,
      gTotClass: 0,
      nValue: 0,
      movData: undefined,
      evoData: undefined
    } 
 
    appPortfolio.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> 01.-load excel',fnLog);
    try{
      var data = excelToJson({
        sourceFile: rootFile,
        header:{ 
          rows: 1 
        }
      });
      data = data.Movimientos; 
    }catch(error){ 
      appPortfolio.log(error,fnLog);
    }

    for(i in data){
      data[i].id = i;
      data[i].date = moment(data[i].A).format('DD/MM/YYYY');
      data[i].cat1 = data[i].B;
      data[i].cat2 = data[i].C;
      data[i].desc = data[i].D;
      data[i].comment = data[i].E;
      data[i].value = data[i].F;
      data[i].ticker = data[i].G;
      data[i].n = data[i].H;
      delete data[i].A;
      delete data[i].B;
      delete data[i].C;
      delete data[i].D;
      delete data[i].E;
      delete data[i].F;
      delete data[i].G;
      delete data[i].H; 
    }
    appPortfolio.log(' loaded excel: data l='+data.length,fnLog);     
    res.movData = data; 
    appPortfolio.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> 02.-parsing data',fnLog);
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    } 

    var s = [];  
    for (i in data) {
      if(
        (data[i].cat2==='Acciones'&&data[i].ticker!=='EUR')
        ||data[i].cat2!=='Abono de intereses'
        ||data[i].cat2!=='Ingresos de otras entidades'
        ||data[i].cat2!=='Transferencias'
      ) { 
        res.cashValue = res.cashValue + data[i].value;
      } 
      s.push(data[i].ticker);  
    }
    res.cashValue = Math.round(res.cashValue*100)/100;
    s = s.filter(onlyUnique);
    s = s.filter(function(value, index, self) { 
      return value!=='EUR';
    });
    s = s.sort();
         
    var r1,r2,r3,r4,r5;
    for(i in s){
        r1 = 0;
        r5 = 0;
        r2 = 0.0;
        r4 = 0.0;
        r3 = [];
        for (ii in data){
          if(data[ii].cat2==='Acciones'&&data[ii].desc.indexOf('Broker')!==-1&&s[i]===data[ii].ticker){ 
            r1=r1+(data[ii].value<0?data[ii].n:-1*data[ii].n);
            r2=r2+data[ii].value;
            r4=r4+(data[ii].value<0?data[ii].value:0);
            r5=r5+(data[ii].value<0?data[ii].n:0);
            r3.push({
              date: data[ii].date,
              type: (data[ii].value<0?'Compra ':'Venta '),
              n: data[ii].n,
              value: Math.abs(data[ii].value)+'€'
            });                  
          } 
        } 
        s[i]={
          ticker: s[i],
          n: r1,
          value: r2,
          valueBuyAvg: Math.round(Math.abs(r4/r5)*100)/100,
          mov: r3
        } 
        if(r1>0){
          res.nValue++;
        }
    } 
    res.activeValue = s.filter(function(value){ 
      return value.n!==0;
    });
    res.oldValue = s.filter(function(value){ 
      return value.n===0;
    });

    delete s;
    delete r1;
    delete r2;
    delete r3;
    delete r4;
    delete r5;
    for (i in res.oldValue){
      delete res.oldValue[i].n; 
    }  

    appPortfolio.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> 03.-requesting data... ',fnLog);    

    appPortfolio.log(' active Value',fnLog);
    for (i in res.activeValue){ 
      await this.requestYahooValue(res.activeValue[i].ticker).then(function(dataRes){       
        var $ = require('jquery')((new jsdom(dataRes)).window);
        res.activeValue[i].name =  $('#quote-header-info [data-reactid="7"]').html();         
        res.activeValue[i].nValue =  parseFloat($('#quote-header-info [data-reactid="34"]').html().replace(',','.')); 
        res.activeValue[i].gDia =  parseFloat($('#quote-header-info [data-reactid="35"]').html().split('(')[0].replace(',','.'));
        res.gDia = res.gDia + res.activeValue[i].gDia;
        res.activeValue[i].gDiaClass = (res.activeValue[i].gDia<0?'table-danger':'table-success'); 
        res.activeValue[i].gDiaPor =  ($('#quote-header-info [data-reactid="35"]').html().split('(')[1]).split(')')[0];   
        res.activeValue[i].gTot = res.activeValue[i].value + res.activeValue[i].n*res.activeValue[i].nValue;
        res.gTot = res.gTot + res.activeValue[i].gTot;
        res.activeValue[i].gTot = Math.round(res.activeValue[i].gTot*100)/100;
        res.activeValue[i].gTotClass = (res.activeValue[i].gTot<0?'table-danger':'table-success'); 
        res.activeValue[i].gTotPor = Math.round(res.activeValue[i].gTot/Math.abs(res.activeValue[i].value)*10000)/100+'%'; 
        res.activeValue[i].value = Math.round((res.activeValue[i].value)*100)/100;
        delete $;
      },function(error){
        appPortfolio.log(' '+res.activeValue[i].ticker+': '+error,fnLog);
      });  
    }
    for (i in res.activeValue){
      res.shareValue = res.shareValue + res.activeValue[i].n*res.activeValue[i].nValue;
    }
    res.shareValue = Math.round(res.shareValue*100)/100;
    res.cValue = res.shareValue+res.cashValue;  

    appPortfolio.log(' old Value',fnLog);
    for (i in res.oldValue){ 
      await this.requestYahooValue(res.oldValue[i].ticker).then(function(dataRes){       
        var $ = require('jquery')((new jsdom(dataRes)).window);
        res.oldValue[i].name = ($('#quote-header-info [data-reactid="7"]').html()===undefined?'':$('#quote-header-info [data-reactid="7"]').html());          
        delete $;
        res.gTot = res.gTot + res.oldValue[i].value;
        res.oldValue[i].gTot = Math.round(res.oldValue[i].value*100)/100;
        res.oldValue[i].gTotClass = (res.oldValue[i].gTot<0?'table-danger':'table-success');
        delete res.oldValue[i].value;
      },function(res){
        appPortfolio.log(' '+res.oldValue[i].ticker+': '+res,fnLog);
      });  
    }    
    
    res.gDiaClass = (res.gDia>0)?'textColorGreen':'textColorRed';
    res.gDiaPor = Math.round(res.gDia/res.cValue*10000)/100+' %'; 
    res.gDia = Math.round(res.gDia*100)/100+'€';

    res.gTotClass = (res.gTot>0)?'textColorGreen':'textColorRed';
    res.gTotPor = Math.round(res.gTot/res.cValue*10000)/100+' %';
    res.gTot = Math.round(res.gTot*100)/100+'€';

    res.cValue = Math.round((res.cashValue+res.shareValue)*100)/100+'€'; 

    res.cashValue = Math.round(res.cashValue*100)/100+'€';
    res.shareValue = Math.round(res.shareValue*100)/100+'€';  
 
    appPortfolio.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> 04.-calculating evo data... ',fnLog); 
    res.evoData = {};
    res.evoData.evoticker=[];
    appPortfolio.log(' evo data active Value',fnLog);
    for (i in res.activeValue){
      await this.requestYahooValueHist(res.activeValue[i].ticker).then(function(dataRes){ 
        res.evoData.evoticker.push({
          ticker: res.activeValue[i].ticker,
          name: res.activeValue[i].name,
          data: dataRes
        });
      }).catch(function(error){
        appPortfolio.log(' Error: '+res.activeValue[i].ticker+' - '+error,fnLog); 
        res.evoData.evoticker.push({
          ticker: res.activeValue[i].ticker,
          name: '',
          data: 'ERROR'
        });
      });
    }
    appPortfolio.log(' evo data old Value',fnLog);
    for (i in res.oldValue){
      await this.requestYahooValueHist(res.oldValue[i].ticker).then(function(dataRes){ 
        res.evoData.evoticker.push({
          ticker: res.oldValue[i].ticker,
          name: res.oldValue[i].name,
          data: dataRes
        });
      }).catch(function(error){
        appPortfolio.log(' Error: '+res.oldValue[i].ticker+' - '+error,fnLog); 
        res.evoData.evoticker.push({
          ticker: res.oldValue[i].ticker, 
          name: '',
          data: 'ERROR'
        });
      });
    }
    appPortfolio.log(' getting again data from error tickers',fnLog);
    for (i in res.evoData.evoticker){
      if (res.evoData.evoticker[i].data==='ERROR'){
        await this.requestYahooValueHist(res.evoData.evoticker[i].ticker).then(function(dataRes){ 
          res.evoData.evoticker[i].data = dataRes;
        }).catch(function(error){
          appPortfolio.log(' Error: '+res.evoData.evoticker[i].ticker+' - '+error,fnLog); 
          res.evoData.evoticker[i].data = 'ERROR';
        });
      } 
    }    

    var temp = [];
    var date = [];
    for (i in res.evoData.evoticker[0].data){ 
      date.push(res.evoData.evoticker[0].data[i][0]); 
    }
    date = date.filter(function(value, index, array){
      return value!=='Invalid date';
    });
    for (i in res.movData){ 
      var aux = []; 
      for (ii in date){ 
        if(moment(date[ii],'DD/MM/YYYY').diff(moment(res.movData[i].date,'DD/MM/YYYY'),'days')<0){
          aux.push([
            date[ii],
            0
          ]);
        }else{
          if(res.movData[i].ticker!=='EUR'){
            var pos = 0;
            for (iii in res.evoData.evoticker){
              if(res.evoData.evoticker[iii].ticker===res.movData[i].ticker){
                pos = iii;
                break;
              }
            }
            if(res.evoData.evoticker[pos].data==='ERROR'){  
              aux.push([
                date[ii],
                res.movData[i].value
              ]);
            }else{
              if(res.movData[i].cat2==='Acciones'&&res.movData[i].desc.indexOf('Compra Broker')!==-1){  
                for (iii in res.evoData.evoticker[pos].data){
                  if(res.evoData.evoticker[pos].data[iii][0]===date[ii]){
                    aux.push([
                      date[ii],
                      res.movData[i].value+res.movData[i].n*res.evoData.evoticker[pos].data[iii][1]
                    ]);
                    break;
                  }
                } 
              } 
              if(res.movData[i].cat2==='Acciones'&&res.movData[i].desc.indexOf('Venta Broker')!==-1){  
                for (iii in res.evoData.evoticker[pos].data){
                  if(res.evoData.evoticker[pos].data[iii][0]===date[ii]){
                    aux.push([
                      date[ii],
                      res.movData[i].value-res.movData[i].n*res.evoData.evoticker[pos].data[iii][1]
                    ]);
                    break;
                  }
                } 
              }
            }  
          }else{
            aux.push([
              date[ii],
              res.movData[i].value
            ]);
          } 
        }
      }   
      temp.push({
        id: res.movData[i].id,
        data: aux
      }); 
      delete aux;
    }
    res.evoticker = res.evoData.evoticker;
    res.evoData = temp;
    delete temp;
 
    appPortfolio.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> End Exe',fnLog); 
    return res;
  },
  exeTest: async function(){ 
    var moment = require('moment');
    var time = moment();
    console.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> Start Exe Test'); 
    
    var tickers = [{
      ticker: 'TEF.MC',
      data: [
        ['01/01/2019', 1],
        ['02/01/2019', 2],
        ['03/01/2019', 3],
        ['04/01/2019', 4]
      ]
    },{
      ticker: 'SAN.MC',
      data: [
        ['01/01/2019', 1],
        ['02/01/2019', 3],
        ['03/01/2019', 4],
        ['04/01/2019', 5]
      ]
    }]; 

    var movData=[{
      ticker: 'TEF.MC',
      date:  '02/01/2019', 
      cat2: 'Acciones',
      desc: 'Compra',
      value: -1 
    },{
      ticker: 'TEF.MC',
      date:  '04/01/2019', 
      cat2: 'Acciones',
      desc: 'Venta',
      value: 2 
    },{
      ticker: 'SAN.MC',
      date:  '04/01/2019',
      cat2: 'Acciones',
      desc: 'Compra',
      value: -3
    },{
      ticker: 'EUR',
      date:  '03/01/2019',
      cat2: 'Acciones',
      desc: 'Compra',
      value: 1
    }];
 

    var date = [];
    for (i in tickers[0].data){ 
      date.push(tickers[0].data[i][0]); 
    } 
    
    var temp = [];
    for (i in movData){  
      var aux = []; 
      for (ii in date){ 
        if(moment(date[ii],'DD/MM/YYYY').diff(moment(movData[i].date,'DD/MM/YYYY'),'days')<0){
          aux.push([
            date[ii],
            0
          ]);
        }else{
          if(movData[i].ticker!=='EUR'){
            var pos = 0;
            for (iii in tickers){
              if(tickers[iii].ticker===movData[i].ticker){
                pos = iii;
                break;
              }
            }
            if(movData[i].cat2==='Acciones'&&movData[i].desc.indexOf('Compra Broker')!==-1){  
              for (iii in tickers[pos].data){
                if(tickers[pos].data[iii][0]===date[ii]){
                  aux.push([
                    date[ii],
                    movData[i].value+tickers[pos].data[iii][1]
                  ]);
                  break;
                }
              } 
            } 
            if(movData[i].cat2==='Acciones'&&movData[i].desc.indexOf('Venta Broker')!==-1){  
              for (iii in tickers[pos].data){
                if(tickers[pos].data[iii][0]===date[ii]){
                  aux.push([
                    date[ii],
                    movData[i].value-tickers[pos].data[iii][1]
                  ]);
                  break;
                }
              } 
            }   
          }else{
            aux.push([
              date[ii],
              movData[i].value
            ]);
          } 
        }
      }   
      temp.push({
        id: movData[i].ticker+' '+movData[i].date+' '+movData[i].cat2+' '+movData[i].desc+' '+movData[i].value, 
        data: aux
      }); 
      delete aux;
    }

    console.log('--');
    for (i in temp){ 
      aux = temp[i].id+' --> ';
      for (ii in temp[i].data){
        aux=aux+' - '+temp[i].data[ii][0]+' '+temp[i].data[ii][1];
      }
      console.log(aux);
    } 
    
    console.log('--');
    for (i in tickers){ 
      aux = tickers[i].ticker+' --> ';
      for (ii in tickers[i].data){
        aux=aux+' - '+tickers[i].data[ii][0]+' '+tickers[i].data[ii][1];
      }
      console.log(aux);
    } 
    
    console.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> End Exe Test');  
  }
}  
module.exports = appPortfolio;
if (process.argv[2]==='exe'){ 
  appPortfolio.exe(function(){    
  },'data\\Movements.xls');
} 
if (process.argv[2]==='test'){ 
  appPortfolio.exeTest();
} 
