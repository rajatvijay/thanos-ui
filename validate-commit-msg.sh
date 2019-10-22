#!/bin/bash

MESSAGE=$(cat $HUSKY_GIT_PARAMS)
PATTERN="^(VET-[0-9]+|wip|Merge) (.*)$"

if ! [[ $MESSAGE =~ $PATTERN ]]; then
    echo "ERROR: Commit message does not have any of the following prefixes: VET-1234, wip, Merge"
    exit 1
fi