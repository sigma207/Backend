<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" %>
<%@ page import="org.springframework.context.ApplicationContext" %>
<%@ page import="com.jelly.service.BulletinService" %>
<%@ page import="com.jelly.pojo.Bulletin" %>
<%@ page import="java.util.List" %>
<%@ page import="java.text.DateFormat" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Calendar" %>
<%--
  Created by IntelliJ IDEA.
  User: user
  Date: 2015/7/6
  Time: 下午 02:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(getServletConfig().getServletContext());
  BulletinService service = (BulletinService)context.getBean("bulletinServiceBean");
  DateFormat df = new SimpleDateFormat("HH:mm:ss");
  System.out.println(df.format(Calendar.getInstance().getTime())+" "+session.getId()+" cache jsp");
  List<Bulletin> bulletinList = service.getBulletinList("20140507","20140509");
%>
<html>
<head>
    <title></title>
</head>
<body>
<%=bulletinList.size()%>
</body>
</html>
