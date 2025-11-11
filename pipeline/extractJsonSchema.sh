#!/bin/bash

if [ -z "$SOURCE_PATTERN" ]; then
  echo "Please define SOURCE_PATTERN environment variable"
  exit 1
fi

if [ ! -d "$(dirname "$SOURCE_PATTERN")" ]; then
  echo "Directory $(dirname "$SOURCE_PATTERN") do not exists!"
  exit 1
fi

echo "Validating schema files for pattern: $SOURCE_PATTERN"

mkdir -p specs_clean/

for filename in $SOURCE_PATTERN; do

    # extract "freifunk schema" from "emtpy schema"
    # shellcheck disable=SC2094
    jq '.schema' < "$filename" > "specs_clean/$(basename "$filename")"
    filename="specs_clean/$(basename "$filename")"
    echo "Extracted schema saved in: $filename"

done

