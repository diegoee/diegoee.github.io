
function myfnAsync(){ 
  return new Promise(function(resolve, reject){ 
    var ms = 250;
    var counter = 0;
    var limitCounter = 50;
    var maxL = 100;

    var inter = setInterval(function(){
      var str = '';
      for(var i=0; i<maxL*Math.random(); i++){
        str=str+'♥';
      }
      console.log(str);
      if(counter>limitCounter){
        clearInterval(inter); 
        resolve();
      }
      counter++;
    },ms);
  });
}

function exe(){ 
  console.log("**** START javascriptTest02 *****");
  myfnAsync().then(function(){
    console.log("**** END   javascriptTest02 *****");  
  })
}
exe();