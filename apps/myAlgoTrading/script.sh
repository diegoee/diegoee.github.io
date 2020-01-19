#!/bin/bash 
## ps aux | grep node   
rm -r output &   
rm -r node_modules &   
pkill node & 
node main.js &