<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html class="no-js" lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login</title>
<!--Foundation Styles-->
<link href="<c:url value="/resources/css/foundation.css"/>"
	rel="stylesheet" type="text/css">
<link href="<c:url value="/resources/css/foundation.min.css"/>"
	rel="stylesheet" type="text/css">
<link href="<c:url value="/resources/css/normalize.css"/>"
	rel="stylesheet" type="text/css">
<!--My styles-->
<link href="<c:url value="/resources/css/login.css"/>" rel="stylesheet"
	type="text/css">
<link rel="stylesheet"
	href="<c:url value="/resources/foundation-icons/foundation-icons.css"/>">
<!--Foundation Scripts-->
<script src="<c:url value="/resources/js/vendor/jquery.js"/>"></script>
<script src="<c:url value="/resources/js/vendor/modernizr.js"/>"
	type="text/javascript"></script>
<script src="<c:url value="/resources/ribbon_effect/colorHSV.js"/>"></script>
<script src="<c:url value="/resources/ribbon_effect/ribbonLines.js"/>"></script>
<script src="<c:url value="/resources/ribbon_effect/pixel.js"/>"></script>

</head>

<body>
	<!-- Header and Nav -->

	<div class="row">
		<div class="large-12 columns">
			<div class="panel">


				<h1>Facebook Social Friends Discovery Application</h1>

			</div>
		</div>
	</div>
	<!-- End Header and Nav -->
	<div id="main" class="row">
		<!-- Nav Sidebar -->
		<!-- This is source ordered to be pulled to the left on larger screens -->
		<div id="mainbody" class="large-12 columns">
			<div class="panel">
				<p>Login to facebook to access the application feature</p>
				<br />
				<form name="fb_signin" id="fb_signin"
					action="<c:url value="signin/facebook"/>" method="POST">
					<input type="hidden" name="scope"
						value="email,publish_stream,user_photos,offline_access" />

						<input type="submit" class="button radius round" value="Connect to Facebook" />
					
				</form>
			</div>

		</div>
	</div>
	<div class="row">
		<div ind="parentCanvas" class="large-12 columns">
			<canvas id="ribbonLines" onmousemove="ribbonsMouseMove(event)">
            </canvas>
		</div>
	</div>
	<!-- Main Feed -->
	<!-- This has been source ordered to come first in the markup (and on small devices) but to be to the right of the nav on larger screens -->
	<script>
		var canvas = document.getElementById("ribbonLines");

		var ctx = canvas.getContext("2d");

		var canvasCenterX;
		var canvasCenterY;
		var radius;
		var speed;
		var angle;
		var color;
		var ribbons;
		var pixels;
		var w;
		var h;
		window.addEventListener('resize', resizeCanvas, false);

		function resizeCanvas() {
			var main = document.getElementById("mainbody");
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			w = parseInt(canvas.width);
			h = parseInt(canvas.height);
			canvasCenterX = (w) / 2;
			canvasCenterY = (h) / 2
			radius = 200;
			// Speed of movement
			speed = .07;
			// Angle for computing cosine and sin.
			angle = 0;

			// ctx.fillStyle = "black";

			// ctx.fillRect(0, 0, w, h);

			color = new ColorHSV(0, 0.8, 1);
			ribbons = new RibbonLines(ctx, canvasCenterX, canvasCenterY);
			pixels = new pixels(ctx);

			setInterval(render, 30);

		}
		resizeCanvas();

		function ribbonsMouseMove(event) {
			ribbons.pushPoint(event.clientX, event.clientY);
			pixels.add(event.clientX, event.clientY);
		}

		function genrandomPath() {
			/* var randX = Math.floor((Math.random()*w)+1);
			var randY = Math.floor((Math.random()*h)+1);
			  
			 */
			var randX = canvasCenterX + Math.cos(angle) * radius;
			var randY = canvasCenterY + Math.sin(angle) * radius;
			var randX2 = canvasCenterX + Math.sin(angle) * radius;
			var randY2 = canvasCenterY + Math.cos(angle) * radius;
			angle += speed;

			ribbons.pushPoint(randX, randY);

			pixels.add(randX2, randY2);
		}

		function render() {
			genrandomPath();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// ctx.fillStyle = "black";
			//ctx.fillRect(0, 0, w, h);

			if (color._h == 360)
				color.setH(0);
			else
				color.setH(color._h + 1);

			ribbons.color = color;
			ribbons.render();
			color.setH(color._h + 3);
			pixels.color = color;
			pixels.render();
		}
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

	<script src="<c:url value="/resources/js/foundation.min.js"/>"
		type="text/javascript"></script>
</body>
</html>