#!/usr/bin/python3

import json
import urllib
from optparse import OptionParser
from urllib.request import urlopen
from datetime import tzinfo, timedelta, datetime

#log helper function
def log(logLevel, message):
	if logLevel <= options.logLevel:
		print("Message from engine room (level " + str(logLevel) + "): " + message)

#load directory
def loadDirectory(url):
	try:
		ffDirectoryRaw = urlopen(url, None, 10)
	except BaseException as e:
		log(0, "error reading directory " + str(e))
		exit(1)

	return json.loads(ffDirectoryRaw.readall().decode('utf-8'))

#create a summarized json file, works as cache
def summarizedJson(ffDir, path):
	time = datetime.now().isoformat(' ')
	summary = dict() 
	#open summarized file first
	try:
		summaryFile = open(path, "r")
	except IOError as e:
		if e.errno == 2:
			summaryFile = open(path, "w")
		else:
			log(0, "error opening summary file " +str(e))
			exit(1)
	except BaseException as e:
		log(0, "error opening summary file " +str(e))
		exit(1)
	
	if summaryFile.mode == "r":
		content = summaryFile.read()
		if content != "":
			log(4, "cache file " +content)
			summary = json.loads(content)
		#close and reopen file
		summaryFile.close()
		summaryFile = open(path, "w")
	if summary is None:
		summary = dict()

	for community in ffDir:
		log(3, "working on community: " + ffDir[community])
		try:
			ffApi = json.loads(urlopen(ffDir[community], None, 10).readall().decode('utf-8'))
		except UnicodeError as e:
			try:
				ffApi = json.loads(urlopen(ffDir[community]).readall().decode('iso8859_2'))
				log(0, "Unicode Error: " + ffDir[community] + ": " + str(e) + ", try iso8859_2 instead")
				pass
			except BaseException as e:
				log(0, "Error reading community api file " + ffDir[community] + ": " + str(e))
				continue
		except BaseException as e:
			log(0, "Error reading community api file " + ffDir[community] + ": " + str(e))
			continue

		ffApi['mtime'] = time
		summary[community] = ffApi
	log(4, "our summary: " + str(summary))
	summaryResult = json.dumps(summary, indent=4)

	try:
		summaryFile.write(str(summaryResult))
		summaryFile.flush()
	finally:
		summaryFile.close()

#create geojson output
def geoJson(summary, geoJsonPath):

	features=[]
	#prepare GeoJSON format
	ffGeoJson = { "type" : "FeatureCollection", "features" : features }

	for community in summary:
		properties=dict()
		details = summary[community]
		log(3, "working on community: " + str(summary[community]))
	
		#add data according to http://wiki.freifunk.net/Fields_we_should_use
		try: 
			geometry = { "type" : "Point", "coordinates" : [ details['location']['lon'], details['location']['lat']] }
			properties['name'] = details['name']
			properties['city'] = details['location']['city']
			if 'address' in details['location']:
				properties['address'] = details['location']['address']
			properties['url'] = details['url']
			if 'metadetails' in details:
				properties['metadetails'] = details['metadetails']
			if 'feeds' in details:
				properties['feeds'] = details['feeds']
			if 'events' in details:
				properties['events'] = details['events']
			if 'nodes' in details['state']:
				properties['nodes'] = details['state']['nodes']
		
			properties['mtime'] = details['state']['lastchange']
			properties[contacts] = details['contact']
		except BaseException as e:
			log(1, "There's something wrong with the JSON file: " + str(e))
			continue
	

		features.append({ "type" : "Feature", "geometry" : geometry, "properties" : properties })
		properties=""

	result = json.dumps(ffGeoJson, indent=4)
	log(3, "our result: " + result)
	#write summary to bin directory
	try:
		f = open(geoJsonPath, "w")
		try:
			f.write(str(result))
		finally:
			f.close()
	except IOError:
		pass

#define some constants
ffDirUrl = "https://raw.github.com/freifunk/api.freifunk.net/master/directory/directory.json"
ffGeoJson = "/var/www/ffmap/ffGeoJson.json"
ffSummarizedJson = "/var/www/ffmap/ffSummarizedDir.json"
ffHtmlTable = "/var/www/ffmap/ffHtmlTable.html"

#read some command line arguments
parser = OptionParser()
parser.add_option("-l", "--loglevel", dest="logLevel", default=1, type=int, help="define logleel")
parser.add_option("-g", "--geojson", dest="geoJSON", default=True, action="store_true", help="Output format: geoJSON")
(options, args) = parser.parse_args()

#first step: load directory
ffDirectory = loadDirectory(ffDirUrl) 
log(4, "our directory: " + str(ffDirectory))

#second step: write all information to a summarized json
summarizedJson(ffDirectory, ffSummarizedJson)

#now create all other formats
#open summary file
try:
	summaryFile = open(ffSummarizedJson)
	summary = json.loads(summaryFile.read())
	summaryFile.close()
except IOError as e:
	log(0, "error working on summary file " +str(e))
	 
if options.geoJSON:
	geoJson(summary, ffGeoJson)

