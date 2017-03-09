#!/bin/bash

script="$0"
FOLDER="$(pwd)/$(dirname $script)"

source $FOLDER/utils.sh
PROJECT_ROOT="$(abspath $FOLDER/..)"
echo "project root folder $PROJECT_ROOT"

echo "build docker image"
/bin/bash $FOLDER/build.sh

##### VOLUMES #####

##### RUN #####
echo "Starting container..."

docker run --rm \
           --name responder \
           -it \
           -p 8888:8888 \
           --env-file $PROJECT_ROOT/secrets/env \
           dominicbreuker/node_responder:latest \
           sh -c "node index.js"


# docker run --rm \
#            --name responder \
#            --link intent \
#            -it \
#            -p 8888:8888 \
#            --env-file $PROJECT_ROOT/secrets/env \
#            dominicbreuker/node_responder:latest \
#            sh -c "node index.js"
