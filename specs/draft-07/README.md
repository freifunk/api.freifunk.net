# Official Freifunk API Schema Files (draft-07)
JSON meta schema `draft-03` has been deprecated by json-schema.org please migrate to `draft-07` schema as soon as 
possible.

# Available Freifunk API Version Numbers (as draft-07)
Folder `<repo>/specs/draft-07/` starts with Freifunk API version 0.4.14 (`draft-07`). Older version numbers are not 
available as `draft-07`.

If you have an older Freifunk Community API file (JSON instance) you have to make it valid against 0.4.14 (`draft-07`) 
by  following the migration path below.
 
File 0.4.14 (`draft-07`) is the result of our schema migration from `draft-06` to `draft-07` by following the migration 
guide from https://json-schema.org/draft-07/json-schema-release-notes.html. 

As `draft-07` is fully backward-compatible to `draft-06` our 0.4.14 (`draft-07`) is an exact copy of 0.4.14 
(`draft-06`). Newer versions (> 0.4.14) are most likely to use the new features of JSON Schema `draft-07` specification, 
but 0.4.14 (`draft-07`) is the 1:1 equivalent to its `draft-06`, `draft-04` and `draft-04` siblings, without changes to 
its validation rules.

# Migration Path for JSON Instance data (Freifunk Community API Files)
* `0.*.json` (draft-03) to `0.4.14.json` (draft-03)
* `0.4.14.json` (draft-03) to `0.4.14.json` (draft-07)

(we will extend this list, when Freifunk API moves on to newer JSON Schema specs, e.g. draft-08, etc.)

## Validate your migration (JSON instance)
Validate your JSON instance data is easy. First ensure, you have a Freifunk Community file that is valid against latest 
`draft-03` schema. If it is valid, go ahead and validate it against `draft-07`, done!
Lets say you want to migrate Freifunk Hamm Community API file (`hamm.json`) from 0.3.1 (draft-03) to 0.4.14 (draft-07) 
then validate by running:
### Preparation
``` 
wget -O draft-03_0.4.14.json https://raw.githubusercontent.com/freifunk/api.freifunk.net/master/specs/draft-03/0.4.14.json
wget -O draft-07_0.4.14.json https://raw.githubusercontent.com/freifunk/api.freifunk.net/master/specs/draft-07/0.4.14.json
```
Please change `api` key at root level of your JSON Instance (`hamm.json`) to `0.4.14 (if not done already)
Example:
```
{
  [...]
  "api": "0.4.14"
}
```

### Validation
```
jsonschema -i hamm.json draft-03_0.4.14.json
# fix issues & re-run above statement until you no longer get errors

jsonschema -i hamm.json draft-07_0.4.14.json
# you should not get errors here (if you get errors, then please get in touch with us)
```

If you need help, then ask here:
https://github.com/freifunk/api.freifunk.net/issues

# Tools and libs
Known validators that support `draft-07` are:
 - [ajv](https://github.com/epoberezkin/ajv)
 - [jsonschema](https://github.com/Julian/jsonschema), we recommend to use the dockerized tool from 
   https://hub.docker.com/r/freifunkhamm/jsonschema in your CI / CD pipeline
 
 Kwown formUI that support `draft-07` are:
 - [jsonforms.io](https://jsonforms.io/)
 
 # Freifunk Tool Vendors
 If you are developing a tool for Freifunk, e.g.:
 - [Freifunk API Generator](https://github.com/freifunk/api.freifunk.net/tree/master/generator)
 - [Freifunk Travis-CI Build Check](https://github.com/freifunk/directory.api.freifunk.net/tree/master/tests))
 - [Freifunk Community Registry Monitor](http://community-registry.ff-hamm.de/)
 - [Freifunk API data collector & aggregator](https://github.com/freifunk/common.api.freifunk.net/blob/master/collector/collectCommunities.py)
 
then please support at least the latest `draft-07` Freifunk Community API schema. 

## Migration: Hard cut
We recommend to support only the latest `draft-07` Freifunk API schema, to reduce complexity in your code and testing 
efforts. Instead of increasing your code complexity we hope to see all Freifunk Communities to migrate to new `draft-7`
and that you, the tool vendor, helps communities on migration to latest schema, instead of putting mutch efforts in wide 
schema support. Most libs do not support both schema, so you may end up having two libs as your dependencies, with 
maybe different characteristics. You should try to avoid that.

# Soft Migration
Independent from that recommendation (hard cut), feel free to implement / support the soft-migration path, where your 
code support `draft-07` +`draft-03` and all schemas at the same time.
 
If your tool is a helper tool, which is designed to make it easyer for Freifunk communities to migrate from old schema 
to newer schema, then your tool should support all possible Freifunk API schema version numbers incl. all `draft-03` 
schema. Example of such a tool is: [Freifunk API Generator](https://github.com/freifunk/api.freifunk.net/tree/master/generator) 
which will support both schema variants.

It is recommended to validate against `draft-07` schema first, and on fail to do a fallback to `draft-03` schema
if that exect Freifunk Community API schema version is also available in `draft-03` (at least for 0.4.14). For Freifunk
schema version numbers <= 0.4.13 you can directly validate against `draft-03` schema. 
 