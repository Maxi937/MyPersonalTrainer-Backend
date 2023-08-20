#!/bin/bash

# This script is called on git pre-commit via wsl

# source my functions for notify-send function
source ~/myFunctions

# Run tests
numberOfTests=$(npm run testalldry | grep -o -E '[[:digit:]]?[[:digit:]] passing' | grep -o -E '[[:digit:]]?[[:digit:]]')
testOutput=$(npm run testall)
passingTests=$(echo "$testOutput" | grep -c -E '✔')
echo "$testOutput"

# notify-send - Send Windows Notification when complete
category="Personal Trainer Automated Tests"
icon="C:\Users\Matthew\Pictures\wsl-notify-icons\ubuntu.webp"
message="$passingTests/$numberOfTests passing"

notify-send -c "$category" -i "$icon" "$message";