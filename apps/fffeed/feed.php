<?php
include_once("mergedrss.php");

$communities = "http://www.weimarnetz.de/ffmap/ffMap.json";

//load combined api file
$api = file_get_contents($communities);
$json = json_decode($api, true);
$geofeatures = $json['features'];

// place our feeds in an array
$feeds = array(
        'http://blog.freifunk.net/rss.xml'
);

foreach($geofeatures as $feature)
{
	foreach($feature['properties']['feeds'] as $feed )
	{
		array_push($feeds, $feed['url']);
	}
}

//print_r($feeds);

// set the header type
header("Content-type: text/xml");

// set an arbitrary feed date
$feed_date = date("r", mktime(10,0,0,9,8,2010));

// Create new MergedRSS object with desired parameters
$MergedRSS = new MergedRSS($feeds, "Freifunk Community Feeds", "http://www.freifunk.net/", "This the merged RSS feed of RSS feeds of our community", $feed_date);

//Export the first 10 items to screen
$MergedRSS->export(false, true, 10);

