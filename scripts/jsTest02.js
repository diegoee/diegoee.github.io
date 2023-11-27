var fs = require('fs');
var path = require('path');

function buscarArchivosConExtension(directorio, extension) {
  try {
    var archivos = fs.readdirSync(directorio);
    archivos.forEach(function(archivo){
        const rutaArchivo = path.join(directorio, archivo);
        const esDirectorio = fs.statSync(rutaArchivo).isDirectory(); 
        if (esDirectorio) {
          // Si es un directorio, busca recursivamente en ese directorio
          buscarArchivosConExtension(rutaArchivo, extension);
        } else {
          // Si es un archivo, verifica la extensión
          if (path.extname(archivo) === extension) {
            console.log('Archivo encontrado:', rutaArchivo);
          }
        }
    });
  } catch (error) {
    console.error('Error al leer el directorio:', error);
  }
}

// Especifica el directorio base y la extensión que estás buscando
var directorioBase = '/GitHubRepository'; // Cambia esto a tu directorio base
var extensionBuscada = '.java'; // Cambia esto a la extensión que estás buscando 
buscarArchivosConExtension(directorioBase, extensionBuscada);