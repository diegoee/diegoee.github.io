#!/usr/bin/env bash
clear
echo "exe test script"
rm -r storage/shared/temp
svn export https://github.com/diegoee/diegoee.github.io/trunk/apps/scriptTest storage/shared/temp/
npm install --prefix storage/shared/temp/
node storage/shared/temp/test01.js
