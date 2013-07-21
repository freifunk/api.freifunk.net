#!/usr/bin/python3

import json
import urllib
from optparse import OptionParser
from urllib.request import urlopen

#log helper function
def log(logLevel, message):
	if logLevel <= options.logLevel:
		print("Message from engine room (level " + str(logLevel) + "): " + message)

#define some constants
ffDirUrl = "https://raw.github.com/freifunk/api.freifunk.net/master/directory/directory.json"
ffMapOutput = "/var/www/ffmap/ffMap.json"

#read some command line arguments
parser = OptionParser()
parser.add_option("-l", "--loglevel", dest="logLevel", default=1, type=int, help="define logleel")
(options, args) = parser.parse_args()

#load directory
try:
	ffDirectoryRaw = urlopen(ffDirUrl)
except BaseException as e:
	log(0, "error reading directory " + str(e))
	exit(1)

ffDirectory = json.loads(ffDirectoryRaw.readall().decode('utf-8'))
log(4, "our directory: " + str(ffDirectory))
features=[]
#prepare GeoJSON format
ffMapData = { "type" : "FeatureCollection", "features" : features }

for community in ffDirectory:
	properties=dict()
	log(3, "working on community: " + ffDirectory[community])
	try:
		ffApi = json.loads(urlopen(ffDirectory[community]).readall().decode('utf-8'))
	except UnicodeError as e:
		try:
			ffApi = json.loads(urlopen(ffDirectory[community]).readall().decode('iso8859_2'))
			log(0, "Unicode Error: " + ffDirectory[community] + ": " + str(e) + ", try iso8859_2 instead")
			pass
		except BaseException as e:
			log(0, "Error reading community api file " + ffDirectory[community] + ": " + str(e))
			continue
	except BaseException as e:
		log(0, "Error reading community api file " + ffDirectory[community] + ": " + str(e))
		continue
	
	#add data according to http://wiki.freifunk.net/Fields_we_should_use
	try: 
		for contacts in ffApi['contact']:
			properties[contacts] = ffApi['contact'][contacts] 
		geometry = { "type" : "Point", "coordinates" : [ ffApi['location']['lon'], ffApi['location']['lat']] }
		properties['name'] = ffApi['name']
		properties['city'] = ffApi['location']['city']
		if 'address' in ffApi['location']:
			properties['address'] = ffApi['location']['address']
		properties['url'] = ffApi['url']
		if 'metacommunity' in ffApi:
			properties['metacommunity'] = ffApi['metacommunity']
		if 'events' in ffApi:
			properties['events'] = ffApi['events']
		if 'nodes' in ffApi['state']:
			properties['nodes'] = ffApi['state']['nodes']
		
		properties['mtime'] = ffApi['state']['lastchange']
	except BaseException as e:
		log(1, "There's something wrong with the JSON file: " + str(e))
		continue
	

	features.append({ "type" : "Feature", "geometry" : geometry, "properties" : properties })
	properties=""

result = json.dumps(ffMapData)
log(3, "our result: " + result)
#write summary to bin directory
try:
	f = open(ffMapOutput, "w")
	try:
		f.write(str(result))
	finally:
		f.close()
except IOError:
	pass
