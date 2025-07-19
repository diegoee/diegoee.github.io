@echo off
cls 
call delete_file.bat 
::mode con: cols=90 lines=40 
set script_name=main

title Generate exe... 
echo --
echo Script root: %~dp0
echo Script name: %script_name%.py 
echo --
cd %~dp0    
del *.exe  
echo Generamos el ejecutable
pyinstaller --windowed --noconfirm --clean --onefile --add-data "*;." %script_name%.py 
echo --  
rd /s /q %~dp0\build
copy %~dp0\dist\%script_name%.exe %~dp0
rd /s /q %~dp0\dist
del *.spec   
timeout /t 10  