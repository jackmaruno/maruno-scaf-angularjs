<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%> 
<!DOCTYPE html>
<html class="bg-black">
    <head>
        <meta charset="UTF-8">
        <title>SCAF - Auto Autenticação</title> 
    </head>
    
    <body> 
 
		<form method="post" action="j_spring_security_check">
			<input name="j_username" type="hidden" value="<%=request.getParameter("login") %>"/>
			<input name="j_password" type="hidden" value="<%=request.getParameter("senha") %>"/>
			<button type="submit" style="display:none"></button>    
			<script>
				document.forms[0].submit();
			</script>
		</form>  
    </body>
</html> 