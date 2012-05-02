.PHONY: makeinstance dev populate server build test

import =  curl -X PUT -H 'Content-Type: $(3)' --data-binary @$(2) \
	`echo http://0.0.0.0:8080/bags/$(1)/tiddlers/$(2) | perl -pe 's/\.(html|css)//'`

loadup = sts $(1) $(2)

makeinstance:
	twinstance dev_instance
	cd dev_instance && \
		twanager bag policymaker < /dev/null && \
		twanager bag policymaker_public < /dev/null && \
		twanager bag policymaker_private < /dev/null && \
		twanager adduser foo bar

##########################################################################
## calling this creates an instance, populates it and starts the server ##
##########################################################################
dev: makeinstance server policy update import-data

policy:
	curl -X 'PUT' -d '{"policy":{"read": [], "create": ["ANY"], "manage": ["foo"], "accept": ["NONE"], "write": ["foo", "bar"], "owner": "foo", "delete": ["foo"]}}' -H 'Content-Type: application/json' http://0.0.0.0:8080/bags/policymaker_public
	curl -X 'PUT' -d '{"policy":{"read": [], "create": ["ANY"], "manage": ["foo", "bar"], "accept": ["NONE"], "write": ["foo", "bar", "doh"], "owner": "foo", "delete": ["foo"]}}' -H 'Content-Type: application/json' http://0.0.0.0:8080/bags/policymaker_private

update:
	cd lib && \
		ls *.js | while read item; do $(call import,common,$$item,text/javascript); done && \
		ls *.css | while read item; do $(call import,common,$$item,text/css); done
	cd images && \
		ls * | while read item; do $(call import,html,$$item,image/gif); done
	cd src/js && \
		ls *.js | while read item; do $(call import,policymaker,$$item,text/javascript); done
	cd src && \
		ls *.html | while read item; do $(call import,policymaker,$$item,text/html); done
	cd src/css && \
		ls *.css | while read item; do $(call import,policymaker,$$item,text/css); done

import-data:
	ls data | while read folder; do \
		cp -r data/$$folder/* dev_instance/store/bags/$$folder/tiddlers; \
	done

server:
	cd dev_instance; twanager server & echo $$! > .pid
	sleep 2 # XXX: hack: we want to give the server time to start up in the background

server-kill:
	kill `cat dev_instance/.pid` || true
#	ps | grep 'twanager' | grep -v 'grep' | \
#		awk '{ print $$1; }' | xargs kill

#############################################################
## calling this removes this instance and stops the server ##
#############################################################
clean: server-kill
	rm -r dev_instance || true

############################################################
##     Requires PhantomJS. Or open in Browser             ##
############################################################
test: build
	./qunit test/index.html
