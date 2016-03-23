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

	sql_txt = "select * from car_002 where BrandNo = '" & request("brandno") & "'"
	Set rs = Server.CreateObject("ADODB.Recordset")
	Set jsonArray = jsArray()

	'-- 取得資料錄
	rs.open sql_txt ,conn ,3,3,1
	Set dic = CreateObject("Scripting.Dictionary")

	do while not rs.eof
		set jsonArray(null)= jsObject()
		jsonArray(null)("value") =  rs.fields("ModelNo").value
		jsonArray(null)("name") =  rs.fields("ModelName").value

		rs.movenext
	loop

    rs.Close
    conn.Close
    set rs = nothing
    set conn = nothing
	
	jsonArray.Flush
%>