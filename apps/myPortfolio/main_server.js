/*globals require, __dirname, process*/  
//IMPORT
var express = require('express'); 
var app = express(); 
var fs = require('fs');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');  

console.log('server.js: Start');

//ATRIBUTES 
var dataServer = JSON.parse(fs.readFileSync(__dirname +'/keytoken.txt', 'utf8')); 

//INIT SERVER
app.use('/node_modules', express.static(__dirname +'/node_modules'));
app.use('/js', express.static(__dirname +'/www/js'));
app.use('/css', express.static(__dirname +'/www/css'));

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

//EXE SERVER 
app.post('/login',function(req, res){  
  console.log('server.js: /loginAction called');
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
app.get('/index', function (req, res) { 
  console.log('server.js: /index.html called');
  checkAuthToken(req,res,function(){   
    res.sendFile(__dirname+'/www/index.html');  
  });    
}); 

app.get('/', function(req,res){ 
  console.log('server.js: /login.html called');
  res.sendFile(__dirname+'/www/login.html'); 
});

//ACTION
var statusLog = undefined;
app.post('/calData', function(req,res){  
  console.log('server.js: /calData called');
  checkAuthToken(req,res,function(){
    var arg = req.body.path;  
    if(arg!==undefined){    
      statusLog = arg;
      var data = undefined;  
      require('./appPortfolio').exe(function(log){
        statusLog=statusLog+'<br>'+log; 
      },arg).then(function(data){  
        console.log('calData sent');
        res.send(data);  
      }).catch(function(e){  
        console.log('server.js: Error in appPortfolio.js');
        console.log(e);     
      });     
    } 
  }); 
});
app.get('/getStatusLog', function(req,res){  
  //console.log('server.js: /getStatusLog called');
  checkAuthToken(req,res,function(){   
    res.send(statusLog);  
  });
});

var port = 8080;
process.argv.forEach(function(val,index) {  
  if (index===2&&val==='80'){
    port = 80;
  } 
  if (index===2&&val==='8080'){
    port = 8080;
  } 
});
console.log('server.js: Port read '+port);
app.listen(port, function(){
  console.log('server.js: Listen on port -> '+port);
});


 
