@echo off
cls
call uninstall.bat 
echo My Portfolio: Installing ...  
call npm install 
echo My Portfolio: Starting androidjs...  
call npm run androidjs
::cd phonegap 
::del package.json
::rmdir /S /Q www
::cd ..
::robocopy www phonegap/www /E
::copy package.json phonegap 
::cd phonegap
::call npm install
::cd ..
::call cd phonegap && phonegap serve
TIMEOUT /T 5