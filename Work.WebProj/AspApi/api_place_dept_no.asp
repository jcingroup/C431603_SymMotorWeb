<%@  codepage="65001" language="VBScript" %>
<%
    response.addHeader "Access-Control-Allow-Origin", "*"
    response.contentType = "application/json"
    response.charset="utf-8"
%>
<!--#include file="JSON_2.0.4.asp"-->
<%
	Set conn = Server.CreateObject("ADODB.Connection") 
      	conn.open "driver={Microsoft ODBC for Oracle};server=wau;uid=web;pwd=gjp4u4"

    sql_txt=    "select distinct a.place_dept_no,c.dept_cname from wau_001 a,wau_006 b,prm06 c "
    sql_txt=sql_txt+ "   where a.obj_no=b.obj_no and to_char(sysdate,'yyyymmddhh24miss') between b.start_date||b.start_time and b.end_date||b.end_time and a.place_dept_no=c.dept_no   "

	Set rs = Server.CreateObject("ADODB.Recordset")
	Set jsonArray = jsArray()

	'-- 取得資料錄
	rs.open sql_txt ,conn ,3,3,1
	Set dic = CreateObject("Scripting.Dictionary")

	do while not rs.eof
		set jsonArray(null)= jsObject()
		jsonArray(null)("value") =  rs.fields("place_dept_no").value
		jsonArray(null)("name") =  rs.fields("dept_cname").value

		rs.movenext
	loop

    rs.Close
    conn.Close
    set rs = nothing
    set conn = nothing
	
	jsonArray.Flush
%>