<%

      Set conn_2 = Server.CreateObject("ADODB.Connection")  
      
      'conn_1.open "driver={Microsoft ODBC for Oracle};server="+session("xdct_n")+";uid="+session("xdct_u")+";pwd="+session("xdct_p")     
      conn_2.open "driver={Microsoft ODBC for Oracle};server=wau;uid=web;pwd=gjp4u4" 

      Set rs6 = Server.CreateObject("ADODB.Recordset") 

      sql_txt6 = "select * from wau_010 where mark ='Y'" 

      rs6.open sql_txt6,conn_2,3,3,1  
%>
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=big5">
<meta name="copyright" content="SYM">
<META content="2003 SYM-MOTOR (SYM)" name=copyright>
<META content="Johnc;johnc@sym-motor.com.tw" name=author>
<title>SYM</title><link rel="SHORTCUT ICON" href="3.ico">
<style>
#type  {face="Times New Roman";font-size:16pt;color:#333333}
#price {face="Times New Roman";font-weight:bold;font-size:14pt;color:#FF0000}
#year  {face="Times New Roman";font-size:16pt;color:#333333}
#memo  {face="Times New Roman";font-size:16pt;font-weight:bold;color:#009933}
p {font-weight:bold;face="標楷體";font-size=16pt;color:#2030C5;margin-top =0px;margin-bottom=0px;margin-left:0px;  ;padding-top=0px ; padding-bottom=0px;padding-left:0px; }
a:link,a:visited{
text-decoration:none;
border-top:1px solid #EEEEEE;
border-left:1px solid #EEEEEE;
border-bottom:1px solid #717171;
border-right:1px solid #717171;
}
a:hover{
border-top:1px solid #717171;
border-left:1px solid #717171;
border-bottom:1px solid #EEEEEE;
border-right:1px solid #EEEEEE;
}
</style>
<script language = 'Javascript'>
	var images = new Array();
	var type = new Array();
	var price = new Array();
	var year = new Array();
	var counter = <%=rs6.RecordCount%>;
	var num = 0;
function slideshow()
{
	<%
		'若熱門車的顯示全都沒有設定時，login.asp會出現有BUG的問題。
		'建議寫法要異動，但因為多一事不如少一事的想法，就醬子了！
		rs6.MoveFirst
		
		index = 0
		do while not rs6.Eof
			response.write "type[" & index & "] = '" & rs6("obj_type") & "';" & vbcrlf
			response.write "price[" & index & "] = '" & rs6("obj_price") & "';" & vbcrlf
			response.write "year[" & index & "] = '" & rs6("obj_year") & "';" & vbcrlf
			response.write "memo[" & index & "] = '" & rs6("obj_memo") & "';" & vbcrlf
			response.write "images[" & index & "]=new Image();" & vbcrlf
			response.write "images[" & index & "].src = 'http://symb2b.sym-motor.com.tw/wau/hot_pic/" & rs6("obj_photo") & "';" & vbcrlf
			
			rs6.MoveNext
			index = index +1
		loop
	%>
num=num+1
if (num==counter)
{num=0}

//因車價超過限額，以問號代替。 by Donald 2009/08/12
if (price[num] == '?')
	price[num] = '???';
else
	price[num] = price[num]/10000+ "萬";
	
document.getElementById('type').innerHTML =  type[num];
document.getElementById('price').innerHTML = price[num];
document.getElementById('year').innerHTML =  year[num];
document.getElementById('memo').innerHTML =  memo[num];
document.mypic.src=images[num].src;
setTimeout('slideshow()',5000);
}


</script>
</head>

<body topmargin="0" leftmargin="0" onload="slideshow();" background="../background.jpg">
          <%
          if request("login_passwd")<>"" or request("login_emp_no")<>"" then
          response.write ("<script language='javascript'>alert('&micro;n&curren;J&iexcl;&Oacute;b&cedil;&sup1;&copy;&Icirc;&iexcl;&Oacute;K&frac12;X&iquest;&ugrave;&raquo;~, &frac12;&ETH;&shy;&laquo;&iexcl;Ps&micro;n&curren;J!');</script>") 
          end if
          %>
             <script language="vbscript">
                  function start()
                  x=window.open("login.asp","st","status=no,dependent=yes,scrollbars=no,width=100%,height=100%,alwaysraised=1,left=230,top=200")
                  end function
             </script>
             <SCRIPT LANGUAGE="javascript" >
             <!--
                  function load(page) { 
                  //alert(page);
                  window.open(page,'wmain');                                  //  reload &reg;&Eacute;, &shy;&laquo;&iexcl;Ps&cedil;&uuml;&curren;J wmg_004_eip.asp
                  ////window.open('./wmg/wmg_001_eip.asp','wheader');             //  reload &reg;&Eacute;, &shy;&laquo;&iexcl;Ps&cedil;&uuml;&curren;J wmg_001_eip.asp
                  window.close();            
             }
            　　 function bookmark(){  
            　　 if (document.all){
             　　        window.external.AddFavorite("http://symb2b.sym-motor.com.tw/", "順益汽車優質中古網頁");
              　　   } else {
              　　       window.sidebar.addPanel("順益汽車優質中古網頁", "http://symb2b.sym-motor.com.tw/", "");
              　　   }
                            
　　　　　　　　　　　　　　　} 
                 function home(){  
　　　　　　　　　　　　  if ( document.all ){   
							document.body.style.behavior='url(#default#homepage)';
							document.body.setHomePage('http://symb2b.sym-motor.com.tw/');
							                          
 　　　　　　　　　　　　　//　window.external.setHomePage("http://symb2b.sym-motor.com.tw/", "順益汽車優質中古網頁");                             
　　　　　　　　　　　　　　　}                             
　　　　　　　　　　　　　　　} 

             //-->

             </SCRIPT>

          <% 
          dim session_key

          session_key=session("session_log")
   
          '-- create db connect 
          Set conn1 = Server.CreateObject("ADODB.Connection") 
          'conn1.open "driver={Microsoft ODBC for Oracle};server="+session("xdct_n")+";uid="+session("xdct_u")+";pwd="+session("xdct_p")  ' server=&cedil;&ecirc;&reg;&AElig;&reg;wSID&brvbar;W&ordm;&Ugrave;
          conn1.open "driver={Microsoft ODBC for Oracle};server=wau;uid=web;pwd=gjp4u4" 
          '-- create a recordset for check login session_log 
          sql_str2="select b.session_key,a.emp_no,a.passwd from wmg_001 a,wmg_006 b where a.emp_no=b.emp_no and b.session_key='"+session_key+"'"
          Set rs_session = Server.CreateObject("ADODB.Recordset")
          rs_session.open  sql_str2,conn1,3,3,1  
          %>
<div align="right">
  <table border="0" width="100%" height="100%">
    <tr>
      <td width="100%" height="15%" colspan="2">          
          <p align="right"><a href='javascript:bookmark();' title='bookmark'><img border="0" src="M&amp;N-SI.gif" width="397" height="74" align="left"><img border="0" src="abc.gif" align="left" 　alt="設為最愛"></a>　　　　　　　　　　　　　　　　　　　　　　
          <div align="right">
          <table border="0" width="170">
            <tr>
              <td width="35"><a href='javascript:home();' title='home'><img border="0" src="home.PNG" alt="設為首頁"></a></td>
              <td width="127"><a href='javascript:home();' title='home'><font color="#FF0000">設為首頁</font></a></td>
            </tr>
            <tr>
              <td width="35"><a href='javascript:bookmark();' title='bookmark'><img border="0" src="start.PNG" width="33" height="32"　alt="設為最愛"></a></td>
              <td width="127"><a href='javascript:bookmark();' title='bookmark'><font color="#FF0000">設成我的最愛</font></a></td>
            </tr>
          </table>
          </div>
      </td>
    </tr>
    <tr>
      <td width="24%" height="100%">
          <%
          if rs_session.recordcount=0 then
             if isempty(request("login")) then 
             response.write " "
             response.write "<div id='123' style='position:absolute; left: 0px; top:85px '><table border=0 ><tr><td>"
             response.write ("<iframe id='sys_data' name='data'  scrolling=no frameborder=0 width='100%' height='600' src='login_new.asp' style='z-index:1'></iframe>") 
             response.write "</td></tr></table></div>"
			 response.write "<div id='123' style='position:absolute; left:250px; top:100px'>"
			 response.write "<p><img border='0' src='../HOT.JPG' width='217' height='140'></p>"
			 response.write "</div>"
			 response.write "<div id='123' style='position:absolute; left:280px; top:270px'>"
			 response.write "<table border='0' width='295' height='180'>"
			 response.write "    <tr>"
			 response.write "      <td  height='20' ><p >車型:</p></td>"
			 response.write "      <td width='235' height='20'><div id='type' ></div></td>"
			 response.write "    </tr>"
			 response.write "    <tr>"
			 response.write "      <td  height='20'><p >價格:</p></td>"
			 response.write "      <td width='235' height='20'><div id='price'></div></td>"
			 response.write "    </tr>"
			 response.write "	    <tr>"
			 response.write "      <td  height='20'><p>年份:</p></td>"
			 response.write "      <td width='235' height='20'><div id='year' ></div></td>"
			 response.write "    </tr>"
			 response.write "    <tr >"
			 response.write "      <td  colspan='2' height='20'><p>好處看這裡:</p></td>"
			 response.write "	</tr>"
			 response.write "	<tr >"
			 response.write "      <td  colspan='2' height='100'><div id='memo' left:300px; top:270px style='width: 175; height: 100' ></div></td>"
			 response.write "    </tr>"
			 response.write "</table>"
			 
			 response.write "</div>"
			 response.write "<div id='123' style='position:absolute; left:490px; top:90px'>"
			 response.write "<p><img border='0' src='../TV.PNG' width='492' height='400'></p>"
			 response.write "</div>"
			 response.write "<div id='123' style='position:absolute; left:510px; top:115px'>"
			 response.write "<p align='left'>"
			 response.write "<CENTER>"
			 response.write "<IMG SRC='12.gif' NAME='mypic' BORDER=0  width='450' height='286' align='left'></CENTER>"
			 response.write "</div>"
			 response.write "<div id='123' style='position:absolute; left:470px; top:500px'>"
			 response.write "          <p align='center'><img border='0' src='../index1.JPG' width='554' height='46'></p>"
			 response.write "          <p align='center'><img border='0' src='../index2.gif' width='451' height='44'></p>"
			 response.write "</div>"
             end if
          else
             '--&shy;Y&curren;w&micro;n&curren;J,&laquo;h&copy;&oacute;onload or reload&reg;&Eacute;&ordf;&frac12;&iexcl;&Oacute;&micro;&para;i&curren;J&uml;t&sup2;&Icirc;
             response.write ("<BODY bgColor='#FFffFF' onload="+chr(34)+"load('./../wmg/wmg_004_eip.asp?has_logined=1')"+chr(34)+">")   
          end if

          %>
    
      </td>
      <td width="76%" height="85%" rowspan="2" valign="top">
      </td>
    </tr>
    <tr>
      <td width="21%" height="100%" >
      </td>
    </tr>
  </table>
</div>

</body>
<%
conn_2.close
%>

</html>
