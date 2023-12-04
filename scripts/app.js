//funciones auxiliares
function bytesToGB(bytes) {
  const gigabytes = bytes / (1024 ** 3);
  return gigabytes.toFixed(3); // Redondea a dos decimales
}
//Acciones
function printInfoPC(){
  var os = require('os'); 
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
  console.log("**** START *****");
  printInfoPC();   
  console.log("**** END   *****");  
}
exe();