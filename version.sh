#!/usr/bin/env bash

VERSION=$(tr -d '[:space:]' < version.txt)

git fetch --tags --quiet
LATEST_TAG=$(git describe --tags --abbrev=0)
REMOTE_VERSION=${LATEST_TAG#v}
REMOTE_VERSION=$(echo "$REMOTE_VERSION" | tr -d '[:space:]')

echo "Local version: $VERSION"
echo "Remote version: $REMOTE_VERSION"

if [ "$VERSION" = "$REMOTE_VERSION" ]; then
  echo "Local and remote version are same. Do not update"
  exit 1
fi

(
  cd pages || exit 1
  npm version $VERSION --no-git-tag-version
)

(
  cd api || exit 1
  sed -i "s/version = \"[^\"]*\"/version = \"$VERSION\"/" build.gradle.kts
)

git add .
git commit -m "version: update version to $VERSION"

git push origin HEAD
echo "Pushed v$VERSION to remote"
