<?php
include_once("mergedrss.php");

$communities = "http://www.weimarnetz.de/ffmap/ffMap.json";

//load combined api file
$api = file_get_contents($communities);
$json = json_decode($api, true);
$geofeatures = $json['features'];

// place our feeds in an array
$feeds = array(
        array('http://blog.freifunk.net/rss.xml','blog.freifunk.net','http://blog.freifunk.net'),
        array('http://freifunkstattangst.de/feed/', 'freifunk statt Angst','http://freifunkstattangst.de'),
	array('http://radio.freifunk-bno.de/freifunk_radio_feedfeed.xml', 'Freifunk Radio', 'http://wiki.freifunk.net/Freifunk.radio')
);

foreach($geofeatures as $feature)
{
	if ( $feature['properties']['feeds'] != "" ) {
		foreach($feature['properties']['feeds'] as $feed )
		{
			if ($feed['category'] == "blog") {
				array_push($feeds, array($feed['url'],$feature['properties']['name'], $feature['properties']['url']))  ;
			}
		}
	}
}



// set the header type
header("Content-type: text/xml");

// set an arbitrary feed date
$feed_date = date("r", mktime(10,0,0,9,8,2010));

// Create new MergedRSS object with desired parameters
$MergedRSS = new MergedRSS($feeds, "Freifunk Community Feeds", "http://www.freifunk.net/", "This the merged RSS feed of RSS feeds of our community", $feed_date);

//Export the first 10 items to screen
$MergedRSS->export(false, true, 50);

