#!/bin/bash

cd /backend
npm install

pm2-docker process.yml
