/*globals require, __dirname, process*/  
//IMPORT
var express = require('express'); 
var app = express(); 
var fs = require('fs');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');  

console.log('server.js: Start');

//ATRIBUTES 
var dataServer = JSON.parse(fs.readFileSync(__dirname +'/serverAssets/keytoken.txt','utf8')); 

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
function checkAuthToken(req,fnOk,fnError){
  var token = req.headers['authorization']; 
  if(!token){ 
    var desc = 'Error: Es necesario el token de autenticación'; 
    console.log(desc);
    fnError();
    return;
  }
  jwt.verify(token,dataServer.keytoken,function(err,username){
    if (err){ 
      var desc = 'Error: checkAuthToken Error in user: '+username+', Token inválido: '+token; 
      console.log(desc);
      fnError();
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
     expiresIn: 60*5 //expires in 5min
  });  
  return token;  
} 

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
app.get('/', function (req, res) { 
  console.log('server.js: /index.html called');  
  res.sendFile(__dirname+'/www/index.html');   
});  

//ACCOUNT MANAGEMENT
app.post('/checktoken', function (req, res) { 
  console.log('server.js: /checktoken called');  
  checkAuthToken(req,function(){
    res.send(true);
  },function(){
    res.send(false);
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