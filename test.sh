#!/bin/bash

TYPE=${BASH_ARGV[0]}

case "$TYPE" in
    "--unit" | "-u")
        find ./app/api -name '*\.test.js' | NODE_PATH=. xargs npm run mocha -R
        ;;
    "--lint" | "-l")
        npm run eslint app/**/*.js app/**/*.vue
        ;;
    "--integration" | "-i")
        bash start.sh -it
        ;;
    "--automatic-integration" | "-ai")
        bash start.sh -ait
        ;;
    *)
       echo "error"
        ;;
esac