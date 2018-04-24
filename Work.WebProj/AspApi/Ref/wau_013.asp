<%
'2010/04    
'新增廠牌,廠牌動態搜尋,識別碼隱藏   
%>

<html>
<head>
    <meta http-equiv="Content-Type" content="SYM Online/html; charset=big5">
    <meta name="copyright" content="順益汽車 - 網拍車展示主頁面">
    <meta content="200610 SYM-MOTOR (順益汽車)" name="copyright">
    <meta content="Johnc;johnc@sym-motor.com.tw" name="author">
    <script type="text/Javascript" src="utility.js"></script>
    <script type="text/Javascript" src="jquery-1.3.2.js"></script>
    <script type="text/Javascript" src="initial.js"></script>
    <script type="text/Javascript" src="jquery.bgiframe.js"></script>
    <script type="text/Javascript">
        $(document).ready(function () {
            Init();
            LoadItem();
            StartBgIframe();

            $("#submit_b").click(function () {
                return CheckRequire();
            });// end click event function of submit_b
        });
    </script>
    <script language="Javascript">
        function checkDataFormat() {
            var pass = true;

            var carbrand = document.frm.carbrand.value;
            var carmodel = document.frm.carmodel.value;
            return pass;
        }
    </script>
    <title>順益汽車 - 網拍車展示主頁面</title>

</head>

<!-- #include file="./../wmg/wmg_bas.inc" -->

<%
      Set conn_1 = Server.CreateObject("ADODB.Connection") 
      conn_1.open "driver={Microsoft ODBC for Oracle};server="+session("xdct_n")+";uid="+session("xdct_u")+";pwd="+session("xdct_p") 
%>

<body bgcolor="#99ff99">

    <form method="post" name="au" action="wau_013.asp">

        <table border="1" align="center" width="90%" cellspacing="1" bgcolor="#FFFF77" bordercolorlight="#FFFFFF" bordercolordark="#FFFFFF">
            <tr>


                <td width="12%"><small>廠牌 : </small>
                    <select name='h_obj_brand' id='h_obj_brand'>
                        <!--    <td  width=10%><small>車型 : </small><select name='h_obj_type'> 
         <option selected value=''></option>
	          <option value='JT'>JT</option>
	          <option value='PS'>PS</option>
	          <option value='AS'>AS</option>
	          <option value='KZ'>KZ</option>
	          <option value='ST'>ST</option>
	          <option value='CK'>CK</option>
	          <option value='CP'>CP</option>
	          <option value='CM'>CM</option>
	          <option value='P45'>P45</option>
	          <option value='DZL'>DZL</option>
	          <option value='NQZ'>NQZ</option>
	          <option value='W-CAR'>W-CAR</option> 
			  <option value='NPZ'>NPZ</option>
			  <option value='R2'>R2</option>
			  <option value='GS41'>GS41</option>
			  <option value='GS45'>GS45</option>  
			  
	
	          <!--option value='OTHER'>其他</option-->
                    </select>
                </td>

                <td width="12%"><small>車型 : </small>
                    <select name='h_obj_type' id='h_obj_type'>
                <td width="8%"><small>車色 : </small>
                    <select name='h_obj_color'>
                        <option selected value=''></option>
                        <option value='黑'>黑</option>
                        <option value='白'>白</option>
                        <option value='紅'>紅</option>
                        <option value='橙'>橙</option>
                        <option value='黃'>黃</option>
                        <option value='綠'>綠</option>
                        <option value='藍'>藍</option>
                        <option value='靛'>靛</option>
                        <option value='紫'>紫</option>
                        <option value='金'>金</option>
                        <option value='銀'>銀</option>
                        <option value='灰'>灰</option>
                        <option value='棕'>棕</option>
                        <option value='粉紅'>粉紅</option>
                        <option value='咖啡'>咖啡</option>
                    </select>
                </td>
                <td width="8%"><small>年份 : </small>
                    <select name='h_obj_born_date'>
                        <option selected value=''></option>
                        <% for a=0 to 5
                        response.write "<option value='" & year(now)-a & "'>" & year(now)-a & "</option>"
                     next %>
                    </select>
                </td>
                <td width="10%"><small>存放地 : </small>
                    <select name='h_place_dept_no'>
                        <option selected value=''></option>
                        <% 
                     Set rs0 = Server.CreateObject("ADODB.Recordset")
                     sql_txt0="            select distinct a.place_dept_no,c.dept_cname from wau_001 a,wau_006 b,prm06 c                               "
                     sql_txt0=sql_txt0+ "   where a.obj_no=b.obj_no and to_char(sysdate,'yyyymmddhh24miss') between b.start_date||b.start_time and b.end_date||b.end_time and a.place_dept_no=c.dept_no   "
                     rs0.open sql_txt0,conn_1,3,3,1
		     if rs0.recordcount>0 then 
                         rs0.movefirst  
                         do while not rs0.eof 
                             response.write "<option value='" & rs0("place_dept_no") & "'>" & rs0("dept_cname") & "</option>"
                             rs0.movenext
                         loop
                     end if
                        %>
                    </select>
                </td>
                <td width="12%"><small>價格 : </small>
                    <input type="text" name='h_list_price' maxlength='8' size='6' value=''><small>(以下)</small></td>
                <input type="hidden" name="first_use" value="n">
                <td width="4%">
                    <input type="submit" value="查詢" name="search1"></td>
                <td width="4%">
                    <input type="reset" value="清除"></td>
                <td align="center" width="12%"><a href='wau_000_2.asp'><small>我的需求-協助找車</small></a></td>
            </tr>
        </table>
    </form>

    <%
      h_agree=request("agree")
      if h_agree<>"" then
      Set conn_act = Server.CreateObject("ADODB.Connection") 
      conn_act.open "driver={Microsoft ODBC for Oracle};server="+session("xdct_n")+";uid="+session("xdct_u")+";pwd="+session("xdct_p") 

         sql_act_agree=" insert into wau_000_1 (agree_user,agree,upd_date,upd_time) "
         sql_act_agree=sql_act_agree+" values (" & login_emp_no & ",'"+h_agree+"','"+trandate(date())+"','"+trantime+"')"         
         'response.write sql_act_agree
         conn_act.execute sql_act_agree

      conn_act.close

      end if
  
      h_obj_brand=request("h_obj_brand")
      h_obj_type=request("h_obj_type")
      h_obj_color=request("h_obj_color")
      h_obj_born_date=request("h_obj_born_date")
      h_place_dept_no=request("h_place_dept_no")
      h_list_price=request("h_list_price")

      Set conn_1 = Server.CreateObject("ADODB.Connection") 
      conn_1.open "driver={Microsoft ODBC for Oracle};server="+session("xdct_n")+";uid="+session("xdct_u")+";pwd="+session("xdct_p")    
      Set rs1 = Server.CreateObject("ADODB.Recordset")
   
      'sql_txt="                 select a.obj_no,a.obj_type||substr(a.eng_no,(length(a.eng_no)-5),6) no_n,             "
      sql_txt="                 select a.obj_no,a.obj_brand,             "
      sql_txt=sql_txt+        "        a.obj_type,a.obj_model,a.obj_color,substr(a.obj_born_date,1,4) ori_year,                   "
      sql_txt=sql_txt+        "        a.issue_date,a.place_dept_no,a.list_price/10000 list_price,c.dept_cname,a.auc_no, substr(d.end_date,5,2)||'/'||substr(d.end_date,7,2)||'-'||substr(d.end_time,1,2)||':'||substr(d.end_time,3,2)  end_sch,d.now_price/10000||'萬' now_price,d.d_price/10000 d_price     "
      sql_txt=sql_txt+        "   from wau_001 a,prm06 c,wau_006 d                                         "
      if request("first_use")<>"n" then   '--第一次 show 以最近 20 天為條件
	     ''-------modified by skyfox   中古車業務組阿助要求取消第一次只show最近20天之物件   2007.11.14
         '''sql_txt=sql_txt+     "  where 1=1 and (a.issue_date>=TO_CHAR(SYSDATE-20,'YYYYMMDD') or d.p_type=2)            "
		 sql_txt=sql_txt+     "  where 1=1                                                                            "
      else
         sql_txt=sql_txt+     "  where 1=1                                                                            "
      end if
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
      sql_txt=sql_txt+        " order by a.auc_no desc                                                                "



	  
      'response.write sql_txt
      'response.end

      rs1.open sql_txt,conn_1,3,3,1 
      
      'response.write rs1.recordcount

   if rs1.recordcount>0 then
      response.write("<table style='TABLE-LAYOUT: fixed' border=1 align=center width=90% cellspacing=1 bgcolor=#CCFFFF bordercolorlight=#FFFFFF bordercolordark=#FFFFFF>")
      response.write("<tr bgcolor=#FF99BB><td width='6%' align=center ><b>編號</b></td><td width='8%' align=center ><b>廠牌</b></td><td width='6%' align=center ><b>車型</b></td><td width='6%' align=center ><b>細車型</b></td><td width='6%' align=center ><b>車色</b></td><td width='6%' align=center ><b>年份</b></td><td align='center' width='7%' ><b>存放地</b></td><td align='center' width='10%' ><b>結標時間</b></td><td align='center' width='7%' ><b>售價</b></td><td align='center' width=13% ><b>照片</b></td>")
      do while not rs1.eof 
	     'if isnull(rs1("now_price")) then
		 '     t_now_price = "-"
	     if (rs1("now_price"))="萬" then
		      t_now_price = "-"		 
		 else
		      t_now_price = rs1("now_price")
		 end if
         response.write ("<tr><td  align=center ><a href='wau_014.asp?h_auc_no=" & rs1("auc_no")& "&h_obj_no=" & rs1("obj_no") & "'><font size=5><b>" & rs1("auc_no") & "</b></font></a></td><td align=center >"+rs1("obj_brand")+"</td><td align=center ><b>"+trim(rs1("obj_type"))+"</b></td><td align=center ><b>"+trim(rs1("obj_model"))+"</b></td><td align=center ><b>"+rs1("obj_color")+"</b></td><td align=center ><b>"+rs1("ori_year")+"</b></td><td bgcolor=99ff66 align=center >"+rs1("dept_cname")+"</td><td align=center ><b>" & rs1("end_sch") & "</b></td><td align=right><font color=red><b>$"&rs1("d_price")& "萬</b></font></td><td align=center width='10%'><a href='wau_014.asp?h_auc_no=" & rs1("auc_no")& "&h_obj_no="+rs1("obj_no")+"'><img border='0' src=./pic/"+rs1("obj_no")&"_1.jpg"+" width='99' height='75'></a></td></tr>")
         rs1.movenext
      loop
      response.write("</table>")
   else 
      if request("first_use")<>"n" then
         'response.write "<p><p align=center>最近 7 日並無新進車輛 !! </p>"
         response.write "<p><p align=center>(拍賣車輛均已售出，敬請期待~)</p>"
         response.write "<p><p align=center>請按查詢鍵列出所有車輛 !! </p>"
      else
         response.write "<p><p align=center>查無符合需求車輛 !! </p>"
      end if
   end if


   rs1.close
   conn_1.close

    %>
</body>

<!-- #include file="./../wmg/wmg_bas_after.inc" -->


</html>
