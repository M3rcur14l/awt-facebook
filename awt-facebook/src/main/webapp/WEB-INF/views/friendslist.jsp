<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Friends</title>
<!--Foundation Styles-->
<link href="<c:url value="/resources/css/foundation.css"/>"
	rel="stylesheet" type="text/css">
<link href="<c:url value="/resources/css/foundation.min.css"/>"
	rel="stylesheet" type="text/css">
<link href="<c:url value="/resources/css/normalize.css"/>"
	rel="stylesheet" type="text/css">
<!--My styles-->
<link href="<c:url value="/resources/css/index.css"/>" rel="stylesheet"
	type="text/css">
<link rel="stylesheet"
	href="<c:url value="/resources/foundation-icons/foundation-icons.css"/>">
<!--Foundation Scripts-->

<script src="<c:url value="/resources/js/vendor/jquery.js"/>"></script>
<script src="<c:url value="/resources/js/vendor/modernizr.js"/>"
	type="text/javascript"></script>

</head>
<body>
	<!-- Header and Nav -->

	<div class="row">
		<div class="large-12 columns">
			<div class="panel">


				<h1>Your Facebook Friends</h1>

			</div>
		</div>
	</div>
	<!-- End Header and Nav -->
	<div id="header" class="row">
		<!-- Nav Sidebar -->
		<!-- This is source ordered to be pulled to the left on larger screens -->
		<div class="large-3 small-12 columns ">
			<div class="panel">
				<a href="#"><img
					src="http://graph.facebook.com/<c:out value="${user.id}"/>/picture?type=normal" /></a>
				<h5>
					<Strong>User ID</Strong>:
					<c:out value="${user.id}" />
				</h5>
				<h5 class="title">
					<Strong>Name</strong>:
					<c:out value="${user.name}" />
				</h5>
				<h5 class="title">
					<Strong>Location</Strong>:
					<c:out value="${user.getLocation().name}" />
				</h5>
				<h5 class="title">
					<Strong>Nickname</Strong>:
					<c:out value="${user.username}" />
				</h5>
				<h5 class="title">
					<Strong>Gender</Strong>:
					<c:out value="${user.gender}" />
				</h5>
			</div>
		</div>
		<!-- Main Feed -->
		<!-- This has been source ordered to come first in the markup (and on small devices) but to be to the right of the nav on larger screens -->
		<div class="large-9 small-10 columns ">
			<!-- Feed Entry -->
			<div>
			<nav class="top-bar" data-topbar>
				<ul  class="title-area">
					<li class="name"><a class="button small" href="<c:url value="/signin"/>"><Strong>Home</strong></a></li>
					
				</ul>
				<ul class="right">
				<li class="name"><a class="button small" href="<c:url value="/signout"/>">Signout</a></li>
				</ul>
				</nav>
				<p><strong>Instruction:</strong> select some friends and discover which ones are common friends</p>
				<form id="myForm" class="custom" action="<c:url value="commonFriends"/>"
					method="POST">
					<c:set var="count" value="0"/>
					<table>
						<c:forEach items="${friends}" var="friend" >
							<tr>
							
							<td>${count + 1}</td>
							<c:set var="count" value="${count + 1}"/>
							<c:choose>
										<c:when test="${friend.gender != 'male'}">
											<td><i class="fi-female"></i></td>
										</c:when>
										<c:otherwise>
											<td><i class="fi-male"></i></td>
										</c:otherwise>
									</c:choose>
									<td><input type="checkbox" name="friend" value="${friend.id}"></td>
									<td><c:out value="${friend.name}" /></td>
							</tr>
						</c:forEach>
						</table>
				</form>
			</div>
		
		</div>
		<div class="large-2 small-3 columns">
			<br />
			<button id="subButton" class="button round" type="submit" form="myForm">Get Common Friends</button>
			<p id="back-top">
				<a href="#top"><span><br />Back to Top</span></a>
			</p>
		</div>
	</div>
	
	<script>
		$(document).ready(function() {
			$("#subButton").hide();
			// hide #back-top first
			$("#back-top").hide();

			// fade in #back-top
			$(function() {
				$(window).scroll(function() {
					if ($(this).scrollTop() > 100) {
						$('#back-top').fadeIn();
					} else {
						$('#back-top').fadeOut();
					}
				});

				// scroll body to 0px on click
				$('#back-top a').click(function() {
					$('body,html').animate({
						scrollTop : 0
					}, 800);
					return false;
				});
				
			});
			$("input[type=checkbox]").click(function() {
				$("#subButton").show();
		    });
		});
	</script>

<!-- Footer -->
	<footer class="row">
		<div class="large-12 columns">
			<hr />
			<div class="panel">
				<div class="row">
					<div>

						<p>© Copyright 2014</p>

						developers: <a href="https://www.facebook.com/antofodde">Antonello
							Fodde</a> and <a href="https://www.facebook.com/chai.botta">Chai
							Botta</a>

					</div>
				</div>
			</div>
		</div>
	</footer>
	<script src="<c:url value="/resources/js/foundation.min.js"/>"
		type="text/javascript"></script>
</body>
</html>