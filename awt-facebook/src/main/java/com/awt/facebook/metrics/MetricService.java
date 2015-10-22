package com.awt.facebook.metrics;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.graphstream.algorithm.BetweennessCentrality;
import org.graphstream.algorithm.Dijkstra;
import org.graphstream.algorithm.Dijkstra.Element;
import org.graphstream.algorithm.measure.AbstractCentrality;
import org.graphstream.algorithm.measure.ClosenessCentrality;
import org.graphstream.algorithm.measure.DegreeCentrality;
import org.graphstream.graph.Graph;
import org.graphstream.graph.Node;
import org.graphstream.graph.implementations.SingleGraph;
import org.springframework.social.facebook.api.FacebookProfile;
import org.springframework.stereotype.Service;

import com.awt.facebook.persistence.Friendship;

/*
 * Degree Centrality attribute name: Dc
 * Degree Centrality Normalized attribute name: NDc
 * 
 * Closeness Centrality attribute name: Cc
 * Closeness Centrality Normalized attribute name: Ncc
 * 
 * Betweenness Centrality attribute name: Cb
 * Betweenness Centrality Normalized attribute name: NCb
 * */
/**
 * This class is used to compute all the metrics used in the application
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 * 
 */
@Service
public class MetricService {

	public MetricService() {
	}

	/**
	 * Returns a <tt>Graph</tt> object with all friends as nodes and all
	 * friendships as relationships
	 * 
	 * @param selectedFriendsProfiles
	 *            a set of the selected friends
	 * @param fList
	 *            the list of the friendships
	 * @param localUser
	 *            the application user id
	 * @return a <tt>Graph</tt> object
	 */
	public Graph getGraph(Set<FacebookProfile> selectedFriendsProfiles,
			List<Friendship> fList, String localUser) {
		Graph friendGraph = new SingleGraph("FriendshipGraph");
		friendGraph.setStrict(false);
		Integer edgeId = 0;
		friendGraph.addNode(localUser);// add the localUser Node
		for (FacebookProfile nodeId : selectedFriendsProfiles) {
			friendGraph.addNode(nodeId.getId());
		}
		for (Friendship f : fList) {
			// link localUser with first userId
			friendGraph.addEdge(edgeId.toString(), localUser, f.getFirstId());
			edgeId = edgeId + 1;
			// link localUser with second userId
			friendGraph.addEdge(edgeId.toString(), localUser, f.getSecondId());
			edgeId = edgeId + 1;
			// link first userID with second userId
			friendGraph.addEdge(edgeId.toString(), f.getFirstId(),
					f.getSecondId());
			edgeId = edgeId + 1;
		}
		return friendGraph;
	}

	/**
	 * Returns a <tt>Graph</tt> object with all friends as nodes and all
	 * friendships as relationships with all the metrics computed.
	 * 
	 * @param selectedFriendsProfiles
	 *            a set of the selected friends
	 * @param fList
	 *            the list of the friendships
	 * @param localUser
	 *            the application user id
	 * @return a <tt>Graph</tt> object
	 */
	public Graph getGraphWithMetrics(
			Set<FacebookProfile> selectedFriendsProfiles,
			List<Friendship> fList, String localUser) {
		Graph friendGraph = getGraph(selectedFriendsProfiles, fList, localUser);
		getBetweennessCentrality(friendGraph);
		getDegreeCentrality(friendGraph);
		getClosenessCentrality(friendGraph);
		return friendGraph;
	}

	/**
	 * Computes the Betweenness Centrality
	 * 
	 * @param graph
	 *            the <tt>Graph</tt> object
	 * @return a collection of nodes
	 */
	public Collection<Node> getBetweennessCentrality(Graph graph) {

		BetweennessCentrality bc = new BetweennessCentrality();
		bc.setCentralityAttributeName("Cb");
		bc.init(graph);
		bc.compute();
		
	
		for (Node node : graph.getNodeSet()) {
			double normalizeFactor = (double) (graph.getNodeCount() - 1)
					* (graph.getNodeCount() - 2) / 2;
			double cbValue = ((Double) node.getAttribute("Cb")).doubleValue();
			node.addAttribute("Cb", Math.round(cbValue * 100.0) / 100.0);
			node.addAttribute(
					"NCb",
					Math.round((float) (cbValue / normalizeFactor) * 100.0) / 100.0); // normalized
		}
		return graph.getNodeSet();
	}

	/**
	 * Computes the Closeness Centrality
	 * 
	 * @param graph
	 *            the <tt>Graph</tt> object
	 * @return a collection of nodes
	 * 
	 */
	public Collection<Node> getClosenessCentrality(Graph graph) {
		ClosenessCentrality cc = new ClosenessCentrality("Cc");
		cc.init(graph);
		cc.compute();

		//normalized closenessCentrality
		ClosenessCentrality Ncc = new ClosenessCentrality("NCc",
				AbstractCentrality.NormalizationMode.SUM_IS_1);
		Ncc.init(graph);
		Ncc.compute();	
		
		 for (Node source : graph.getNodeSet()) {
			 Double ncc = source.getAttribute("NCc");
			 Double cc1 = source.getAttribute("Cc");
		 source.addAttribute( "NCc",
		 (Math.round(ncc.doubleValue()*100))/100.0); 
			 source.addAttribute( "Cc",
					 (Math.round(cc1.doubleValue()*100))/100.0); 
		 }
		 

		return graph.getNodeSet();
	}
	/**
	 * Computes the Degree Centrality
	 * 
	 * @param graph
	 *            the <tt>Graph</tt> object
	 * @return a collection of nodes
	 * 
	 */
	public Collection<Node> getDegreeCentrality(Graph graph) {
		DegreeCentrality dc = new DegreeCentrality();
		dc.setCentralityAttribute("Dc");
		dc.init(graph);
		dc.compute();
				//normalized degree centrality
		for (Node node : graph.getNodeSet()) {
			node.addAttribute("NDc",Math.round(((Double)node.getAttribute("Dc")).doubleValue()/(graph.getNodeCount()-1)*100)/100.0 );
			
		}
		return graph.getNodeSet();
	}

	// Dijkstra algorithm for shortest path algorithm
	public double getShortestPath(Graph graph, Node source, Node target) {
		Dijkstra dijkstra = new Dijkstra(Element.EDGE, "Sp", null);
		dijkstra.init(graph);
		dijkstra.setSource(source);
		dijkstra.compute();

		return dijkstra.getPathLength(target);
	}

}
