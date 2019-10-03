#!/bin/bash

MESSAGE=$(cat $HUSKY_GIT_PARAMS)
PATTERN="^\[?VET\-([0-9]+)\]? (.*)$"

if ! [[ $MESSAGE =~ $PATTERN ]]; then
    echo "ERROR: Commit message did not match 'VET-123 subject' or '[VET-123] subject'"
    exit 1
fi