TARGET:=files

all: clean map feed viewer generator

pre-build:
	mkdir -p $(TARGET)

map: pre-build
	git clone -q https://github.com/freifunk/cmap.api.freifunk.net.git $(TARGET)/map

feed: pre-build
	git clone -q https://github.com/freifunk/feed.api.freifunk.net.git $(TARGET)/feed

viewer: pre-build
	git clone -q https://github.com/freifunk/viewer.api.freifunk.net.git $(TARGET)/viewer

generator: pre-build
	cp -r generator $(TARGET)

clean:
	rm -rf $(TARGET)
