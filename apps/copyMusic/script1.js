/*globals require*/
console.log('\n***Start Script***');
 
var fs = require('fs'); 

//Obtenemos la ruta y la carpeta
//var pth = require('path').resolve();
var pth = 'C:\\Users\\alamo\\Music\\iTunes\\iTunes Media\\Music';
var folders = [
  'C:\\Users\\alamo\\Downloads\\DiegoEos',
  'C:\\Users\\alamo\\Downloads\\AlterEgo',
  'C:\\Users\\alamo\\Downloads\\TrumpetList'
];
console.log('Music folder: '+pth);

function deleteFolderRecursive(folder) {
  var files = [];
  if( fs.existsSync(folder) ) {
      files = fs.readdirSync(folder);
      files.forEach(function(file){
          var curPath = folder + '/' + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(folder); 
  }
} 

console.log('Borramos las carpetas, todos sus archivos y las volvemos a crear');
for(var j = 0; j<folders.length; j++){
  console.log(j+' - '+folders[j]); 
  deleteFolderRecursive(folders[j]);  
  fs.mkdirSync(folders[j]);
} 

console.log('Obtenemos todos los ficheros .mp3 de la carpeta y subcarpetas'); 
var allFiles = [];
(function lookFile(pth){
  var files;
  try{
    files = fs.readdirSync(pth);
    files.forEach(function(f){
      lookFile(pth+'\\'+f);
    });
  }catch(e){  
    if ((e.path.indexOf('.mp3')>0)&&(e.path.indexOf('._')===-1)){  
      allFiles.push(e.path);
    }
  }
})(pth);
 
console.log('Contamos el total de ficheros a copiar');  
var tot=[0,0,0];
allFiles.forEach(function(f) {  
  var c1 = f.indexOf('.mp3')>0;
  var c2 = f.indexOf('99')!==-1;
  var c3 = f.indexOf('80')!==-1;    
  if(c1&&!c2&&!c3){
    tot[0]++;
  }
  if(c1&&c2){
    tot[1]++;
  }
  if(c1&&c3){
    tot[2]++;
  }
});

for(var z = 0; z<folders.length; z++){
  console.log(z+' - '+tot[z]+'\t ficheros a copiar en: '+folders[z]);
} 
 
console.log('Copiamos todos los ficheros a las carpetas'); 
function copyFile(f,fEnd){ 
  fs.createReadStream(f).pipe(fs.createWriteStream(fEnd)); 
}
var counter = [0,0];
for(var z = 0; z<folders.length; z++){ 
  for(var i = 0; i<allFiles.length; i++){
    var f = allFiles[i];
    var fEnd = f.split('\\')[f.split('\\').length-1];
    fEnd = folders[z]+'\\'+fEnd; 
    
    var c1 = (f.indexOf('.mp3')>0);
    var c2 = (f.indexOf('99')!==-1);
    var c3 = (f.indexOf('80')!==-1);
    
    if((z===0)&&c1&&!c2&&!c3){ 
      copyFile(f,fEnd); 
      counter[z]++;
    }
    if((z===1)&&c2){ 
       copyFile(f,fEnd); 
      counter[z]++;
    } 
    if((z===2)&&c3){ 
      copyFile(f,fEnd); 
     counter[z]++;
   } 
    //console.log(z+' - \t'+counter[z]+'\t/'+tot[z]+' de la ruta: '+folders[z]); 
  } 
}  
console.log('***End Script***\n');
