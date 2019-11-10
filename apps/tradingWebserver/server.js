/*globals require, __dirname, process*/  
//IMPORT
var console = require('console'); 
var express = require('express'); 
var app = express(); 
var fs = require('fs');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser'); 
   
var mth = require('./tradingApp/myAlgotrading');
mth.outputFolder = 'output'; 
mth.inputLoginFile = 'input/loginInfo.txt';  
var ig = require('./tradingApp/igAPI');
ig.inputLoginFile = 'input/loginInfo.txt'; 
 

console.log('server.js: Start');

//ATRIBUTES 
var dataServer = JSON.parse(fs.readFileSync(__dirname +'/input/userServer.txt', 'utf8')); 

//INIT SERVER
app.use('/node_modules', express.static(__dirname +'/node_modules'));
app.use('/output', express.static(__dirname +'/output'));
app.use('/js', express.static(__dirname +'/www/js'));
app.use('/css', express.static(__dirname +'/www/css'));
app.use('/templates', express.static(__dirname +'/www/templates'));
app.use('/benchmark/output', express.static(__dirname +'/benchmark/output'));

//SESSION
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({
  limit: '10mb'
})); 

//AUX FN SERVER 
function checkAuthToken(req,res,fnOk){
  var token = req.headers['authorization'];
  if(!token){
    res.status(401).send({
      error: "Es necesario el token de autenticación"
    })
    return;
  }
  jwt.verify(token,dataServer.keytoken,function(err,username){
    if (err) {
      console.log('server.js: checkAuthToken Error '+username);
      res.status(401).send({
        error: 'Token inválido: '+token
      });
    }else{
      //Function OK
      fnOk(); 
    }
  }); 
}
function createToken(username,key){
  var tokenData = {
    username: username
  };  
  var token = jwt.sign(tokenData,key,{
     expiresIn: 60*60*6 //expires in 6 hours
  });  
  return token;  
}
function deleteFolderRecursive(path) {
  var fs = require('fs');
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

deleteFolderRecursive(__dirname+'/output');
deleteFolderRecursive(__dirname+'/benchmark/output');

//EXE SERVER 
app.post('/login',function(req, res){  
  console.log('server.js: /login called');
  var username = req.body.username;
  var password = req.body.password;  
  if(!(username===dataServer.username&&password===dataServer.password)){
    res.status(401).send('usuario o contraseña inválidos');
    return;
  } 
  var token = createToken(username,dataServer.keytoken)
  res.send(token);
});

//ACCOUNT MANAGEMENT
app.get('/getSpread', function (req, res) { 
  console.log('server.js: /getSpread called');
  checkAuthToken(req,res,function(){   
    res.send({
      spread: mth.spread
    });
  });    
});

app.get('/getAccountsInfo',function(req,res){ 
  console.log('server.js: /getAccountsInfo called');
  checkAuthToken(req,res,function(){
    ig.getAccountsInfo(function(data){
      res.send(data);
    },function(){
      console.log('server.js: /getAccountsInfo Error');
    });
  });  
});

app.get('/getHistMov',function(req,res){ 
  console.log('server.js: /getHistMov called');
  checkAuthToken(req,res,function(){
    ig.getHistMov(function(data){
      res.send(data);
    },function(){
      console.log('server.js: /getHistMov Error');
    });
  });  
});

app.get('/getActMov',function(req,res){ 
  console.log('server.js: /getActMov called');
  checkAuthToken(req,res,function(){
    ig.getActMov(function(data){
      res.send(data);
    },function(){
      console.log('server.js: /getActMov Error');
    });
  });  
});

app.get('/getOpenPositions',function(req,res){ 
  console.log('server.js: /getOpenPositions called');
  checkAuthToken(req,res,function(){
    ig.getOpenPositions(function(data){
      res.send(data);
    },function(){
      console.log('server.js: /getOpenPositions Error');
    });
  });  
});

app.post('/deletePosition', function (req, res) { 
  console.log('server.js: /deletePosition called');
  var body = req.body; 
  checkAuthToken(req,res,function(){ 
    ig.deletePosition(body,function(data){
      res.send(data);
    },function(){
      console.log('server.js: /deletePosition Error'); 
    });    
  });    
});

//MTH   


app.get('/getCombosValues', function (req, res) { 
  console.log('server.js: /onOffAlgo called');
  checkAuthToken(req,res,function(){  
    var data = {}; 
    data.method = mth.method;
    data.limInc = mth.stopIncVal;
    data.stopInc = mth.limIncVal;
    res.send(data);
  });    
});

app.get('/onOffAlgo', function (req, res) { 
  console.log('server.js: /onOffAlgo called');
  checkAuthToken(req,res,function(){  
    var data = {};
    data.on = (mth.intervalMethod!==undefined);
    data.method = mth.paramMethod.method;
    data.limInc = mth.paramMethod.limInc;
    data.stopInc = mth.paramMethod.stopInc;
    console.log(' on: '+data.on);
    console.log(' method: '+data.method);
    console.log(' limInc: '+data.limInc);
    console.log(' stopInc: '+data.stopInc);
    res.send(data);
  });    
}); 

app.post('/startStopAlgo', function (req, res) { 
  console.log('server.js: /startStopAlgo called');
  checkAuthToken(req,res,function(){ 
    //Function OK   
    var status = mth.exe(req.body.method,req.body.stopInc,req.body.limInc);  
    res.send(status);    
  });    
});
  
/*
var formidable = require('formidable'); 
app.post('/uploadAlgofile', function (req, res) { 
  console.log('server.js: /uploadAlgofile called');
  checkAuthToken(req,res,function(){ 
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file){
      console.log('server.js: fileBegin ' + file.name);
      file.name = 'myAlgotradingUPLOADED.js';
      var f = __dirname + '/tradingApp/' + file.name;
      if (fs.existsSync(f)){
        fs.unlinkSync(f) 
      } 
      file.path = __dirname + '/tradingApp/' + file.name;
    });
    form.on('file', function (name, file){
      res.send('file upload size: '+file.size); 
    });
  });    
});
*/

//SERVER SETUP
app.post('/deleteLogFile', function(req, res){  
  console.log('server.js: /deleteLogFile called');
  var file = req.body.file;  
  checkAuthToken(req,res,function(){
    try {
      fs.unlinkSync(__dirname+'/'+file); 
      res.send(true);
    } catch(e) {
      console.log('server.js: /getLogList Error'); 
      console.log(e.message);
      res.send(false);
    }   
  }); 
});

app.get('/getLogList', function(req,res){ 
  console.log('server.js: /getLogList called');
  checkAuthToken(req,res,function(){
    //Function OK
    var files = '';
    if (fs.existsSync(__dirname +'/output')){
      files = fs.readdirSync(__dirname +'/output');
      for (var i=0;i<files.length;i++){
        files[i]='output/'+files[i];
      } 
    }
    //res.send(JSON.stringify({list: files}));
    res.send(files);    
  });  
});

/*
var exec = require('child_process').exec;
app.get('/resetServer', function(req,res){ 
  console.log('server.js: /resetServer called');
  checkAuthToken(req,res,function(){
    //Function OK  
    exec('sh script.sh', function(err, data){  
      console.log(err)
      console.log(data.toString());                       
    });  
    res.send('exe');    
  });  
});
*/

app.get('/', function(request, response){ 
  console.log('server.js: / called');
  response.sendFile(__dirname+'/www/index.html'); 
  //response.sendFile(__dirname+'/www/test.html'); 
}); 

var port = 80;
process.argv.forEach(function (val,index) { 
  //console.log(index + ': ' + val);
  if (index===2&&val==='80'){
    port =80;
  } 
  if (index===2&&val==='8080'){
    port =8080;
  } 
});
console.log('server.js: Port read '+port);
app.listen(port, function(){
  console.log('server.js: Listen on port -> '+port);
});

 
