#!/bin/bash

npm install
cd packages/doenetml
npm run build
cd ../test-viewer
npm run build
