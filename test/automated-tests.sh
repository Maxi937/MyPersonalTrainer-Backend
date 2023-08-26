#!/bin/bash
# shellcheck disable=SC1090

# This script is called on git pre-commit via wsl

# source my functions for notify-send function
source ~/myFunctions

# Send Windows Notification when complete
category="Personal Trainer Automated Tests"
icon="C:\Users\Matthew\Pictures\wsl-notify-icons\ubuntu.webp"
message="Running Automated Tests"

# Send Toast
notify-send -c "$category" -i "$icon" "$message";

# Run tests
# dry run to get total number of tests
numberOfTests=$(npm run testalldry | grep -o -E '[[:digit:]]?[[:digit:]] passing' | grep -o -E '[[:digit:]]?[[:digit:]]')

testOutput=$(npm run testall)
# Reason for two check marks - When run through GIT a different check mark character is used in the output.
passingTests=$(echo "$testOutput" | grep -c -E '✔|√') 

#Test ouput to console
echo "$testOutput"

# Send Windows Notification when complete
category="Personal Trainer Automated Tests"
icon="C:\Users\Matthew\Pictures\wsl-notify-icons\ubuntu.webp"
message="$passingTests/$numberOfTests passing"

# Send Toast
notify-send -c "$category" -i "$icon" "$message";

# Exit with success if all tests pass or fail if not
if [ "$passingTests" -eq "$numberOfTests" ]
then
    exit 0
fi

exit 1
