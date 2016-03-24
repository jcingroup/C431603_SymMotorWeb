<html>
<head>
<meta http-equiv="Content-Type" content="SYM Online/html; charset=big5">
<meta name="copyright" content="順益汽車 - 網拍車單台展示">
<META content="200610 SYM-MOTOR (順益汽車)" name=copyright>
<META content="Johnc;johnc@sym-motor.com.tw" name=author>

<title>順益汽車 - 網拍車單台展示</title>

<script language="JavaScript1.1">
<!--
function OnMoSet1(IMG) { document.imageS.src= IMG }
//-->
</script>
<style type="text/css">
	.enable {
		color: #000000;
		font-weight: bold;
	}
	.disable {
		color: #808080;
	}
</style>
</head>

<script language='vbscript'>
function save()
        Dim wsh
        Set wsh = CreateObject("WScript.Shell")
        wsh.SendKeys "%fa"
end function
</script>

 <!-- #include file="./../wmg/wmg_bas.inc" --> 
<%
     the_date=trandate(date())&left(trantime,4)
%>
<body bgcolor="#99ff99">

　　<a href='#' onclick='print();'><img border='0' src='print.jpg' border=0 align=absmiddle hspace=1><font size=2>列印本頁</font></a>　<a href='#' onclick='save();'><img border='0' src='save.jpg' border=0 align=absmiddle hspace=1><font size=2>儲存本頁</font></a>  

<%
      	function ChangeStatus( status )
		if status = "Y" then
			ChangeStatus = "enable"
			ChangeStatus = "enable"
		else
			ChangeStatus = "disable"
		end if
		
	    end function 
	  
	  dim pic_path      
  
      sign34=chr(34)

      h_pck=request("h_pck")     '--檢查是從那一個 page link 過去的
      h_auc_no=request("h_auc_no")
      h_obj_no=request("h_obj_no")
      pic_path="./pic/"+h_obj_no+"_"
      
      Set conn_1 = Server.CreateObject("ADODB.Connection") 
      conn_1.open "driver={Microsoft ODBC for Oracle};server="+session("xdct_n")+";uid="+session("xdct_u")+";pwd="+session("xdct_p")    

      Set rs6 = Server.CreateObject("ADODB.Recordset")

      sql_txt6=" select decode(a.end_yn,null,'N',a.end_yn) chk_end,(a.start_date||'-'||substr(a.start_time,1,4)||'~'||a.end_date||'-'||substr(a.end_time,1,4)) auc_t,a.* from wau_006 a where a.auc_no='" & h_auc_no & "'"
      
      'response.write sql_txt6

      rs6.open sql_txt6,conn_1,3,3,1 

      if rs6.recordcount>0 then 
	     ''--------針對集團董事長夫人的BENZ S430座長拍賣, 若是找到車號為6988FH者, 則再將BENZ車拍賣廣告頁面彈出,車輛賣出後,可移除此段程式    2007.10.17    begin 
		  if rs6("obj_no") = "6988FH" then
              response.write "<body onload='new_year("+chr(34)+pop_win+chr(34)+");' background='./sym1.gif' >"
	         
          end if	  
	     ''--------針對集團董事長夫人的BENZ S430座長拍賣, 若是找到車號為6988FH者, 則再將BENZ車拍賣廣告頁面彈出    2007.10.17    end
		 
		  ''--------針對克萊斯勒的試乘車Town & Country拍賣, 若是找到車號為0075PK及4475NM者, 則再將Town & Country車拍賣廣告頁面彈出    2007.11.15    begin  
		  if rs6("obj_no") = "0075PK" or rs6("obj_no") = "4475NM" then
              response.write "<body onload='new_year1("+chr(34)+pop_win+chr(34)+");' background='./sym1.gif' >"
	         
          end if    ''--------end 
	  
         Set rs7 = Server.CreateObject("ADODB.Recordset")                                                                                 
         sql_txt7=" select count(a.obj_no) ann from wau_007 a where a.obj_no='"+rs6("obj_no")+"' and p_type='"+rs6("p_type")+"'"                                                                 
         rs7.open sql_txt7,conn_1,3,3,1    
         'response.write sql_txt7           
         h_ann=0
         if rs7.recordcount>0 then 
            h_ann=rs7("ann")
         end if          
      end if                       
      
      rs6.movefirst
      rs7.movefirst
      
      auc_sd=left(rs6("auc_t"),8)
      auc_st=mid(rs6("auc_t"),10,4)
      auc_ed=mid(rs6("auc_t"),15,8)
      auc_et=right(rs6("auc_t"),4)
    
      ''if rs6("chk_end")<>"Y" and h_pck<>"6" and (trandate(date())&left(trantime,4)>auc_sd&auc_st and trandate(date())&left(trantime,4)<auc_ed&auc_et) then
         ''response.write "<table border=1 width='92%' align=center bgcolor=#FFFF00><tr><td><font color=blue><b>目前投標次數：</b></font><b>" & rs7("ann") & " 次</b></td><td><font color=blue><b>目前最高金額：</b></font><b>$" & rs6("now_price") & "</b></td><td><font color=red><b>結標時間：</b></font><b>" & left(rs6("end_date"),4) & "/" & mid(rs6("end_date"),5,2) & "/" & right(rs6("end_date"),2) & " - " & left(rs6("end_time"),2) & ":" & mid(rs6("end_time"),3,2) & "</b></td><td><table border=0><tr><td align=center><a href='#' onclick="+chr(34)+"window.open('wau_004.asp?h_buy=1&h_auc_no=" & h_auc_no & "&h_d_price="& rs6("d_price") &"&h_obj_no="+h_obj_no+"','_father','scrollbars=yes,width=350,height=266,left=120,top=160')"+chr(34)+" ><img border='0' src='d_buy.jpg'></td><td><font color=blue><b>直購金額：</b></font><b>$" & rs6("d_price") & "</a></b></td></tr></table></td><td align=center><a href='wau_003.asp?h_buy=2&h_auc_no=" & h_auc_no & "&h_obj_no="+h_obj_no+"'><img border='0' src='buy.jpg'></a></td></tr></table>"                                  
      ''end if

      '--判斷照片是否多於 9 張
      Set rs4 = Server.CreateObject("ADODB.Recordset")
      sql_txt4=" select a.* from wau_004 a where a.obj_no='" & h_obj_no & "' and to_number(a.poisit)>9 order by a.poisit asc" 
      'response.write sql_txt4
      rs4.open sql_txt4,conn_1,3,3,1       


      response.write "<table border='1' width='92%' height='299' align=center> "
      response.write "<tr>                                        "
      response.write "<td width='100%' height='293' align=center><img border='0' src='"+pic_path+"1.jpg'  name='imageS' width='369' height='255'></td> "
      response.write "<td>                                        "

      response.write "  <table  width='33%' height='204' align=center>                                                                                                                        "   
      response.write "    <tr>                                                                                                                                                   "   
      response.write "      <td width='33%' height='94'><a href='#' onMouseOver="+sign34+"OnMoSet1('"+pic_path+"1.jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('"+pic_path+"1.jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
      response.write "  <img border='0' src='"+pic_path+"1.jpg' width='99' height='75'></a></td>                                                                                            "   
      response.write "      <td width='33%' height='94'><a href='#' onMouseOver="+sign34+"OnMoSet1('"+pic_path+"2.jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('"+pic_path+"2.jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
      response.write "  <img border='0' src='"+pic_path+"2.jpg' width='99' height='75'></a></td>                                                                                            "   
      response.write "      <td width='33%' height='94'><a href='#' onMouseOver="+sign34+"OnMoSet1('"+pic_path+"3.jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('"+pic_path+"3.jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
      response.write "  <img border='0' src='"+pic_path+"3.jpg' width='99' height='75'></a></td>                                                                                            "   
      response.write "    </tr>                                                                                                                                                  "   
      response.write "    <tr>                                                                                                                                                   "   
      response.write "      <td width='33%' height='94'><a href='#' onMouseOver="+sign34+"OnMoSet1('"+pic_path+"4.jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('"+pic_path+"4.jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
      response.write "  <img border='0' src='"+pic_path+"4.jpg' width='99' height='75'></a></td>                                                                                            "   
      response.write "      <td width='33%' height='94'><a href='#' onMouseOver="+sign34+"OnMoSet1('"+pic_path+"5.jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('"+pic_path+"5.jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
      response.write "  <img border='0' src='"+pic_path+"5.jpg' width='99' height='75'></a></td>                                                                                            "   
      response.write "      <td width='33%' height='94'><a href='#' onMouseOver="+sign34+"OnMoSet1('"+pic_path+"6.jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('"+pic_path+"6.jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
      response.write "  <img border='0' src='"+pic_path+"6.jpg' width='99' height='75'></a></td>                                                                                            "   
      response.write "    </tr>                                                                                                                                                  "
      response.write "    <tr>                                                                                                                                                   "   
      response.write "      <td width='33%' height='94'><a href='#' onMouseOver="+sign34+"OnMoSet1('"+pic_path+"7.jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('"+pic_path+"7.jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
      response.write "  <img border='0' src='"+pic_path+"7.jpg' width='99' height='75'></a></td>                                                                                            "   
      response.write "      <td width='33%' height='94'><a href='#' onMouseOver="+sign34+"OnMoSet1('"+pic_path+"8.jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('"+pic_path+"8.jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
      response.write "  <img border='0' src='"+pic_path+"8.jpg' width='99' height='75'></a></td>                                                                                            "   
      response.write "      <td width='33%' height='94'><a href='#' onMouseOver="+sign34+"OnMoSet1('"+pic_path+"9.jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('"+pic_path+"9.jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
      response.write "  <img border='0' src='"+pic_path+"9.jpg' width='99' height='75'></a></td>                                                                                            "   
      response.write "    </tr>              "

      if rs4.recordcount>0 then '--超過 9 張照片的 show 方式 
         response.write "<table align=center><tr><td align=center>"   
         do while not rs4.eof    
            ii=cint(rs4("poisit"))
            response.write " <a href='#' onMouseOver="+sign34+"OnMoSet1('" & pic_path & ii & ".jpg')"+sign34+" onMouseOut="+sign34+"OnMoSet1('" & pic_path & ii & ".jpg')"+sign34+" onClick="+sign34+"return OnMoSet1('imagea.jpg')"+sign34+">    "   
            response.write "  <img border='0' src='" & pic_path & ii & ".jpg' width='32' height='24'></a>   "
            rs4.movenext
         loop 
         response.write "</td></tr></table>"
      end if
      rs4.close
  
      response.write "  </table>                                                                                                                                                 "   

      response.write "</td>                                       "
      response.write "</tr>                                       "
      response.write "</table>                                    "

         '--show 基本車歷
         Set rs1 = Server.CreateObject("ADODB.Recordset")                                                                                 
         sql_txt1=" select a.auc_no,a.eng_no,decode(a.list_ori_price,null,'-',a.list_ori_price)list_ori_price,a.obj_model,a.obj_no,a.obj_type||substr(a.eng_no,(length(a.eng_no)-5),6) no_n,b.dept_cname,a.obj_no,a.list_price,a.obj_color,nvl(a.view_times,0) view_times,"
         sql_txt1=sql_txt1+" a.obj_cc,a.obj_born_date,a.run_km,decode(run_type,1,'手排',2,'自排',3,'手自排','-') r_type,decode(mgn_gov,null,'-',mgn_gov) m_gov ,a.tire_deep,decode(a.obj_dou,'Y','有','無') obj_dou,nvl(obj_dou_txt,'-') obj_dou_txt,decode(a.descri,null,'-',a.descri) descri,nvl(a.license_date,'-') license_date   ,"
         sql_txt1=sql_txt1+" decode(a.memo,null,'-',a.memo) mo, decode(a.memo1,null,'-',a.memo1) mo1,decode(un_tax,null,'無',a.un_tax) u_tax, d.d_price ,e.* from wau_001 a,prm06 b, wau_006 d,EQUIPMENT e where a.status in ('1') and a.place_dept_no=b.dept_no and a.obj_no='"+h_obj_no+"' and a.obj_no = d.obj_no and to_char(sysdate,'yyyymmddhh24miss') between d.start_date||d.start_time and d.end_date||d.end_time and d.end_yn is null and e.obj_no(+) = a.obj_no"
      'response.write sql_txt1
      'response.end         
      rs1.open sql_txt1,conn_1,3,3,1    
     
      response.write "<table border=1 width='92%' align=center>"
      response.write "<tr>"
      response.write "<td>拍賣編號：<b>" & rs1("auc_no") & "　</b></td><td>細車型：<b>"+rs1("obj_model")+"</b></td><td>直購價：<b>$"&rs1("d_price")&"</b></td>"
      response.write "</tr><tr>"
      response.write "<td>顏色：<b>"+rs1("obj_color")+"</b></td><td>排氣量：<b>"+rs1("obj_cc")+"</b></td><td>年份：<b>"+left(rs1("obj_born_date"),4)+"</b></td>"
      response.write "</tr><tr>"
      response.write "<td>里程數(數據僅供參考)：<b>約 "&rs1("run_km")&"</b></td><td>排檔：<b>"+rs1("r_type")+"</b></td><td>存放地：<b>"+rs1("dept_cname")+"</b></td>"
      response.write "</tr><tr>"
      response.write "<td>胎深：<b>"+rs1("tire_deep")+"mm</b></td><td>原廠證件：<b>"+rs1("obj_dou_txt")+"</b></td><td>監理站：<b>-</b></td>" 
      response.write "</tr><tr>"
      response.write "<td>引擎號碼：<b>-</b></td><td>領牌日：<b>-</b></td><td>原車價：<b>$"+rs1("list_ori_price")+"</b></td>"
      response.write "</tr>"
	  '------------------------------------------------------------------------------------ 

	  '新增配件   TACO   2010/03/26
      response.write "<table style='border: 2px double #000000' width='92%' align=center>"	  
	  response.write "<tr>"
	  response.write "<td>配備:</td></tr>"
	  response.write "<tr>"
	  
	  response.write "<td  class='"&ChangeStatus(rs1("EQ_1"))&"'>天窗</td>"
	  response.write "<td class='"&ChangeStatus(rs1("EQ_2"))&"'>CD音響 </td>" 
      response.write "<td class='"&ChangeStatus(rs1("EQ_3"))&"'>衛星導航 </td>" 
      response.write "<td class='"&ChangeStatus(rs1("EQ_4"))&"'>定速</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_5"))&"'>電動後視鏡</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_6"))&"'>安全氣囊</td>" 
	 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_7"))&"'>4WD</td></tr>" 
	   response.write "<tr>"
	  response.write "<td class='"&ChangeStatus(rs1("EQ_8"))&"'>皮椅</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_9"))&"'>VCD</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_10"))&"'>恆溫</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_11"))&"'>ABS</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_12"))&"'>倒車雷達</td>" 
	
	  response.write "<td class='"&ChangeStatus(rs1("EQ_13"))&"'>霧燈</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_14"))&"'>電動座椅</td></tr>" 
	  response.write "<tr>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_15"))&"'>DVD</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_16"))&"'>防盜</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_17"))&"'>TCS</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_18"))&"'>鋁圈</td>" 
	  response.write "<td class='"&ChangeStatus(rs1("EQ_19"))&"'>電動窗</td>" 
	  
	  response.write "</tr>"

      '-------------------------------------------------------------------------------------
      response.write "<table border=1 width='92%' align=center>"
	  response.write "<tr>"
     ' response.write "<td colspan=3>配備：<b>"+rs1("mo")+"</b></td>"
      response.write "<td colspan=2>配備說明：<b>"+rs1("mo")+"</b></td><td width='32%'>車輛整備表下載：<b>-</b></a></td>" 
      response.write "</tr>"
      response.write "<td colspan=3>車況：<b>"+rs1("descri")+"</b></td>"
      response.write "</tr>"
      response.write "</tr><tr>"
      'response.write "<td colspan=3><font size=3>稅金+罰款<font color=red>(因車輛資訊並未全部揭露以及恐有資料時差性情形發生，故車輛實際資訊只能以公路監理單位記載及認定者為準)</font>：<b>$ </font>"+rs1("u_tax")+"</b></td>"
      response.write "</tr>"
      response.write "</tr><tr>"
      response.write "<td colspan=3>備註：<b>"+rs1("mo1")+"</b></td>"
      response.write "</tr>"
      'response.write "</tr><tr>"
      'response.write "<td colspan=3>車輛整備表下載：<a href='#' onclick=window.open('pic/pdf/" & rs1("obj_no") & ".pdf','scrollbars=yes,width=350,height=250,left=120,top=160')><b>"+rs1("obj_no")+".pdf</b></a></td>"
     ' response.write "<td colspan=3>車輛整備表下載：<a href='pic/pdf/" & rs1("obj_no") & ".pdf'><b>"+rs1("obj_no")+".pdf</b></a></td>"
      'response.write "</tr>"
      response.write "</tr><tr>"
      response.write "<td colspan=3>注意事項：<b>1.請於完款後三天內至監理站為過戶登記，相關費用需自行承擔。 2.若需托運，其運費依規定辦理。</b></td>"
      response.write "</tr>"
      response.write "</table>"

         '--記錄 table.wau_001.view_times 點閱次數
         sql_act1=" update wau_001 set view_times=" & rs1("view_times") & " + 1 "
         sql_act1=sql_act1+" where obj_no='"+h_obj_no+"'"        
         'response.write sql_act1 
         'response.end
         conn_1.execute sql_act1 
         
         '--insert 點閱記錄至 table  中
         sql_act6_1=" insert into wau_006_1 (auc_no,obj_no,view_user,view_dept,view_date,view_time,upd_date,upd_time,upd_user) "
         sql_act6_1=sql_act6_1+" values ('" & h_auc_no & "','"+h_obj_no+"','" & login_emp_no & "','" & login_dept_no & "','"+trandate(date())+"','"+trantime+"','"+trandate(date())+"','"+trantime+"','" & login_emp_no & "')"         
         'response.write sql_act6_1
         conn_1.execute sql_act6_1 
   
      rs1.close
      rs6.close
      rs7.close
      conn_1.close

%>

</body>

<!-- #include file="./../wmg/wmg_bas_after.inc" -->


<script language="JavaScript"> 
function new_year(pop_win) {
  //alert (pop_win);
  if (pop_win=='y') { alert ("登入密碼尚未變更為非身證份號碼,\n\n 請即進行變更, \n\n雙月份第1日,系統將自動停用密碼為身份證之帳號. \n\n( 請使用右方系統連結->個人資料->員工帳號維護->修改 ) "); }
    /////window.open("http://172.28.1.12/總經理室/經營訓練組/高階的話.htm","_father","status=no,dependent=yes,scrollbars=yes,width=720,height=600,alwaysraised=1,left=80,top=10");  
	window.open("http://symb2b.sym-motor.com.tw/benz_s430.htm","_father","status=no,dependent=yes,scrollbars=yes,width=720,height=600,alwaysraised=1,left=150,top=10");
	///window.open("http://symb2b.sym-motor.com.tw/wau_ad.asp","_blank","status=no,dependent=yes,scrollbars=yes,width=720,height=600,alwaysraised=1,left=700,top=10");
	
  }

function new_year1(pop_win) {
  //alert (pop_win);
  if (pop_win=='y') { alert ("登入密碼尚未變更為非身證份號碼,\n\n 請即進行變更, \n\n雙月份第1日,系統將自動停用密碼為身份證之帳號. \n\n( 請使用右方系統連結->個人資料->員工帳號維護->修改 ) "); }
    /////window.open("http://172.28.1.12/總經理室/經營訓練組/高階的話.htm","_father","status=no,dependent=yes,scrollbars=yes,width=720,height=600,alwaysraised=1,left=80,top=10");  
	window.open("http://symb2b.sym-motor.com.tw/town.htm","_father","status=no,dependent=yes,scrollbars=yes,width=720,height=600,alwaysraised=1,left=150,top=10");
	///window.open("http://symb2b.sym-motor.com.tw/wau_ad.asp","_blank","status=no,dependent=yes,scrollbars=yes,width=720,height=600,alwaysraised=1,left=700,top=10");
	
  }  
  
</script>   


</html>

<%
function TranDate(dt)

Dim yyyy,mm,dd

dd=Day(dt)
if len(dd)=1 then dd = "0" & dd
mm=Month(dt)
if len(mm)=1 then mm = "0" & mm
yyyy=year(dt)
if len(yyyy)=1 then yyyy = "000" & yyyy
if len(yyyy)=2 then yyyy = "00" & yyyy
if len(yyyy)=3 then yyyy = "00" & yyyy
TranDate=cstr(yyyy)+cstr(mm)+cstr(dd) 

end function

function TranTime

Dim hh,mi,ss

hh=hour(now)
if len(hh)=1 then hh = "0" & hh
mi=minute(now)
if len(mi)=1 then mi = "0" & mi
ss=second(now)
if len(ss)=1 then ss = "0" & ss
TranTime=cstr(hh)+cstr(mi)+cstr(ss) 

end function

%>