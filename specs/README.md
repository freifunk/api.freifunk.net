# WARNING: draft-03 is DEPRECATED
JSON meta schema draft-03 has been deprecated by json-schema.org please migrate to a newer draft version as soon as 
possible.

# Why files in this folder are bad (draft-03 with wrapper)
Files in <repo>/specs/*.json are, so called, "empty schema" files, where typical schema elements are missing 
at root level of that JSON. Instead, these typical elements are below the "schema" key 
(which is NOT an offical schema element). This key acts as a "wrapper". If you want to validate a JSON instance file 
against these schema files, then you need to extract the JSON schema from "schema" key. If you do not extract, then
your JSON Instance will be evaluated against an "empty schema". Every possible JSON Instance would be valid against 
these "empty schema" files, rendering the validation process useless.

# Update your implementation
As draft-03 is deprecated you should no longer use it. Update your implementation to use e.g. draft-07. You may update 
to a newer library version or to other lib, validator, form UI vendors that support draft-07 schema files. See [draft-07](draft-07)

# If you are not able to migrate now 
If you can not change your implementation to use a lib/validator/formUI that supports draft-07, then you should at
least switch to the files in <repo>/specs/draft-03/ which are true schema files (no wrapper / no "empty schema").
If your code did "schema"-key-extraction then change your code and access schema directly at root level.