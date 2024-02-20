@echo off
cls
echo app_myGiroValues.py
echo %cd%
call python %cd%/app_myGiroValues.py  
timeout 1 
call %cd%\CarteraGiroPy.png
timeout 1 
del %cd%\CarteraGiroPy.png 