WEBTARGET:=www
SCRIPTTARGET:=scripts

all: clean map feed viewer generator

pre-build:
	mkdir -p $(WEBTARGET)
	mkdir -p $(SCRIPTTARGET)

map: pre-build
	git clone -q https://github.com/freifunk/cmap.api.freifunk.net.git $(WEBTARGET)/map

feed: pre-build
	git clone -q https://github.com/freifunk/feed.api.freifunk.net.git $(WEBTARGET)/feed

viewer: pre-build
	git clone -q https://github.com/freifunk/viewer.api.freifunk.net.git $(WEBTARGET)/viewer

generator: pre-build
	cp -r generator $(WEBTARGET)

clean:
	rm -rf $(WEBTARGET)
	rm -rf $(SCRIPTTARGET)
