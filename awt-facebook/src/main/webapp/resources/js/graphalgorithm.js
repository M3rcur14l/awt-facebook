
function addName(node){
	var container = '<div class="row">';
	var image = '<div id="innerContent" style="margin: 0 auto;"><img style="margin: 0 auto;" src="https://graph.facebook.com/'+node.id+'/picture?type=normal" /> ';
	var startdiv = '<div"><table><tbody>';
	var idString = '<tr><td><Strong>User_id</Strong>:</td><td>' + node.id + '</td></tr>';
	var nameString = '<tr><td><Strong>Name</Strong>:</td><td>' + node.data.name + '</td></tr>';
	
	var closenessC = '<tr><td><Strong><span data-tooltip class="tip-top" title="Closeness Centrality">Cls Centrality</span></Strong>: ' + node.data.closenessCentrality + '</td><td><Strong>Normalized</Strong>: ' + node.data.normalizedClosenessCentrality + '</td></tr>';

	
	var betweenessC = '<tr><td><Strong><span data-tooltip class="tip-top" title="Betweenness Centrality">Btw Centrality</span></Strong>: ' + node.data.betweennessCentrality + '</td><td><Strong>Normalized</Strong>: ' + node.data.normalizedbetweennessCentrality + '</td></tr>';
	
	
	var degreeCentrality = '<tr><td><Strong><span data-tooltip class="tip-top" title="Betweenness Centrality">Dge Centrality</span></Strong>: '+ node.data.degreeCentrality +'</td><td><Strong>Normalized</Strong>: ' + node.data.normalizedDegreeCentrality + '</td></tr>';


	var endDiv = '</tbody></table> </div></div></div>';
	var result = container.concat(image).concat(startdiv).concat(idString).concat(nameString).concat(closenessC).concat(betweenessC).concat(degreeCentrality).concat(endDiv);
	return result;
}


function showDialog(node) {
	var content = addName(node);
     $('<div></div>').addClass('reveal-modal small').attr('data-reveal', '').append($(content)).appendTo('body').foundation('reveal').foundation('reveal','open');
 }

//
//function showGraph(){
//	var user = ${user};
//	var friends = ${friends};
//	var friendships = ${friendships};
//	var graphS = ${graph};
//	
//	var graph = Viva.Graph.graph();
//
//	var layout = Viva.Graph.Layout.forceDirected(graph, {
//		springLength : 50,
//		springCoeff : 1e-4,
//		dragCoeff : .05,
//		gravity : -60,
//		theta : .5
//	});
//	var graphics = Viva.Graph.View.svgGraphics(), nodeSize = 50;
//
//	graph
//			.addNode(
//					user.getId(),
//					{
//						name : user.getName(),
//						closenessCentrality : graphS.getNode(user.getId()).getAttribute(Cc),
//						normalizedClosenessCentrality : graphS.getNode(user.getId()).getAttribute(NCc),
//						betweennessCentrality : graphS.getNode(user.getId()).getAttribute(Cb),
//						normalizedbetweennessCentrality : graphS.getNode(user.getId()).getAttribute(NCb),
//						degreeCentrality : graphS.getNode(user.getId()).getAttribute(Dc),
//						normalizedDegreeCentrality : graphS.getNode(user.getId()).getAttribute(NDc)
//					});
//for(var i = 0 ; i< friends.size(); i++){
//	var friend = friends.get(i);
//	graph
//			.addNode(
//					friend.getId(),
//					{
//						name : friend.getName(),
//						closenessCentrality : graphS.getNode(user.getId()).getAttribute(Cc),
//						normalizedClosenessCentrality : graphS.getNode(user.getId()).getAttribute(NCc),
//						betweennessCentrality : graphS.getNode(user.getId()).getAttribute(Cb),
//						normalizedbetweennessCentrality : graphS.getNode(user.getId()).getAttribute(NCb),
//						degreeCentrality : graphS.getNode(user.getId()).getAttribute(Dc),
//						normalizedDegreeCentrality : graphS.getNode(user.getId()).getAttribute(NDc)
//					});
//}
//	
//
//	for(var j= 0; j< friendships.size(); j++){
//		var friendship = friendships.get(i);
//	graph.addLink(user.getId(),
//			friendship.firstId);
//	graph.addLink(user.getId(),
//			friendship.secondId);
//	graph.addLink(friendship.firstId,
//			friendship.secondId);
//	}
//
//	//
//	// we use this method to highlight all realted links
//	// when user hovers mouse over a node:
//	highlightRelatedNodes = function(nodeId, isOn) {
//		// just enumerate all realted nodes and update link color:
//		graph.forEachLinkedNode(nodeId, function(node, link) {
//			var linkUI = graphics.getLinkUI(link.id);
//			if (linkUI) {
//				// linkUI is a UI object created by graphics below
//				linkUI.attr('stroke', isOn ? 'red' : 'gray');
//			}
//		});s
//	};
//
//	// Since we are using SVG we can easily subscribe to any supported
//	// events (http://www.w3.org/TR/SVG/interact.html#SVGEvents ),
//	// including mouse events:
//	graphics.node(
//			function(node) {
//				var ui = Viva.Graph.svg('image')
//						.attr('width', nodeSize).attr('height',
//								nodeSize).link(
//								'http://graph.facebook.com/' + node.id
//										+ '/picture');
//
//				$(ui).hover(function() { // mouse over
//					highlightRelatedNodes(node.id, true);
//				}, function() { // mouse out
//					highlightRelatedNodes(node.id, false);
//				});
//				$(ui).dblclick(function() { //click friendGraph
//					showDialog(node);
//
//				});
//				return ui;
//			}).placeNode(
//			function(nodeUI, pos) {
//				nodeUI.attr('x', pos.x - nodeSize / 2).attr('y',
//						pos.y - nodeSize / 2);
//			});
//
//	graphics.link(function(link) {
//		return Viva.Graph.svg('path').attr('stroke', 'gray');
//	}).placeLink(
//			function(linkUI, fromPos, toPos) {
//				var data = 'M' + fromPos.x + ',' + fromPos.y + 'L'
//						+ toPos.x + ',' + toPos.y;
//
//				linkUI.attr("d", data);
//			})
//
//	// Finally render the graph with our customized graphics object:
//	var renderer = Viva.Graph.View.renderer(graph, {
//		layout : layout,
//		graphics : graphics,
//		container : document.getElementById("graph")
//	});
//	renderer.run();
//}