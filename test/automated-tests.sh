#!/bin/bash
output=$(npm run testall)

echo "$output"

# source my functions for notify-send function
source ~/myFunctions

# WSL-Notify Function
category="Personal Trainer Automated Tests"
icon="C:\Users\Matthew\Pictures\wsl-notify-icons\ubuntu.webp"

notify-send -c "$category" -i "$icon" "$output";
