# Official Freifunk API Schema Files (draft-07)
JSON meta schema `draft-03` has been deprecated by json-schema.org please migrate to `draft-07` schema as soon as 
possible.

# Available Freifunk API Schema (draft-07)
Folder `<repo>/specs/draft-07/` starts with Freifunk API version `0.4.14`. Older versions are not available as `draft-07`.
If you have an older Freifunk Community API file (JSON instance) please update your file by following the migration path.

# Migration Path
* `0.*.json` (draft-03) to `0.4.14.json` (draft-03)
* `0.4.14.json` (draft-03) to `0.4.14.json` (draft-07)
* `0.4.14.json` (draft-07) to latest Freifunk API Schema (draft-07) 

# Tools and libs
Known validators that support `draft-07` are:
 - [ajv](https://github.com/epoberezkin/ajv)
 - [jsonschema](https://github.com/Julian/jsonschema) 
 
 Kwown formUI that support `draft-07` are:
 - [jsonforms.io](https://jsonforms.io/)