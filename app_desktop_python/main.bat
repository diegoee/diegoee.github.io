@echo off
cls 
call delete_file.bat 
::mode con: cols=90 lines=40
set script_name=%~nx0
set script_name=%script_name:.bat=%
set script_name=%script_name%.py 

title %script_name% 
echo --
echo Script root: %~dp0
echo Script name: %script_name% 
echo --
cd %~dp0   
python %script_name% 
timeout /t 10  