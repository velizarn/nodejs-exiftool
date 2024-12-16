#!/usr/bin/env bash

rm -rf node_modules
rm -rf package-lock.json

npm cache clean --force

npm install --ignore-scripts

npm dedupe

npm audit fix

npm run hplugins