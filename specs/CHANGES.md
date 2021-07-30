0.4.16
------
* add matrix as contact option
* remove g+ from generator

0.4.15
------
* multiple locations can be set next to the primary location

0.4.14
------
* add hopglass option to maps

0.4.13
------
* added new section for privacy policy information of the communities

0.4.11
------
* added new section for social and refugees support projects

0.4.10
------
* added more details for firmware section

0.4.9
-----
* added "meshviewer" to nodeMaps.technicalType

0.4.8
-----
* add ircs support

0.4.7
-----
* added bmxd as routing protocol (ffdresden uses bmxd)

0.4.6
-----
* added boost as donation campaign provider
* allow a "?join" at the end of contact.jabber
* added support.donations.bankaccount.usage

0.4.5
-----
* added nodelist to api as technical node map type http://freifunk-karte.de

0.4.4
-----
* changed timeline.decription to timeline.description
* added url to timeline items

0.4.3
-----
* added fields for donations and clubs
* added support->club->email
* added support->club->url

0.4.2
-----
* added support 

0.4.1
-----
* updated patterns of techDetails->dns->domainname and techDetails->dns->nameserver

0.4.0
-----
* see release notes: https://github.com/freifunk/api.freifunk.net/releases/tag/v0.4.0

0.3.3
-----
* removed bootstrap field
* splitted firmware into download and docs
* added enum with country codes

0.3.2
-----
* techDetails.updatemode is now an array ["none","manual","autoupdate"]

0.3.1
-----
* added webform in the contact
* added patterns googleplus, identica, jabber
* added podcasts in feeds category
* added ffsomething, netmon, libremap, nodewatcher, kml to nodeMaps->techinicalType
* added state->description and state->focus
* added techDetails->dns
* updated routing to array
* removed techDetails->tld and techDetails->topodata

0.3.0
-----
* added pattern for irc
* added country to location
* added batman-adv, bmx, OLSRv2 for routing

0.2.1
-----
* added services
* removed events
* added ics to feeds->category
* added default for state->lastChange also changed type from number to string
* added tld to techDetails
* updated ipv4 and ipv6

0.2.0
-----
* updated events to a string field
* added nodemaps
* added timeline