#!/usr/bin/python
# -*- coding: UTF-8 -*-

# filename：test.py

# CGI处理模块
import cgi, cgitb
import mysql.connector


# 创建 FieldStorage 的实例化
form = cgi.FieldStorage() 

# 获取数据
name = form.getvalue('name')
pwd  = form.getvalue('pwd')

cnx=mysql.connector.connect(user=name,password=pwd,host="localhost")
cur=cnx.cursor()
cur.execute("show databases;")
results=cur.fetchall()
me="you"
print "Content-type:text/html"
print
print "<html>"
print "<head>"
print "<meta charset=\"utf-8\">"
print "<title>Index Page</title>"
print "</head>"
print "<body >"
print "<h1 align=\"center\">成功进入数据库</h1>"
print "<h3>数据库</h3>"
print "<hr width=\"200\" align=\"left\" />"
#print "<p>uid\t\tfirst_name\t\tlast_name\t\tage\t\tsex\t\tincome</p>"

print """<form action="/cgi-bin/db_get.py" method="post"  >"""
#print "<form>"
for db in results: 
    database=''.join(db) 
    print "<table >"
    print "<tr>"
    print "<td>"  
    print "<input type='radio' name='chose_db' value=\"%s\" </input> %s" % (database,database)
    print"</td>"
    print "</tr>" 
    print "</table>"
print "<hr width=\"200\" align=\"left\" />"
#hidden way to transfer data
print "<input type='hidden' name='user' value=%s>" % name
print "<input type='hidden' name='password' value=%s>" % pwd
print "<input type='submit' value='选中数据库查看' />"
print "</form>" 

#build db


#print    
#print "<p>%s</p>" % (db)

print "</body>"
print "</html>"
