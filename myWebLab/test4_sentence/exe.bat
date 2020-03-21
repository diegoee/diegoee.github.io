@echo off  
cls
title downloadSentences.js
rmdir /S /Q node_modules
del package-lock.json 
call npm install 
title downloadSentences.js
node downloadSentences.js 
rmdir /S /Q node_modules
del package-lock.json  
TIMEOUT /T 15 