@echo off 
cls
set script_bat=%~nx0
set script_py=%~n0.py 
set root=%~dp0
TITLE %script_bat% 
echo %root%%script_py%  
echo. 
python %root%%script_py%  
echo. 
timeout 25   