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

case $DRAFT in
	draft-03)
		VALIDATOR="Draft3Validator"
		;;
	draft-04)
		VALIDATOR="Draft4Validator"
		;;
	draft-06)
		VALIDATOR="Draft6Validator"
		;;
	draft-07)
		VALIDATOR="Draft7Validator"
		;;
	*)
    echo "Please define DRAFT environment variable. Supported values: draft-03, draft-04, draft-06, draft-07"
    exit 1
		;;
esac

echo "Draft: $DRAFT"
echo "Validator = $VALIDATOR"

PROBLEM=false

mkdir -p specs_clean/

for filename in $SOURCE_PATTERN; do
  VALIDATIONERROR=""
  VALIDATIONERROR=$(jsonschema --validator $VALIDATOR "$filename" 2>&1)
  EXITCODE=$?
  if [ $EXITCODE -eq 0 ]; then
    echo "OK    $filename"
  else
    echo "ERROR $filename $VALIDATIONERROR"
    PROBLEM=true
  fi
done

if [ $PROBLEM = true ]; then
  echo "VALIDATION FAILED!"
  exit 1
fi