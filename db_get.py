#!/usr/bin/python
# -*- coding: UTF-8 -*-

# filename：test.py

# CGI处理模块
import cgi, cgitb
import mysql.connector


# 创建 FieldStorage 的实例化
form = cgi.FieldStorage() 

# 获取数据
db = form.getvalue('chose_db')
user=form.getvalue('user')
passwd=form.getvalue('password')

cnx=mysql.connector.connect(user=user,passwd=passwd,host="localhost",database=db)
cur=cnx.cursor()
cur.execute("show tables;")
results=cur.fetchall()
cnx.commit()
#get every table
m='表'



print "Content-type:text/html"
print
print "<html>"
print "<head>"
print "<meta charset=\"utf-8\">"
print "<title>Index Page</title>"
print "</head>"
print "<body>"
print "<h1 align='center'>数据库%s<h1>" % db
#print "<p>%s,%s</p>" % (user,passwd)
for table in results:
   print "<h2>Table %s</h2>" % table
   
   sql="show columns from %s;" % table
   cur.execute(sql)
   attribute=cur.fetchall()
   cnx.commit()
   #print "<p>%s</p>" % attribute
   print "<table border=\"1\"  cellpadding=\"10\">"
   print "<tr>"
   for att in attribute:
      print  "<td>%s</td>" % att[0]
   print "</tr>"
   
   sql_getvalue="select * from %s" % table
   cur.execute(sql_getvalue)
   values=cur.fetchall()
   cnx.commit()
   #print "<p>%s</p>" % values
   
   for value in values:
      #value=','.join(value)
      print "<tr>"
      for va in value:
         print "<td>%s</td>" % va
      print "<tr>"
  #    for row in values:
  # 	print  "<td>%s</td>" % row
  #    print "</tr>"    
   print"</table>"
   print "<br />"
   print """<form action="/cgi-bin/query.py" method="post">"""
   print "<input type='submit' value='操作此表' />"
   print "<input type='hidden' name='user' value=%s />" % user
   print "<input type='hidden' name='password' value=%s </input>" % passwd 
   print "<input type='hidden' name='chose_db' value=%s </input>" % db
   print "<input type='hidden' name='chose_table' value=%s </input>" % table
   print "</form>"
   print "<hr width=\"400\" align=\"left\" color=\"black\" />"
cnx.close()

print "<h3>创建表</h3>"

print "</body>"
print "</html>"
