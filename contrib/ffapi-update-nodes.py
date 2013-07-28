#!/usr/bin/python

# This script can be used to dynamically update your ffapi-json-file with 
# the number of currently running nodes.

# The number of running nodes is received by parsing the output of the olsr
# jsoninfo plugin.

# Quickly hacked together by soma (freifunk at somakoma dot de) and released
# into the public domain.

# Version: 0.1

import os
import socket
import json
import time

# Configuration - replace these variables with your settings

host = '127.0.0.1'
port = 9090
apiFile = "/var/www/weimarnetz.json"

# End of configuration

def getTopo():
    """ Get the topology information from jsoninfo and return a dictionary """
    response = ''
    try:
        s = socket.socket()
        s.settimeout(10)
        s.connect((host, port))
        s.send('/topology')
        buffer = s.recv(4096)
        while buffer:
            response += buffer
            buffer = s.recv(4096)
    except socket.error, e:
        print 'Error, could not connect to %(host)s:%(port)s' % {"host": host, "port": port}
        print 'Make sure the host is reachable and jsoninfo is running there.'
        exit()

    topo = {}
    if response != '':
        topo = json.loads(response)['topology']
    else:
        print 'Could not get any info from jsoninfo on %(host)s:%(port)s' % {"host": host, "port": port}
        print 'Does it accept connections from this host?'
        exit()
    return topo

def uniqueIPs(topo):
    """ Iterate over a topology dictionary and create an array of unique node ips """
    ips = []
    for t in topo:
        ip = t['destinationIP']
        if not ip in ips:
            ips.append(ip)
    return ips

def loadApiFile():
    """ Load an api file into a dictionary """
    if not os.access(apiFile, os.R_OK):
        print 'Error: Could not read %(file)s.' % { "file": apiFile }
        print 'Make sure the path is correct and your user has read and write permissions.'
        exit()
    with open(apiFile, 'r') as ffapi:
        apidict = json.load(ffapi)
        ffapi.closed
    return apidict

def updateApiFile(apiDict, countNodes):
    """ Updates an ffapi dictionary with number of nodes and timestamp """
    try:
        apiDict['state']['nodes'] = countNodes
    except KeyError:
        print 'Could not update %(field)s in the ffapi dictionary.' % { "field": "['state']['nodes']" }

    try:
        apiDict['state']['lastchange'] = int(time.time())
    except KeyError:
        print 'Could not update %(field)s in the ffapi dictionary.' % { "field": "['state']['lastchange']" }
    return apiDict

def writeApiFile(content):
    """ writes the dictionary to the ffapi json file """
    if not os.access(apiFile, os.W_OK):
        print 'Error: Could not write %(file)s.' % { "file": apiFile }
        print 'Make sure the path is correct and your user has write permissions for it.'
        exit()

    with open(apiFile, 'w') as ffapi:
        ffapi.write(json.dumps(content, indent=4))
    return True


def main():
    countNodes = len(uniqueIPs(getTopo()))
    apiDict = loadApiFile()
    apiDictUpdated = updateApiFile(apiDict, countNodes)

    if writeApiFile(apiDictUpdated):
        print 'Update of %(file)s successful. We have %(nodes)s Nodes.' % { "file": apiFile, "nodes": countNodes }

if __name__ == "__main__":
    main()
