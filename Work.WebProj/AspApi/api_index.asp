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
	'sql = "select a.* from wau_001 a where ROWNUM <= 1000" 
    sql_txt="select * from wau_010 where mark ='Y'"


	Set rs = Server.CreateObject("ADODB.Recordset")
	Set jsonArray = jsArray()

	'-- 取得資料錄
	rs.open sql_txt ,conn ,3,3,1


	do while not rs.eof
		set jsonArray(null)= jsObject()
		jsonArray(null)("OBJ_NO") =  rs.fields("OBJ_NO").value
		jsonArray(null)("OBJ_TYPE") =  rs.fields("OBJ_TYPE").value

    	jsonArray(null)("OBJ_PRICE") =  rs.fields("OBJ_PRICE").value
		jsonArray(null)("OBJ_YEAR") =  rs.fields("OBJ_YEAR").value
        jsonArray(null)("OBJ_MEMO") =  rs.fields("OBJ_MEMO").value
		jsonArray(null)("OBJ_PHOTO") =  rs.fields("OBJ_PHOTO").value
		rs.movenext
	loop

	rs.Close
    conn.Close
    set rs = nothing
    set conn = nothing
	jsonArray.Flush
%>