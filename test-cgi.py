#!/usr/bin/python
#filename:test.py

import os

print "Content-type:text/html"
print
print "<b>environment variable</b>"
print "<ul>"
for key in os.environ.keys():
	print "<li><span style='color:green'>%30s</spqn>:%s</li>" % (key,os.environ[key])
print "</ul>"
