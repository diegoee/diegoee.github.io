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
    var api = require('termux');

    var time = moment();
    console.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> Start Exe Test');   
    console.log('start sleep');
    await this.sleep(10).then(function(){       
      console.log('exe fn then');  
    });  
 
    if (api.hasTermux){  
      console.log('Termux API'); 
      api.toast('Hello word!').run();
    }

    console.log('start sleep'); 
    console.log(moment.utc(moment().diff(time)).format("HH:mm:ss.SSS")+' -> End Exe Test');  
  }, 
}  
if (process.argv[2]==='exe'){ 
  app.exe();
} 
