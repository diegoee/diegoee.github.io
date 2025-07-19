@echo off
cls   
title Borrar ficheros 
echo --
echo Script root: %~dp0
echo --
echo Borrando...
cd %~dp0    
del *.exe  
del *.spec  
rd /s /q %~dp0\build
rd /s /q %~dp0\dist 
echo --