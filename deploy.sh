#!/bin/bash
COMMIT_MSG=`git log --pretty=format:"%s" -1`
mv dist/CNAME backup
mv dist/.git backup
npm run generate
mv backup/CNAME dist
mv backup/.git dist
cd dist
git add .
git commit -m "$COMMIT_MSG"
git push --force
cd ..
