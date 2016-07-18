#!/usr/bin/python
import cgi

form = cgi.FieldStorage()

name = form.getvalue('name')

print "Content-Type: text/html;charset=utf-8"
print
print "<html>"
print "<head>"
print "<title>test</title>"
print "</head>"
print "<body>"
print "<h2>Hello %s </h2>" % (name)
print "</body>"
print "</html>"
