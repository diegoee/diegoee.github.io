/*globals require*/
console.log('\n***Start Script***');
 
var fs = require('fs');

 
//Obtenemos la ruta y la carpeta
//var pth = require('path').resolve();
var pth = 'C:\\Users\\alamo\\Music\\iTunes\\iTunes Media\\Music';
var folders = [
  'C:\\Users\\alamo\\Downloads\\DiegoEos',
  'C:\\Users\\alamo\\Downloads\\AlterEgo'
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

//Borrarmos las carpeta y todos su archivos y las volvemos a crear
for(var j = 0; j<folders.length; j++){
  deleteFolderRecursive(folders[j]);
  fs.mkdirSync(folders[j]);
}

//Obtnemos todos los ficheros .mp3 de la carpeta y subcarpetas
var allFiles =[];
(function lookFile(pth){
  var files;
  try{
    files = fs.readdirSync(pth);
    files.forEach(function(f){
      lookFile(pth+'/'+f);
    });
  }catch(e){  
    if ((e.path.indexOf('.mp3')>0)&&(e.path.indexOf('._')===-1)){  
      allFiles.push(e.path);
    }
  }
})(pth);

 
// copiamos todos los ficheros a la carpeta
function copyFile(i,f,fEnd){
  i++;
  fs.createReadStream(f).pipe(fs.createWriteStream(fEnd));
  return i;
}

for(var z = 0; z<folders.length; z++){
  var i = 0;
  
  allFiles.forEach(function(f) { 
    var fEnd = f.split('\\')[f.split('\\').length-1];
    fEnd = folders[z]+'\\'+fEnd;
    
    var c1 = (f.indexOf('.mp3')>0);
    var c2 = (f.indexOf('99')!==-1);
    
    if ((z===0)&&c1&&!c2){ i = copyFile(i,f,fEnd); }
    if ((z===1)&&c2){ i = copyFile(i,f,fEnd); }    
    
  });
  console.log(z+' - Copiados un total de *** '+i+' *** en: '+folders[z]);
}
  
console.log('***End Script***\n');
