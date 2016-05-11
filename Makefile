WEBTARGET:=www
SCRIPTTARGET:=scripts
SRCTARGET:=src

all: clean map feed viewer generator

pre-build:
	mkdir -p $(WEBTARGET)
	mkdir -p $(SRCTARGET)
	mkdir -p $(SCRIPTTARGET)
	git clone -q https://github.com/freifunk/common.api.freifunk.net.git $(SRCTARGET)/common
	cp -r $(SRCTARGET)/common/collector $(SCRIPTTARGET)/
	mkdir -p $(WEBTARGET)/calendar
	cp -r $(SRCTARGET)/common/ics-collector $(WEBTARGET)/calendar

map: pre-build
	git clone -q https://github.com/freifunk/cmap.api.freifunk.net.git $(SRCTARGET)/map
	mkdir -p $(WEBTARGET)/map
	cp -r $(SRCTARGET)/map/* $(WEBTARGET)/map

feed: pre-build
	git clone -q https://github.com/freifunk/feed.api.freifunk.net.git $(SRCTARGET)/feed
	mkdir -p $(WEBTARGET)/feed
	cp -r $(SRCTARGET)/feed/* $(WEBTARGET)/feed

viewer: pre-build
	git clone -q https://github.com/freifunk/viewer.api.freifunk.net.git $(SRCTARGET)/viewer
	mkdir -p $(WEBTARGET)/viewer
	cp -r $(SRCTARGET)/viewer/* $(WEBTARGET)/viewer

generator: pre-build
	cp -r generator $(WEBTARGET)

clean:
	rm -rf $(WEBTARGET)
	rm -rf $(SRCTARGET)
	rm -rf $(SCRIPTTARGET)
