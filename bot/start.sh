#!/bin/bash

cd /ts-bot
npm install

pm2-runtime process.yml
