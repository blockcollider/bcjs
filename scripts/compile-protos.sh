#!/bin/bash

for file in protos/*.proto ; do
    basename="${file%.*}"
    ./node_modules/.bin/pbjs -t static-module -w es6 $file -o src/$basename.js
    ./node_modules/.bin/pbts -o src/$basename.ts.d src/$basename.js
done
