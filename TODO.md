TODO
====

directory
---------
- find a space to put the directory file
- give a possibility to add new communities via web form (maybe ask the SpaceAPI developers)
- provide a way to cache the json file, if the communities web server is weak
  - why not try the obvious instead? Let the others know how often your API wants to be parsed.
  - [http://spaceapi.net/documentation#documentation-ref-13-root-cache-schedule](http://spaceapi.net/documentation#documentation-ref-13-root-cache-schedule)

generator
---------
- build a validator to approve given json files (as of now, we can only generate a file from a web form)
- use the directory to load and approve the json files

api
---
- use links instead of copying files between directories
- create a cache mode for collectCommunities.py
