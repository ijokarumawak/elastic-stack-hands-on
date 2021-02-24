#!/bin/sh
while true
do
  echo -n "Input: "
  read message
  echo $(date +"%Y-%m-%dT%H:%M:%S%z") $message
done
exit
