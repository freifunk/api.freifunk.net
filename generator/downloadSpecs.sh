#!/usr/bin/env bash
#This script downloads most up-to-date Freifunk JSON Schema files from github.com/freifunk/api.freifunk.net/tree/master/specs
#We dislike redundancy as it introduces maintenance complexity, so this script avoids mirroring files in this git repo.

echo "Cleanup left-overs from previous runs..."
rm ./*.json

echo "Getting directory listing from github..."
curl -L https://api.github.com/repos/freifunk/api.freifunk.net/contents/specs > list.json

echo "Get Download URLs (filter for Freifunk JSON Schema files)..."
urls=$(jq -r '.[] | select(.name|test("^([0-9]*.){0,1}[0-9]+.[0-9]+.json$")) | .download_url' < list.json)

# multi-line value should by design be splitted line-by-line, ignore shell check:
# shellcheck disable=SC2068
for downloadUrl in ${urls[@]}
do
  echo "Downloading: ${downloadUrl}"
  wget -q "$downloadUrl"
done

rm list.json