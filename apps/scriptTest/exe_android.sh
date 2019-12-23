#!/usr/bin/env bash
echo "******************* EXE scrip test "
rm -r storage/shared/temp
echo "******************* SVN exporting ..."
svn export https://github.com/diegoee/diegoee.github.io/trunk/apps/scriptTest storage/shared/temp/
echo "******************* installing node modules ..."
npm install --prefix storage/shared/temp/
echo "******************* Exe node ..."
node storage/shared/temp/test01.js
