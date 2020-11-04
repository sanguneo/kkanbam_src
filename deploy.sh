#!/bin/bash

mv dist/CNAME backup
mv dist/.git backup
npm run generate
mv backup/CNAME dist
mv backup/.git dist
cd dist
git add .
git commit -m '$1'
git push --force
cd ..
