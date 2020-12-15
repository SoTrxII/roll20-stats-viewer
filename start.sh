#!/bin/sh
for file in /usr/share/nginx/html/js/app.*.js;
do
  if [ ! -f $file.tmpl.js ]; then
    cp $file $file.tmpl.js
  fi
  envsubst '$VUE_APP_BACKEND_URL' < $file.tmpl.js > $file
done

# turn on bash's job control
set -m
nginx&
pm2-runtime server.js
