var app = { 
  sleep: function(ms){ 
    return new Promise(function(resolve){  
      setTimeout(function(){
        resolve();
      },ms);
    });  
  },  
  exe: async function(){
    var moment = require('moment'); 
    var time = moment();
    console.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> Start Exe Test');   
    console.log('start sleep');
    await this.sleep(1000).then(function(){       
      console.log('exe fn then');  
    });  
    console.log('start sleep'); 
    console.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> End Exe Test');  
  }, 
}  
if (process.argv[2]==='exe'){ 
  app.exe();
} 
