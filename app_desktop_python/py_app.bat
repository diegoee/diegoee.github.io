@echo off
cls 
::mode con: cols=90 lines=40
set script_name=%~nx0
set script_name=%script_name:.bat=%
title %script_name%.py  
echo Script root: %~dp0
echo Script name: %script_name%.py
echo --
cd %~dp0  
echo Exe script app:  
python %script_name%.py scriptMode
echo --  
del *.exe  
echo Generamos el ejecutable
rem pyinstaller --onefile --windowed %script_name%.py
echo --  
rd /s /q %~dp0\build
copy %~dp0\dist\%script_name%.exe %~dp0
rd /s /q %~dp0\dist
del *.spec  
timeout /t 10  