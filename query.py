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
table=form.getvalue('chose_table')

cnx=mysql.connector.connect(user=user,passwd=passwd,host="localhost",database=db)
cur=cnx.cursor()
sql_query="select * from %s" % table
cur.execute(sql_query)
results=cur.fetchall()
cur.close()
print "Content-type:text/html"
print
print "<html>"
print "<head>"
print "<meta charset=\"utf-8\">"
print "<title>Index Page</title>"
print "</head>"
print "<body>"
#print "<p>%s,%s</p>" % (user,passwd)

print "<h2>表 %s</h2>" % table
print "<table border=\"1\"  cellpadding=\"10\">"
print "<tr>"
print  "<td>uid</td>"
print  "<td>first_name</td>"
print  "<td>last_name</td>"
print  "<td>age</td>"
print  "<td>sex</td>"
print  "<td>income</td>"
print "</tr>"

for result in results:
    uid=result[0]
    fname=result[1]
    lname=result[2]
    age=result[3]
    sex=result[4]
    income=result[5]
    print "<tr>"
    print "<td>%s</td>" % uid
    print  "<td>%s</td>" % fname
    print  "<td>%s</td>" % lname
    print  "<td>%s</td>" % age
    print  "<td>%s</td>" % sex
    print  "<td>%s</td>" % income
    print "</tr>"
print"</table>"
#print "<a href=\"javascript:location.reload();\">刷新查询</a>"
print "<h3>删除表记录</h3>"
print """<form action="/cgi-bin/delete_ok.py" method="post");>"""
print "(输入您需要删除记录的id(以','隔开))<br /><input type='text' name='uid_list'>"
print "<input type='submit' value='删除' />"
print "<input type='hidden' name='user' value=%s />" % user
print "<input type='hidden' name='password' value=%s </input>" % passwd 
print "<input type='hidden' name='database' value=%s </input>" % db
print "<input type='hidden' name='chose_table' value=%s </input>" % table
print "</form>"
print "<h3>向表中添加记录:</h3>"

print """<form action="/cgi-bin/insert_ok.py" method="post">"""
print "firstName: <input type='text' name='fname'>"  
print "<br />"
print "lastName: <input type='text' name='lname' />" 
print "<br />"
print "age: <input type='text' name='age' />" 
print "<br />"
print "sex: <input type='text' name='sex' />" 
print "<br />"
print "income: <input type='text' name='income' />" 
print "<br />"
print "<input type='submit' value='添加' />"
print "<input type='hidden' name='user' value=%s />" % user
print "<input type='hidden' name='password' value=%s </input>" % passwd 
print "<input type='hidden' name='database' value=%s </input>" % db
print "<input type='hidden' name='chose_table' value=%s </input>" % table
print "</form>"

print "</body>"
print "</html>"
