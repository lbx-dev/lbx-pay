#!/bin/bash

TYPE=${BASH_ARGV[0]}

cd lbx-pay/;

killall node;
git reset --hard origin/master;
git pull origin master;
chmod +x start.sh;

./start.sh -s;

exit;
exit;