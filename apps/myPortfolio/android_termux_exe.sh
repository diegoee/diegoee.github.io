#!/usr/bin/env bash
echo "******************* EXE scrip test "
rm -r storage/shared/Downloads/temp
echo "******************* SVN exporting ..."
svn export https://github.com/diegoee/diegoee.github.io/trunk/apps/myPortfolio storage/shared/Downloads/temp/
echo "******************* installing node modules ..."
npm install --prefix storage/Downloads/temp/
echo "******************* Exe node ..."
node node storage/shared/Downloads/appPortfolio.js exe storage/shared/Downloads/Movements.xls 