<%@ CodePage=65001 Language="VBScript"%> 
<!--#include file="JSON_2.0.4.asp"-->
<%
	Set conn = Server.CreateObject("ADODB.Connection") 
      	conn.open "driver={Microsoft ODBC for Oracle};server=wau;uid=web;pwd=gjp4u4"

	sql = "select a.* from wau_001 a where ROWNUM <= 1000" 
	Set rs = Server.CreateObject("ADODB.Recordset")
	
	Set jsonArray = jsArray()

	'-- 取得資料錄
	rs.open sql ,conn ,3,3,1
	Set dic = CreateObject("Scripting.Dictionary")

	do while not rs.eof
		set jsonArray(null)= jsObject()
		jsonArray(null)("ISSUE_DATE") =  rs.fields("ISSUE_DATE").value
		jsonArray(null)("DESCRI") =  rs.fields("DESCRI").value
		rs.movenext
	loop

	
	jsonArray.Flush
%>