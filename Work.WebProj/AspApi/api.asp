<%@  codepage="65001" language="VBScript" %>
<%
    response.addHeader "Access-Control-Allow-Origin", "*"
    response.contentType = "application/json"
    response.charset="utf-8"
     %>
<!--#include file="JSON_2.0.4.asp"-->
<%

    h_obj_brand=request("h_obj_brand")
    h_obj_type=request("h_obj_type")
    h_obj_color=request("h_obj_color")
    h_obj_born_date=request("h_obj_born_date")
    h_place_dept_no=request("h_place_dept_no")
    h_list_price=request("h_list_price")

	Set conn = Server.CreateObject("ADODB.Connection") 
      	conn.open "driver={Microsoft ODBC for Oracle};server=wau;uid=web;pwd=gjp4u4"
	'sql = "select a.* from wau_001 a where ROWNUM <= 1000" 
    sql_txt="                 select a.obj_no,a.obj_brand,             "
    sql_txt=sql_txt+        "        a.obj_type,a.obj_model,a.obj_color,substr(a.obj_born_date,1,4) ori_year,                   "
    sql_txt=sql_txt+        "        a.issue_date,a.place_dept_no,a.list_price/10000 list_price,c.dept_cname,a.auc_no, d.end_date,d.end_time,d.now_price/10000 now_price,d.d_price/10000 d_price "
    sql_txt=sql_txt+        " from wau_001 a,prm06 c,wau_006 d where 1=1 "

    sql_txt=sql_txt+        "        and a.place_dept_no=c.dept_no and a.obj_no=d.obj_no   "   
    sql_txt=sql_txt+        "        and to_char(sysdate,'yyyymmddhh24miss') between d.start_date||d.start_time and d.end_date||d.end_time              "
    sql_txt=sql_txt+        "        and a.status='1' and d.end_yn is null                                          "
	  '修改SYM帳號登入能查詢A級和B級的拍賣車 by Donald 20091020
    sql_txt=sql_txt+        "        and a.issue_code in ('A','B')                                                  "
	  
    if h_obj_brand<>"" then sql_txt=sql_txt+" and lower(a.obj_brand) = lower('"+trim(h_obj_brand)+"')"      
    if h_obj_type<>"" then sql_txt=sql_txt+" and lower(a.obj_type) like lower('%"+trim(h_obj_type)+"%') "
    if h_obj_color<>"" then sql_txt=sql_txt+" and a.obj_color ='"+trim(h_obj_color)+"' "
    if h_obj_born_date<>"" then sql_txt=sql_txt+" and substr(a.obj_born_date,1,4)='"+trim(h_obj_born_date)+"' "         
    if h_place_dept_no<>"" then sql_txt=sql_txt+" and a.place_dept_no='"+trim(h_place_dept_no)+"' "     
    if h_list_price<>"" then sql_txt=sql_txt+" and a.list_price<="+trim(h_list_price)     
    sql_txt=sql_txt+        " order by a.auc_no desc   "

	Set rs = Server.CreateObject("ADODB.Recordset")
	Set jsonArray = jsArray()

	'-- 取得資料錄
	rs.open sql_txt ,conn ,3,3,1
	Set dic = CreateObject("Scripting.Dictionary")

	do while not rs.eof
		set jsonArray(null)= jsObject()
		jsonArray(null)("obj_no") =  rs.fields("obj_no").value
		jsonArray(null)("obj_brand") =  rs.fields("obj_brand").value

    	jsonArray(null)("obj_type") =  rs.fields("obj_type").value
		jsonArray(null)("obj_model") =  rs.fields("obj_model").value
        jsonArray(null)("obj_color") =  rs.fields("obj_color").value
		jsonArray(null)("ori_year") =  rs.fields("ori_year").value
        jsonArray(null)("issue_date") =  rs.fields("issue_date").value
		jsonArray(null)("place_dept_no") =  rs.fields("place_dept_no").value
        jsonArray(null)("list_price") =  rs.fields("list_price").value
		jsonArray(null)("dept_cname") =  rs.fields("dept_cname").value

    	jsonArray(null)("auc_no") =  rs.fields("auc_no").value
        jsonArray(null)("end_date") =  rs.fields("end_date").value
		jsonArray(null)("end_time") =  rs.fields("end_time").value
        jsonArray(null)("now_price") =  rs.fields("now_price").value
		jsonArray(null)("d_price") =  rs.fields("d_price").value
		rs.movenext
	loop

	rs.Close
    conn.Close
    set rs = nothing
    set conn = nothing
	jsonArray.Flush
%>