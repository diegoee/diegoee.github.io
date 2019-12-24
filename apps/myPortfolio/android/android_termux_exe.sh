#!/usr/bin/env bash
echo "******************* EXE scrip test "
rm -r storage/shared/temp
echo "******************* SVN exporting ..."
svn export https://github.com/diegoee/diegoee.github.io/trunk/apps/myPortfolio storage/shared/temp/
echo "******************* installing node modules ..."
cp storage/shared/temp/appPortfolio.js storage/shared/temp/android
cd storage/shared/temp/android
npm install
cd ..
cd ..
cd ..
echo "******************* Exe node ..."
node storage/shared/temp/android/appPortfolio.js exe storage/shared/Download/Movements.xls 