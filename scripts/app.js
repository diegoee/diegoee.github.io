//funciones auxiliares
function print(msg) {
  console.log(msg); 
} 
function printInfoPC(){
	var os = require('os'); 
  function bytesToGB(bytes) {
    var gigabytes = bytes / (1024 ** 3);
    return gigabytes.toFixed(3);  
  } 
	print('PC: '+os.hostname());  
	// Información del sistema operativo
	print(' Sistema operativo: '+os.platform());
	print(' Arquitectura: '+os.arch());
	print(' Versión del sistema operativo: '+os.version()); 
	// Información del hardware
	print(' Número de núcleos: '+os.cpus().length);
	print(' Memoria total (Gb): '+bytesToGB(os.totalmem())); 
	print(' Memoria libre (Gb): '+bytesToGB(os.freemem()));  
}

//----- main -----
async function main(){
  console.time('Exe script');
  print('*** START ***\n');	
  printInfoPC(); 
  print('\n*** END   ***');
  console.timeEnd('Exe script');  
}
main();