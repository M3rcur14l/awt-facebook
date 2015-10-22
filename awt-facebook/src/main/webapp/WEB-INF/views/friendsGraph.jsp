<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s"%>
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Graph</title>
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


<script src="<c:url value="/resources/js/vendor/jquery.js"/>"
	type="text/javascript"></script>
<script src="<c:url value="/resources/js/vendor/modernizr.js"/>"
	type="text/javascript"></script>

<script type="text/javascript"
	src="<c:url value="/resources/js/vivagraph.js" />"></script>
<script type="text/javascript"
	src="<c:url value="/resources/js/graphalgorithm.js" />"></script>
</head>
<body onload='main()'>
	<script>
		function main() {
			
			if (!document.implementation.hasFeature(
					'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1')) {
				$('#graph')
						.html(
								'Your browser does not support SVG. Sorry! Click to go back.');
				return;
			}
			var graph = Viva.Graph.graph();

			var layout = Viva.Graph.Layout.forceDirected(graph, {
				springLength : 30,
				springCoeff : 1e-4,
				dragCoeff : .05,
				gravity : -50,
				theta : .5
			});
			var graphics = Viva.Graph.View.svgGraphics(), nodeSize = 50;

			<c:set var="Cc" value="Cc"/>
			<c:set var="NCc" value="NCc"/>
			<c:set var="Dc" value="Dc"/>
			<c:set var="NDc" value="NDc"/>
			<c:set var="Cb" value="Cb"/>
			<c:set var="NCb" value="NCb"/>

			graph
					.addNode(
							'<c:out value="${user.getId()}"/>',
							{
								name : '<c:out value="${user.getName()}"/>',
								closenessCentrality : '<c:out value="${graph.getNode(user.getId()).getAttribute(Cc)}"/>',
								normalizedClosenessCentrality : '<c:out value="${graph.getNode(user.getId()).getAttribute(NCc)}"/>',
								betweennessCentrality : '<c:out value="${graph.getNode(user.getId()).getAttribute(Cb)}"/>',
								normalizedbetweennessCentrality : '<c:out value="${graph.getNode(user.getId()).getAttribute(NCb)}"/>',
								degreeCentrality : '<c:out value="${graph.getNode(user.getId()).getAttribute(Dc)}"/>',
								normalizedDegreeCentrality : '<c:out value="${graph.getNode(user.getId()).getAttribute(NDc)}"/>'
							});
			<c:forEach items="${friends}" var="friend">
			graph
					.addNode(
							'<c:out value="${friend.getId()}"/>',
							{
								name : '<c:out value="${friend.getName()}"/>',
								closenessCentrality : '<c:out value="${graph.getNode(friend.getId()).getAttribute(Cc)}"/>',
								normalizedClosenessCentrality : '<c:out value="${graph.getNode(friend.getId()).getAttribute(NCc)}"/>',
								betweennessCentrality : '<c:out value="${graph.getNode(friend.getId()).getAttribute(Cb)}"/>',
								normalizedbetweennessCentrality : '<c:out value="${graph.getNode(friend.getId()).getAttribute(NCb)}"/>',
								degreeCentrality : '<c:out value="${graph.getNode(friend.getId()).getAttribute(Dc)}"/>',
								normalizedDegreeCentrality : '<c:out value="${graph.getNode(friend.getId()).getAttribute(NDc)}"/>'
							});
			</c:forEach>
			<c:forEach items="${friendships}" var="friendship">
			graph.addLink('<c:out value="${user.getId()}"/>',
					'<c:out value="${friendship.firstId}"/>');
			graph.addLink('<c:out value="${user.getId()}"/>',
					'<c:out value="${friendship.secondId}"/>');
			graph.addLink('<c:out value="${friendship.firstId}"/>',
					'<c:out value="${friendship.secondId}"/>');
			</c:forEach>
			//
			// we use this method to highlight all realted links
			// when user hovers mouse over a node:
			highlightRelatedNodes = function(nodeId, isOn) {
				// just enumerate all realted nodes and update link color:
				graph.forEachLinkedNode(nodeId, function(node, link) {
					var linkUI = graphics.getLinkUI(link.id);
					if (linkUI) {
						// linkUI is a UI object created by graphics below
						linkUI.attr('stroke', isOn ? 'red' : 'gray');
					}
				});
			};

			// Since we are using SVG we can easily subscribe to any supported
			// events (http://www.w3.org/TR/SVG/interact.html#SVGEvents ),
			// including mouse events:
			graphics.node(
					function(node) {
						var ui = Viva.Graph.svg('image')
								.attr('width', nodeSize).attr('height',
										nodeSize).link(
										'http://graph.facebook.com/' + node.id
												+ '/picture');

						$(ui).hover(function() { // mouse over
							highlightRelatedNodes(node.id, true);
						}, function() { // mouse out
							highlightRelatedNodes(node.id, false);
						});
						$(ui).dblclick(function() { //click friendGraph
							showDialog(node);

						});
						return ui;
					}).placeNode(
					function(nodeUI, pos) {
						nodeUI.attr('x', pos.x - nodeSize / 2).attr('y',
								pos.y - nodeSize / 2);
					});

			graphics.link(function(link) {
				return Viva.Graph.svg('path').attr('stroke', 'gray');
			}).placeLink(
					function(linkUI, fromPos, toPos) {
						var data = 'M' + fromPos.x + ',' + fromPos.y + 'L'
								+ toPos.x + ',' + toPos.y;

						linkUI.attr("d", data);
					})

			// Finally render the graph with our customized graphics object:
			var renderer = Viva.Graph.View.renderer(graph, {
				layout : layout,
				graphics : graphics,
				container : document.getElementById("graph")
			});
			renderer.run();

		}
		
	</script>

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


		<div class="large-12 columns ">
			<nav class="top-bar" data-topbar>
				<ul class="title-area">
					<li class="name"><a class="button small" href="<c:url value="/friendslist"/>">Friends</a></li>
				</ul>
				<ul class="left"><li class="name"><a class="button small"  href="<c:url value="/friendsGraph"/>"><Strong>Graph</strong></a></li>
					</ul>
					<ul class="right"><li class="name"><a class="button small"  href="<c:url value="/signout"/>">Signout</a></li></ul>
			</nav>
			<div class="large-12 columns" id="graph"></div>
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
	</footer>


	<script src="<c:url value="/resources/js/vendor/fastclick.js"/>"
		type="text/javascript"></script>
	<script src="<c:url value="/resources/js/foundation.min.js"/>"
		type="text/javascript"></script>



	<script>
		$(document).foundation();
	</script>
</body>