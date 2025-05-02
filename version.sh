#!/usr/bin/env bash

VERSION=$(cat version.txt)

git add .
git commit -m "version: update version to $VERSION"

git tag "v$VERSION"

git push origin HEAD
echo "Pushed v$VERSION to remote"
