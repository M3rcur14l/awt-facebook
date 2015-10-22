<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s"%>
<%@ page session="false"%>

<!DOCTYPE html>
<meta charset="utf-8">
<script src="http://d3js.org/d3.v3.min.js"></script>
<style>

.link {
  fill: none;
  stroke: #9ecae1;
  stroke-width: 1.5px;
}

.node {
  fill: #ccc;
  stroke: #fff;
  stroke-width: 1.5px;
}

text {
  font: 10px sans-serif;
  pointer-events: none;
}

</style>
<body>
<script>


var nodes = [
             {id: "1250057259", name: "Antonello Fodde"},
             {id: "100000584563204", name: "Davide Meloni"},
             {id: "1037911730", name: "Pietro Dentesano"},
             {id: "1128994776", name: "Valentina Canopoli"}
           ];
           
var links = [
  			 {source: 0, target: 1},
  			 {source: 2, target: 3},
			];

var width = 960,
    height = 500;

var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(60)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link")
    .data(force.links())
  	.enter().append("line")
    .attr("class", "link");

var node = svg.selectAll(".node")
    .data(force.nodes())
  	.enter().append("g")
    .attr("class", "node")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
	.on("dblclick", dblclick)
    .call(force.drag);


  node.append("image")
      .attr("xlink:href", function(d) { return ("http://graph.facebook.com/" + d.id + "/picture"); })
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 32)
      .attr("height", 32);

// node.append("text")
//     .attr("x", 12)
//     .attr("dy", ".35em")
//     .text(function(d) { return d.name; });

function tick() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function mouseover(d) {
	links.forEach(function(link) {
		if (link.source.id == d.id || link.target.id == d.id) 
			window.alert(toString(svg.getElementById(link)));
	});
}

function mouseout() {
  d3.select(this).select("image").transition()
      .duration(750)
      .attr("r", 8);
}

function dblclick(d) {
	window.alert(d.name);
	}

</script>