#!/bin/bash

cd /backend
npm install

pm2-runtime process.yml
