/*globals require, Promise, module*/ 
var ig = {
  //ATRIBUTES
  url: 'https://demo-api.ig.com/gateway', 
  key: '4e81b6d9faebd2668eeb278737d0e2c76b435da8',
  user: undefined,
  pass: undefined,
  init: function(user,pass){
    ig.user=user;
    ig.pass=pass;
  },
  //FUNCTIONS  API 
  login: function (fnOk,fnError){  
    var fs = require('fs');
    var path = require('path');     
    var request = require('request');  
    request({
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
        'VERSION': 1,
        'X-IG-API-KEY': ig.key
      },
      url: ig.url+'/deal/session',
      body: {
        identifier: ig.user, 
        password: ig.pass,
        encryptedPassword: null 
      },
      json: true
    }, function(error,response){ 
      //printResponse('logout',response); 
      if (response!==undefined){
          //console.log(response.headers);
          //console.log(loginInfo);
        if (response.statusCode===200){   
          fnOk(response.headers);
        }else{
          //fnOk(response.body.errorCode);
          fnError();
        }
      }else{ 
        fnError();
      }
    }); 
  }, 
  getOpenPositions: function (){
    var request = require('request');
    return new Promise(function(resolve, reject){
      ig.login(function(params){
        request({
          method: 'GET',
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json; charset=UTF-8",
            "VERSION": "1",
            "X-IG-API-KEY": ig.key,
            "X-SECURITY-TOKEN": params['x-security-token'],
            "CST": params['cst']
          },
          url: ig.url+'/deal/positions',
          json: true
        }, function(error,response){ 
          if (response.statusCode===200){ 
            resolve(response.body.positions); 
          }else{ 
            reject(response.body); 
          } 
        }); 
      },function(){
        reject('ERROR login');
      }); 
    });
  }, 
  getAccountsInfo: function(){  
    var request = require('request');  
    return new Promise(function(resolve, reject){ 
      ig.login(function(params){
        request({
          method: 'GET',
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json; charset=UTF-8",
            "VERSION": "1",
            "X-IG-API-KEY": ig.key,
            "X-SECURITY-TOKEN": params['x-security-token'],
            "CST": params['cst']
          },
          url: ig.url+'/deal/accounts',
          json: true
        }, function(error,response){ 
          if (response.statusCode===200){ 
            resolve(response.body.accounts);
          }else{  
            reject(response.body);
          }
        }); 
      },function(){
        reject('ERROR login');
      });   
    });
  },  
  getHistMov: function(){
    var request = require('request');  
    return new Promise(function(resolve, reject){ 
      ig.login(function(params){
        request({
          method: 'GET',
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json; charset=UTF-8",
            "VERSION": "2",
            "X-IG-API-KEY": ig.key,
            "X-SECURITY-TOKEN": params['x-security-token'],
            "CST": params['cst']
          },
          url: ig.url+'/deal/history/transactions?from=2020-01-01&pageSize=100&pageNumber=100',
          json: true
        }, function(error,response){ 
          if (response.statusCode===200){ 
            resolve(response.body.transactions);
          }else{  
            reject(response.body); 
          }
        });
      },function(){
        reject('ERROR login');
      });   
    });
  },
  getMarketEpic: function(search,marketName){  
    var request = require('request'); 
    return new Promise(function(resolve, reject){ 
      ig.login(function(param){
        request({
          method: 'GET',
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json; charset=UTF-8",
            "VERSION": "1",
            "X-IG-API-KEY": ig.key,
            "X-SECURITY-TOKEN": param['x-security-token'],
            "CST": param['cst']
          },
          url: ig.url+'/deal/markets?searchTerm='+search,
          body: {
            identifier: ig.user, /*read file*/ 
            password: ig.pass, /*read file*/ 
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
  getHisPrice: function (idMarket,slot,slotInterval){   
    var urlvar = idMarket+'?resolution='+slot+'&max='+slotInterval+'&pageSize='+slotInterval;
    var request = require('request'); 
    return new Promise(function(resolve, reject){ 
      ig.login(function(param){
        request({
          method: 'GET',
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json; charset=UTF-8",
            "VERSION": "3",
            "X-IG-API-KEY": ig.key,
            "X-SECURITY-TOKEN": param['x-security-token'],
            "CST": param['cst']
          },
          url: ig.url+'/deal/prices/'+urlvar,
          body: {
            identifier: ig.user, /*read file*/ 
            password: ig.pass, /*read file*/ 
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
  getHisPrice5minDay: function (idMarket,day){   
    //Ej: day = 2020-05-14
    var urlvar = idMarket+'?resolution=MINUTE_5&from='+day+'T00%3A00%3A00&to='+day+'T23%3A55%3A00&max=1&pageSize=1440&pageNumber=1';
    var request = require('request'); 
    return new Promise(function(resolve, reject){ 
      ig.login(function(param){
        request({
          method: 'GET',
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json; charset=UTF-8",
            "VERSION": "3",
            "X-IG-API-KEY": ig.key,
            "X-SECURITY-TOKEN": param['x-security-token'],
            "CST": param['cst']
          },
          url: ig.url+'/deal/prices/'+urlvar,
          body: {
            identifier: ig.user, /*read file*/ 
            password: ig.pass, /*read file*/ 
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
  createPosition: function (type,idMarket,stop,lim){ 
    var info = {}; 
    info.type = type; 
    var request = require('request'); 
    return new Promise(function(resolve,reject){
      ig.login(function(param){  
        info.stop = stop;
        info.lim = lim; 

        request({
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
            'VERSION': '2',
            'X-IG-API-KEY': ig.key,
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
                'X-IG-API-KEY': ig.key,
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