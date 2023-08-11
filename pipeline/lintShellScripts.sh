#!/bin/bash
set -e

for filename in **/*.sh; do
    echo "Linted shell scripts: $filename"
    shellcheck "$filename"
done

