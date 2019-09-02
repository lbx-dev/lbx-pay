#!/bin/bash

type=${BASH_ARGV[0]}
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
RANDOM_SECURITY=$(cat /dev/urandom | env LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w 512 | head -n 1)

export NODE_PATH=.;
export RANDOM_SECURITY=$RANDOM_SECURITY;
case "$type" in
    "--production" | "-p")
        echo "Not yet implemented"
        ;;

    "--staging" | "-s")
        export NODE_ENV=staging;

        set -e;

        npm install;
        echo "Building nuxt";
        npm run nuxt build -- -c app/view/nuxt.config.js

        knex migrate:latest;

        mkdir -p ${DIR}/app/database/memory;
        node app/database/memory-migrations/memory-migrations.service.js;

        screen -dmS lbx-pay node index.js &
        ;;
    "--integration-testing" | "-it")
        export NODE_ENV=staging;
        export INTEGRATION_TESTING=true;

        set -e;
        mkdir -p ${DIR}/app/database/memory;

        npm install;
        node app/database/seeding/seeding.service.js purge;
        knex migrate:latest;

        node app/database/memory-migrations/memory-migrations.service.js;
        node app/database/seeding/seeding.service.js initial;

        node index.js;

        echo 'Removing the sqlite database';
        rm app/database/memory/database.sqlite;

        ;;
    "---automatic-integration-testing" | "-ait")
        export NODE_ENV=staging;
        export INTEGRATION_TESTING=true;

        mkdir -p ${DIR}/app/database/memory;
        {
            npm install;
            node app/database/seeding/seeding.service.js purge &&
            knex migrate:latest &&
            node app/database/seeding/seeding.service.js initial &&
            sudo mount-tmpfs.sh ${DIR}/app/database/memory -m &&
            node app/database/memory-migrations/memory-migrations.service.js;

       } || {
            echo "Seeding failed. Is the database alive? "
            exit 2;
       }

        node index.js;

        echo 'Removing the sqlite database';
        rm app/database/memory/database.sqlite;
        sudo mount-tmpfs.sh ${DIR}/app/database/memory -u;
        ;;
    "--development" | "-d")
        set -e;

        docker-compose up -d --no-recreate;
        mkdir -p ${DIR}/app/database/memory;

        knex migrate:latest;
        node app/database/memory-migrations/memory-migrations.service.js;

        node index.js;
        ;;
    *)
       echo "error";
        ;;
esac