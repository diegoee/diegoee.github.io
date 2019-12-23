#!/usr/bin/env bash
echo "******************* EXE scrip test "
rm -r storage/shared/temp
echo "******************* SVN exporting ..."
svn export https://github.com/diegoee/diegoee.github.io/trunk/apps/myPortfolio storage/shared/temp/
echo "******************* installing node modules ..."
npm install --prefix storage/temp/
echo "******************* Exe node ..."
node storage/shared/temp/appPortfolio.js exe storage/shared/Download/Movements.xls 