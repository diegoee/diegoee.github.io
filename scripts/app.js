//funciones auxiliares
function bytesToGB(bytes) {
  var gigabytes = bytes / (1024 ** 3);
  return gigabytes.toFixed(3);  
}
//Acciones
function printInfoPC(){
  var os = require('os'); 
  console.log('Nombre PC: '+os.hostname());  
  // Información del sistema operativo
  console.log('Sistema operativo: '+os.platform());
  console.log('Arquitectura: '+os.arch());
  console.log('Versión del sistema operativo: '+os.version()); 
  // Información del hardware
  console.log('Número de núcleos: '+os.cpus().length);
  console.log('Memoria total (Gb): '+bytesToGB(os.totalmem())); 
  console.log('Memoria libre (Gb): '+bytesToGB(os.freemem()));  
}

//main
function exe(){  
  console.log("\n*******************************************\n");
  printInfoPC();   
  console.log("\n*******************************************\n");  
}
exe();