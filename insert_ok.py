#!/usr/bin/python
# -*- coding: UTF-8 -*-
import cgi, cgitb
import mysql.connector


# 创建 FieldStorage 的实例化
form = cgi.FieldStorage() 

# 获取数据
#uid = form.getvalue('uid')
fname  = form.getvalue('fname')
lname=form.getvalue('lname')
age=form.getvalue('age')
sex=form.getvalue('sex')
income=form.getvalue('income')
user=form.getvalue('user')
password=form.getvalue('password')
table=form.getvalue('chose_table')
db=form.getvalue('database')

#connect DB
cnx=mysql.connector.connect(user=user,passwd=password,host="localhost",database=db)
cur=cnx.cursor()


sql="insert into employee(first_name,last_name,age,sex,income) value (%s,%s,%s,%s,%s)"
data=(fname,lname,age,sex,income)
#data=(,'san',34,'w',789)


#sql_get="select * from employee3"
#cur.execute(sql_get)
#sql="""insert into employee3(first_name,last_name,age,sex,income) value ('leezhu','san',18,'w',1)"""

#results=cur.fetchall()

cur.execute(sql,data)
cnx.commit()
cnx.close()
print "Content-type:text/html"
print
print "<html>"
print "<head>"
print "<meta charset='utf-8'>"
print "<title>Insert ok page</title>"
print "</head>"

print "<body align='center'>"
print "<h2>添加记录成功！</h2>"
print """<form action="/cgi-bin/query.py" method="post">"""
print "<input type='submit' value='返回表' />"
print "<input type='hidden' name='user' value=%s />" % user
print "<input type='hidden' name='password' value=%s </input>" % password 
print "<input type='hidden' name='chose_db' value=%s </input>" % db
print "<input type='hidden' name='chose_table' value=%s </input>" % table
print "</form>"
#print "<p>hi</p>"
#print "<p>%s</p>" % uid
#print "<p>%s</p>" % fname
#print "<p>%s</p>" % lname
#print "<p>%s</p>" % age
#print "<p>%s</p>" % sex
#print "<p>%s</p>" % income
#print "<p>%s</p>" % user
#print "<p>%s</p>" % results
#print "<p>%s</p>" % cur
#print "<p>%s</p>" % password
#print "<p>%s</p>" % db
print "</body>"
print "</html>"
