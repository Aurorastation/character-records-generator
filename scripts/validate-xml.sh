#!/usr/bin/env bash
set -euo pipefail

schema_dir="data/schema"
fail=0

validate() {
  local schema="$1" file="$2"
  if xmllint --noout --schema "$schema" "$file" 2>&1; then
    :
  else
    fail=1
  fi
}

for f in data/species/*.xml; do
  validate "$schema_dir/species.xsd" "$f"
done

validate "$schema_dir/citizenships.xsd" data/citizenships.xml
validate "$schema_dir/languages.xsd" data/languages.xml

for f in data/templates/*.xml; do
  validate "$schema_dir/template.xsd" "$f"
done

exit $fail
