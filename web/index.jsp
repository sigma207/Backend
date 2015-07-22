<%@ page import="org.springframework.context.ApplicationContext" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" %>
<%@ page import="com.jelly.service.SocketService" %>
<%--
  Created by IntelliJ IDEA.
  User: user
  Date: 2015/6/12
  Time: 上午 11:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(getServletConfig().getServletContext());
  SocketService socketService = (SocketService)context.getBean("socketServiceBean");
  int value = socketService.getCurrentValue();
%>
<html>
  <head>
    <title></title>
  </head>
  <body>
  <div>
    currentValue=<%=value%>
  </div>
  </body>
</html>
