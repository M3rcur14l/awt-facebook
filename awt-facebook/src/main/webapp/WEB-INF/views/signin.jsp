<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Profile</title>
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


				<h1>Your Facebook Profile</h1>

			</div>
		</div>
	</div>
	<!-- End Header and Nav -->
	<div id="header" class="row">
		<!-- Nav Sidebar -->
		<!-- This is source ordered to be pulled to the left on larger screens -->
		<div class="large-3 columns ">
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
		<div class="large-9 columns">

			<!-- Feed Entry -->
			<div class="row">

				<div class="large-12 columns">
					<nav class="top-bar" data-topbar>
						<ul class="title-area">
							<li class="name"><a class="button small"
								href="<c:url value="/friendslist"/>">My Friends</a></li>
						</ul>
						<ul class="right">
							<li class="name"><a class="button small"
								href="<c:url value="/signout"/>">Signout</a></li>
						</ul>
					</nav>
					<p>
						<strong>Wellcome</strong>
					</p>
					<p>
						Hi <strong><c:out value="${user.name}" /></strong>, thanks for
						using this application:
					</p>
					<br />
					<p>
						You have <strong><c:out value="${friendCount}" /></strong>
						friends
					</p>
					<br />


				</div>

				<!-- Right Sidebar -->
				<!-- On small devices this column is hidden -->


			</div>
		</div>

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

			<script src="<c:url value="/resources/js/foundation.min.js"/>"
				type="text/javascript"></script>
			<script type="text/javascript">
				$(document).foundation();
			</script>
</body>
</html>