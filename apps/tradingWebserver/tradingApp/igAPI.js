/*globals require, Promise, module*/ 
var ig = {
  //ATRIBUTES
  url: 'https://demo-api.ig.com/gateway', 
  inputLoginFile: '../input/loginInfo.txt',
  //FUNCTIONS  API 
  login: function (fnOk,fnError){  
    var fs = require('fs');
    var path = require('path'); 
    var loginInfo = JSON.parse(fs.readFileSync(path.join(path.resolve()+'/'+ig.inputLoginFile), 'utf8'));     
    var request = require('request');  
    request({
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
        'VERSION': 1,
        'X-IG-API-KEY': loginInfo.key
      },
      url: ig.url+'/deal/session',
      body: {
        identifier: loginInfo.user, 
        password: loginInfo.pass,
        encryptedPassword: null 
      },
      json: true
    }, function(error,response){ 
      //printResponse('logout',response); 
      if (response!==undefined){
          //console.log(response.headers);
          //console.log(loginInfo);
        if (response.statusCode===200){   
          fnOk(response.headers,loginInfo);
        }else{
          //fnOk(response.body.errorCode);
          fnError();
        }
      }else{ 
        fnError();
      }
    }); 
  }, 
  getOpenPositions: function (fnOk,fnError){
    var request = require('request');
    ig.login(function(params,loginInfo){
      request({
        method: 'GET',
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Accept": "application/json; charset=UTF-8",
          "VERSION": "1",
          "X-IG-API-KEY": loginInfo.key,
          "X-SECURITY-TOKEN": params['x-security-token'],
          "CST": params['cst']
        },
        url: ig.url+'/deal/positions',
        json: true
      }, function(error,response){ 
        if (response.statusCode===200){ 
          fnOk(response.body.positions); 
        }else{ 
          fnOk(response.body);
          fnError();
        } 
      }); 
    },fnError); 
  },
  deletePosition: function (data,fnOk,fnError){
    var request = require('request');
    ig.login(function(params,loginInfo){      
      console.log(data);      
      request({
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Accept": "application/json; charset=UTF-8",
          "VERSION": "1",
          "X-IG-API-KEY": loginInfo.key,
          "X-SECURITY-TOKEN": params['x-security-token'],
          "CST": params['cst'],
          "_method": "DELETE"
        },
        url: ig.url+'/deal/positions/otc',
        body: { 
          "dealId": data.dealId, 
          "direction": data.direction,
          "size": data.size, 
          "orderType": "MARKET" 
        },
        json: true
      }, function(error,response){ 
          //console.log(response.statusCode);
        if (response.statusCode===200){
          //console.log(response.body);
          fnOk(response.body.dealReference); 
        }else{  
          //console.log(response.body);
          fnError();
        } 
      }); 
    },fnError); 
  },  
  getAccountsInfo: function(fnOk,fnError){  
    var request = require('request'); 
    ig.login(function(params,loginInfo){
      request({
        method: 'GET',
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Accept": "application/json; charset=UTF-8",
          "VERSION": "1",
          "X-IG-API-KEY": loginInfo.key,
          "X-SECURITY-TOKEN": params['x-security-token'],
          "CST": params['cst']
        },
        url: ig.url+'/deal/accounts',
        json: true
      }, function(error,response){ 
        if (response.statusCode===200){ 
          fnOk(response.body.accounts);
        }else{ 
          fnOk(response.body);
          fnError();
        }
      }); 
    },fnError);  
  },  
  getHistMov: function(fnOk,fnError){
    var request = require('request'); 
    ig.login(function(params,loginInfo){
      request({
        method: 'GET',
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Accept": "application/json; charset=UTF-8",
          "VERSION": "2",
          "X-IG-API-KEY": loginInfo.key,
          "X-SECURITY-TOKEN": params['x-security-token'],
          "CST": params['cst']
        },
        url: ig.url+'/deal/history/transactions?from=2019-06-01&pageSize=100&pageNumber=100',
        json: true
      }, function(error,response){ 
        if (response.statusCode===200){ 
          fnOk(response.body.transactions);
        }else{  
          fnOk(response.body);
          fnError();
        }
      });
    },fnError);  
  },
  getActMov: function(fnOk,fnError){
    var request = require('request'); 
    ig.login(function(params,loginInfo){
      request({
        method: 'GET',
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Accept": "application/json; charset=UTF-8",
          "VERSION": "3",
          "X-IG-API-KEY": loginInfo.key,
          "X-SECURITY-TOKEN": params['x-security-token'],
          "CST": params['cst']
        },
        url: ig.url+'/deal/history/activity?from=2018-12-01&detailed=true&pageSize=200',
        json: true
      }, function(error,response){ 
        if (response.statusCode===200){ 
          fnOk(response.body.activities);
        }else{  
          fnOk(response.body);
          fnError();
        }
      });
    },fnError);  
  },
  continueP: function(res){
    return new Promise(function(resolve, reject){
      resolve(res);
    });
  },
  getMarketEpic: function(search,marketName){  
    var request = require('request'); 
    return new Promise(function(resolve, reject){ 
      ig.login(function(param,loginInfo){
        request({
          method: 'GET',
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json; charset=UTF-8",
            "VERSION": "1",
            "X-IG-API-KEY": loginInfo.key,
            "X-SECURITY-TOKEN": param['x-security-token'],
            "CST": param['cst']
          },
          url: ig.url+'/deal/markets?searchTerm='+search,
          body: {
            identifier: loginInfo.user, /*read file*/ 
            password: loginInfo.pass, /*read file*/ 
            encryptedPassword: null 
          },
          json: true
        },function(error,response){ 
          if (response.statusCode===200){
            var res;
            for (var i=0; i<response.body.markets.length; i++){
              if (response.body.markets[i].instrumentName===marketName){
                res = response.body.markets[i].epic;
                break;
              }          
            } 
            resolve(res);
          }else{  
            reject(response.body.errorCode);
          }
        });
      },function(){
        return null;
      });
    });
  },
  getOpenPos: function (idMarket){ 
    var request = require('request'); 
    return new Promise(function(resolve, reject){ 
      ig.login(function(param,loginInfo){
        request({
          method: 'GET',
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json; charset=UTF-8",
            "VERSION": "1",
            "X-IG-API-KEY": loginInfo.key,
            "X-SECURITY-TOKEN": param['x-security-token'],
            "CST": param['cst']
          },
          url: ig.url+'/deal/positions',
          body: {
            identifier: loginInfo.user, /*read file*/ 
            password: loginInfo.pass, /*read file*/ 
            encryptedPassword: null 
          },
          json: true
        },function(error,response){ 
          if (response.statusCode===200){ 
            var isOk = true;
            if(response.body.positions.length>=1){  
              var pos = response.body.positions; 
              for (var i = 0; i<pos.length ;i++){
                if (pos[i].market.epic===idMarket){
                  isOk = false; 
                  break;
                } 
              }  
            } 
            resolve(isOk);
          }else{ 
            reject(response.body.errorCode);
          } 
        }); 
      },function(){
        return null;
      });
    });
  }, 
  getHisPrice: function (idMarket,slot,slotInterval){   
    var urlvar = idMarket+'?resolution='+slot+'&max='+slotInterval+'&pageSize='+slotInterval;
    var request = require('request'); 
    return new Promise(function(resolve, reject){ 
      ig.login(function(param,loginInfo){
        request({
          method: 'GET',
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json; charset=UTF-8",
            "VERSION": "3",
            "X-IG-API-KEY": loginInfo.key,
            "X-SECURITY-TOKEN": param['x-security-token'],
            "CST": param['cst']
          },
          url: ig.url+'/deal/prices/'+urlvar,
          body: {
            identifier: loginInfo.user, /*read file*/ 
            password: loginInfo.pass, /*read file*/ 
            encryptedPassword: null 
          },
          json: true
        },function(error,response){ 
          if (response.statusCode===200){  
            if (response.body.prices.length!==0){ 
              resolve(response.body.prices);
            }else{ 
              reject('No prices got it');
            }
          }else{ 
            reject(response.body.errorCode);
          }  
        });
      },function(){
        return null;
      });
    }); 
  }, 
  createPosition: function (type,idMarket,inc){ 
    var info = {}; 
    info.type = type; 
    var request = require('request'); 
    return new Promise(function(resolve,reject){
      ig.login(function(param,loginInfo){
        var stop = inc.stop;  
        var lim = inc.limit; 
        info.stop = stop;
        info.lim = lim; 

        request({
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
            'VERSION': '2',
            'X-IG-API-KEY': loginInfo.key,
            "X-SECURITY-TOKEN": param['x-security-token'],
            "CST": param['cst']
          },
          url: ig.url+'/deal/positions/otc',
          body: {
            "epic": idMarket,
            "expiry": "-",
            "direction": type,
            "size": "1",
            "orderType": "MARKET",
            "timeInForce": null,
            "level": null,
            "guaranteedStop": "false",
            "stopLevel": null,
            "stopDistance": stop,
            "trailingStop": null,
            "trailingStopIncrement": null,
            "forceOpen": "true",
            "limitLevel": null,
            "limitDistance": lim,
            "quoteId": null,
            "currencyCode": "USD"
          },
          json: true
        },function(error,response){ 
          if (response.statusCode===200){  
            info.dealReference = response.body.dealReference;

            request({
              method: 'GET',
              headers: { 
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                'VERSION': '1',
                'X-IG-API-KEY': loginInfo.key,
                "X-SECURITY-TOKEN": param['x-security-token'],
                "CST": param['cst']
              },
              url: ig.url+'/deal/confirms/'+info.dealReference,
              json: true
            }, function(error,response){ 
              if (response.statusCode===200){ 
                info.dealStatus = response.body.dealStatus;
                info.reason = response.body.reason; 
                info.price = response.body.level; 
                resolve(info);
              }else{ 
                reject('createPosition: info position -> '+response.body.errorCode);
              }  
            });
          }else{
            reject('createPosition: Posición NO creada -> '+response.body.errorCode); 
          }  
        }); 
      },function(){
        return null;
      });
    });
  
    
  } 
}; 
module.exports = ig; 