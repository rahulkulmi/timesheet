#!/bin/bash

cd /ts-bot
npm install

pm2-docker process.yml
