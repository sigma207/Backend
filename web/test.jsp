<%@ page import="com.jelly.service.BulletinService" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" %>
<%@ page import="org.springframework.context.ApplicationContext" %>
<%@ page import="java.util.Calendar" %>
<%@ page import="java.text.DateFormat" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%--
  Created by IntelliJ IDEA.
  User: user
  Date: 2015/7/8
  Time: 下午 03:20
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(getServletConfig().getServletContext());
  BulletinService service = (BulletinService)context.getBean("bulletinServiceBean");
  service.update();
  DateFormat df = new SimpleDateFormat("HH:mm:ss");
  System.out.println(df.format(Calendar.getInstance().getTime()) + " " + session.getId() + " update jsp");
%>
<html>
<head>
    <title></title>
</head>
<body>
update!!
</body>
</html>
