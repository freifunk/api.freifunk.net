Worum geht's?
=============

Die Freifunk-API stellt einen Mechanismus bereit, mit dem dezentral
bereitgestellte Metadaten der einzelnen Freifunk-Communities gesammelt
und anderen Nutzern bzw. weiteren Anwendungen bereitgestellt werden
können.

Metadaten der einzelnen Communities können z.B. die Adresse der Website
der Community, der RSS-Newsfeed der Community oder die Angabe der
benutzten Freifunk-Firmware sein.

Mit den gesammelten Daten können Anwendungen
wie die **Übersichtskarte über die Freifunk-Communities**
http://community.freifunk.net/ bzw. http://api-viewer.freifunk.net/
oder auch **News-Aggregatoren** wie http://weimarnetz.de/fffeed/feed.php
umgesetzt werden.

Praktisch stellt jede Community ihre Daten in einem definierten Format
an einer ihr zugänglichen Stelle (Webspace, Wiki, Webserver) bereit und
trägt sich in das Verzeichnis ein.
Das Verzeichnis besteht lediglich aus einer Zuordnung von Community-Namen
zur URL einer Datei, die die Metadaten der Community enthält.

Die API ist *keine* Datenbank für Freifunkknoten und *kein* Verzeichnis von Firmware-Einstellungen einzelner Communities.

Dieses GitHub-Projekt stellt eine Komponente bereit,
mit der formularbasiert die relevanten Community-Metadaten eingegeben
und in das benötigte JSON-Format konvertiert werden können.
Live ist dieser *Wizard* unter http://freifunk.net/api-generator/ zu bewundern.


Bedienung
=========

Neue Städte und Freifunk-Projekte erzeugen bitte mit dem [Wizard](http://freifunk.net/api-generator/) die benötigte JSON-Datei.
Im Freifunk.net-Blog gibt es eine [Anleitung](http://blog.freifunk.net/2014/6-schritten-zum-apifile) zur Erstellung dieser Datei.

Die erzeugte Datei bitte dann in projekteigenen Webspace hochladen und die
URL der Datei hier eintragen lassen:
https://github.com/freifunk/directory.api.freifunk.net


Entstehung
==========

Zum Wireless Community Weekend 2013 in Berlin fand ein ersten Treffen
zum Relaunch unserer Website freifunk.net statt. Dabei kam auch die
Frage auf, wie man die einzelnen Freifunkcommunities am besten
präsentieren kann, ohne alle Daten zentral zu erfassen und zudem den
Communities eine einfache Möglichkeit zu bieten, eigene Daten selbst
aktuell zu halten.

In Anlehnung an die Hackerspaces API (http://hackerspaces.nl/spaceapi/)
wurde die Idee einer Freifunk-API geboren.


History
=======

At the Wireless Community Weekend 2013 in Berlin there was a first meeting to relaunch freifunk.net. To represent local communities without collecting and storing data centrally, a way had to be found. Another requirement was to enable local communities to keep their data up to date easily.

Based on the Hackerspaces API (http://hackerspaces.nl/spaceapi/) the idea of the Freifunk API was born.


License
=======
- Calender Icon: Creative Commons Attribution-Share Alike 3.0 Unported license: Font Awesome by Dave Gandy - http://fortawesome.github.com/Font-Awesome
