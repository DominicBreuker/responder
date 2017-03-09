#!/bin/bash

script="$0"
FOLDER="$(dirname $script)"

source $FOLDER/utils.sh
PROJECT_ROOT="$(abspath $FOLDER/..)"

echo "building Docker image in folder $PROJECT_ROOT"

docker build -f $PROJECT_ROOT/Dockerfile \
             -t dominicbreuker/node_responder:latest \
             $PROJECT_ROOT
