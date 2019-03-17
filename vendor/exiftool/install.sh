#!/usr/bin/env bash
cd $HOME/vendor/exiftool/
gzip -dc Image-ExifTool-11.32.tar.gz | tar -xf -
cd Image-ExifTool-11.32
dir=$(pwd)
perl Makefile.PL
# make test
echo "export EXIFTOOL_PATH=$dir/exiftool" > $HOME/.profile