#!/usr/bin/python
# -*- coding: UTF-8 -*-
import cgi, cgitb
import mysql.connector


# 创建 FieldStorage 的实例化
form = cgi.FieldStorage() 

# 获取数据
uid_get=form.getvalue('uid_list')
user=form.getvalue('user')
password=form.getvalue('password')
db=form.getvalue('database')
table=form.getvalue('chose_table')

uid_list=uid_get.split(',')
cnx=mysql.connector.connect(user=user,passwd=password,host="localhost",database=db)
cur=cnx.cursor()
for uid in uid_list:
   sql="delete from employee where uid=%s" % uid
   cur.execute(sql)
   cnx.commit()
cnx.close()

#connect DB

print "Content-type:text/html"
print
print "<html>"
print "<head>"
print "<meta charset='utf-8'>"
print "<title>Insert ok page</title>"
print "</head>"

print "<body align='center'>"
print "<br />"
print "<br />"
print "<br />"
print "<h1>删除成功!</h1>" 
#print "<p>%s</p>"% table
print """<form action="/cgi-bin/query.py" method="post">"""
print "<input type='submit' value='返回表' />"
print "<input type='hidden' name='user' value=%s />" % user
print "<input type='hidden' name='password' value=%s </input>" % password 
print "<input type='hidden' name='chose_db' value=%s </input>" % db
print "<input type='hidden' name='chose_table' value=%s </input>" % table
print "</form>"
#print "<p>%s</p>" % uid_list

#print "<p>%s</p>" % user
#print "<p>%s</p>" % password
#print "<p>%s</p>" % db
print "</body>"
print "</html>"
