# Freifunk API Generator
A simple GUI for API files generation http://freifunk.net/api-generator/

## Features 

* Generate compatible JSON file to be used by Freifunk API
* Validate API files contents
* Modify your community's API file (if it's already added to [Freifunk API directory](https://github.com/freifunk/directory.api.freifunk.net/blob/master/directory.json))
* Download file as JSON

For the complete JSON schema, visit [here](https://github.com/freifunk/api.freifunk.net/blob/master/specs/development.json).

## How to install
To create an instance of the generator, follow these simple steps : 
* clone the repo `git clone https://github.com/freifunk/api.freifunk.net.git`
* create the configuration file, name it `config.json` and put it in the current folder. A sample configuration file is available for you to make a copy.
* copy all spec files run: "cd generator && ./downloadSpecs.sh"
* let your local webserver point its document root to <gitRoot>/generator/
* Visit the generator at `localhost/[..]/api.freifunk.net/generator`
