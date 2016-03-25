<%@  codepage="65001" language="VBScript" %>
<%
    response.addHeader "Access-Control-Allow-Origin", "*"
    response.contentType = "application/json"
    response.charset="utf-8"
     %>
<!--#include file="JSON_2.0.4.asp"-->
<%

    h_auc_no=request("h_auc_no")
    h_obj_no=request("h_obj_no")

    if h_obj_no="" Then Response.End

	Set conn = Server.CreateObject("ADODB.Connection") 
      	conn.open "driver={Microsoft ODBC for Oracle};server=wau;uid=web;pwd=gjp4u4"

    sql_txt=" select a.auc_no,a.eng_no,a.obj_brand,d.end_date,d.end_time,substr(a.obj_born_date,1,4) ori_year,a.list_ori_price,a.obj_model,a.obj_type,b.dept_cname,a.obj_no,a.list_price,a.obj_color,a.view_times," _
    & " a.obj_cc,a.obj_born_date,a.run_km,run_type,mgn_gov ,a.tire_deep,a.obj_dou,obj_dou_txt,a.descri,a.license_date," _
    & " a.memo, a.memo1,un_tax, d.d_price ,e.* from wau_001 a,prm06 b, wau_006 d,EQUIPMENT e where a.status in ('1') and a.place_dept_no=b.dept_no and a.obj_no='"+h_obj_no+"' and a.obj_no = d.obj_no and to_char(sysdate,'yyyymmddhh24miss') between d.start_date||d.start_time and d.end_date||d.end_time and d.end_yn is null and e.obj_no(+) = a.obj_no"

	Set rs = Server.CreateObject("ADODB.Recordset")

	'-- 取得資料錄
	rs.open sql_txt ,conn ,3,3,1
	Set dic = CreateObject("Scripting.Dictionary")
    set jsonObject = jsObject()
    set jsonObject("base")= jsObject()

    jsonObject("base")("auc_no") = rs.fields("obj_no").value
    jsonObject("base")("eng_no") = rs.fields("eng_no").value
    jsonObject("base")("list_ori_price") = rs.fields("list_ori_price").value
    jsonObject("base")("obj_type") = rs.fields("obj_type").value
    jsonObject("base")("obj_model") = rs.fields("obj_model").value
    jsonObject("base")("obj_no") = rs.fields("obj_no").value
    jsonObject("base")("dept_cname") = rs.fields("dept_cname").value 
    jsonObject("base")("list_price") = rs.fields("list_price").value 
    jsonObject("base")("obj_color") = rs.fields("obj_color").value 
    jsonObject("base")("view_times") = rs.fields("view_times").value 
    jsonObject("base")("obj_cc") = rs.fields("obj_cc").value  
    jsonObject("base")("obj_born_date") = rs.fields("obj_born_date").value     
    jsonObject("base")("run_km") = rs.fields("run_km").value      
    jsonObject("base")("mgn_gov") = rs.fields("mgn_gov").value   
    jsonObject("base")("run_type") = rs.fields("run_type").value 'run_type,1,手排,2,自排,3,手自排,'-'
    jsonObject("base")("tire_deep") = rs.fields("tire_deep").value   
    jsonObject("base")("obj_dou") = rs.fields("obj_dou").value
    jsonObject("base")("obj_dou_txt") = rs.fields("obj_dou_txt").value   
    jsonObject("base")("descri") = rs.fields("descri").value     
    jsonObject("base")("license_date") = rs.fields("license_date").value         
    jsonObject("base")("memo") = rs.fields("memo").value    
    jsonObject("base")("memo1") = rs.fields("memo1").value 
    jsonObject("base")("un_tax") = rs.fields("un_tax").value 
    jsonObject("base")("d_price") = rs.fields("d_price").value
    jsonObject("base")("obj_brand") = rs.fields("obj_brand").value
    jsonObject("base")("ori_year") = rs.fields("ori_year").value
    jsonObject("base")("end_date") =  rs.fields("end_date").value
	jsonObject("base")("end_time") =  rs.fields("end_time").value

    jsonObject("base")("EQ_18") = rs.fields("EQ_18").value
    jsonObject("base")("EQ_19") = rs.fields("EQ_19").value
    jsonObject("base")("OBJ_NO") = rs.fields("OBJ_NO").value
    jsonObject("base")("EQ_1") = rs.fields("EQ_1").value
    jsonObject("base")("EQ_2") = rs.fields("EQ_2").value
    jsonObject("base")("EQ_3") = rs.fields("EQ_3").value
    jsonObject("base")("EQ_4") = rs.fields("EQ_4").value
    jsonObject("base")("EQ_5") = rs.fields("EQ_5").value
    jsonObject("base")("EQ_6") = rs.fields("EQ_6").value
    jsonObject("base")("EQ_7") = rs.fields("EQ_7").value
    jsonObject("base")("EQ_8") = rs.fields("EQ_8").value
    jsonObject("base")("EQ_9") = rs.fields("EQ_9").value
    jsonObject("base")("EQ_10") = rs.fields("EQ_10").value
    jsonObject("base")("EQ_11") = rs.fields("EQ_11").value
    jsonObject("base")("EQ_12") = rs.fields("EQ_12").value
    jsonObject("base")("EQ_13") = rs.fields("EQ_13").value
    jsonObject("base")("EQ_14") = rs.fields("EQ_14").value
    jsonObject("base")("EQ_15") = rs.fields("EQ_15").value
    jsonObject("base")("EQ_16") = rs.fields("EQ_16").value
    jsonObject("base")("EQ_17") = rs.fields("EQ_17").value

    Set rs4 = Server.CreateObject("ADODB.Recordset")
    sql_txt4="select a.* from wau_004 a where a.obj_no='" & h_obj_no & "' order by a.poisit asc" 
	rs4.open sql_txt4 ,conn ,3,3,1

    set jsonObject("pic") = jsArray()
    do until rs4.eof
        jsonObject("pic")(null) = rs4.Fields("POISIT").value
        rs4.movenext
    loop

    sql_act6_1=" insert into wau_006_1 (auc_no,obj_no,view_user,view_dept,view_date,view_time,upd_date,upd_time,upd_user) "
    sql_act6_1=sql_act6_1+" values ('" & h_auc_no & "','"+h_obj_no+"','" & login_emp_no & "','" & login_dept_no & "','"+trandate(date())+"','"+trantime+"','"+trandate(date())+"','"+trantime+"','" & login_emp_no & "')"         

    conn.execute sql_act6_1 

	rs.Close
    rs4.Close
    conn.Close
    set rs = nothing
    set rs4 = nothing
    set conn = nothing
	jsonObject.Flush
%>