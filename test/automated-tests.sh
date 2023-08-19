#!/bin/sh
echo "--------------------------------------------------------------------------------"
echo "AUTOMATED TESTS" 2>&1 | dialog --progressbox 30 100
npm run testall
