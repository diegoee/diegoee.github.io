/*globals require, Promise, module*/  
var fs = require('fs');
var path = require('path');     
var request = require('request'); 
var cheerio = require('cheerio');  
 
var N = 5000; 
var data = []; 

function requestSentence(){ 
  return new Promise(function(resolve, reject){  
    request({
      method: 'get', 
      url: 'https://frasesmotivacion.net/frase-aleatoria' 
    },function(error,response){  
      if (response!==undefined){
        if (response.statusCode===200){ 
          var $ = cheerio.load(response.body);   
          resolve({
            sentence: $('.jumbotron h1').html(),
            author: $('.jumbotron p').html()
          });  
        }else{
          console.log(response.body.errorCode); 
          reject();
        }
      }else{ 
        reject();
      }
    });
  });
} 

async function exe(){
  for (var i=0; i<N; i++){ 
    console.log((i+1)+'/'+N); 
    await requestSentence().then(function(res){ 
      data.push(res);
    }).catch(function(){ 
      console.log('ERROR');
    });;
  } 
  fs.unlinkSync('sentence.json');
  fs.writeFile('sentence.json', JSON.stringify(data), 'utf8', function(){
    console.log('sentence.json created');
  });
}
exe();