/*globals require, __dirname, process*/     
var fs = require('fs');  
var path = require('path');  
var axios = require('axios'); 
var progressBar = require('progress');

async function download() {  
    console.log('Connecting …')
    var { data, headers } = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    var totalLength = headers['content-length'];

    console.log('Starting download');
    var pb = new progressBar('-> downloading [:bar] :percent :etas', {
        width: 40,
        complete: '=',
        incomplete: ' ',
        renderThrottle: 1,
        total: parseInt(totalLength)
    })

    try{
        fs.unlinkSync(file);
    }catch(e){
        console.log('No file to delete: '+file);
    }
    var writer = fs.createWriteStream(
        path.resolve(__dirname,file)
    );
    data.on('data',function(chunk){
        pb.tick(chunk.length);
    });
    data.pipe(writer);     
}  

var url = undefined;
var file =  undefined; 
process.argv.forEach(function(val,index) {
    console.log(val)  
    if (index===2){
        url = val; 
    } 
    if (index===3){
        file = val; 
    } 
  }); 
if(url!==undefined&&file!==undefined){
    download();
}


 
