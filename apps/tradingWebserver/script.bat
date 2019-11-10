@echo off
cls
echo running server ... 
IF EXIST node_modules (
npm run startLocal && TIMEOUT /T 15   
) ELSE (
rmdir /S /Q node_modules 
rmdir /S /Q output    
del package-lock.json 
npm run installAndStartLocal && TIMEOUT /T 15  
) 
pause 
exit 

