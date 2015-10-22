package com.awt.facebook;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.graphstream.graph.Graph;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookProfile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.awt.facebook.account.UserCookieGenerator;
import com.awt.facebook.metrics.MetricService;
import com.awt.facebook.persistence.Friendship;
import com.awt.facebook.persistence.FriendshipsDao;

/**
 * This controller handles all the operation regarding the friends graph page.
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 * 
 */

@Controller
public class GraphController {

	/**
	 * The encryptor used to decrypt the user id cookie
	 */
	@Inject
	private TextEncryptor encryptor;

	/**
	 * The object for accessing the user's cookies
	 */
	@Inject
	private UserCookieGenerator userCookieGenerator;

	/**
	 * For retrieve the connection stored persistently into the database
	 */
	@Inject
	private UsersConnectionRepository connectionRepository;

	/**
	 * The friendships data access object
	 */
	@Inject
	private FriendshipsDao dao;

	/**
	 * The metric service for computing the metrics
	 */

	@Inject
	private MetricService mService;

	/**
	 * Returns a <tt>Facebook</tt> instance by passing the user's http <tt>request</tt>
	 * . First it gets the user id with the <tt>getUserId</tt> method, then it
	 * uses the <tt>UsersConnectionRepository</tt> for retrieving the user connection
	 * from the database
	 * 
	 * @param request
	 *            the http request
	 * @return the <tt>Facebook</tt> instance
	 */
	public Facebook facebook(HttpServletRequest request) {
		String userId = getUserId(request);
		return connectionRepository.createConnectionRepository(userId)
				.getPrimaryConnection(Facebook.class).getApi();
	}

	/**
	 * Returns the friends graph page. It retrieves all the friendships
	 * selection from the database using the <tt>FriendshipsDao</tt> and
	 * computes the metrics using the <tt>MetricService</tt>. It will be added
	 * to the <tt>Model</tt> the <tt>Graph</tt> object, the list of the selected
	 * friends and the the list of all the friendships.
	 * 
	 * @param model
	 *            the <tt>Model</tt> object
	 * @param request
	 *            the http request
	 * @return the friends graph page
	 */
	@RequestMapping(value = "/friendsGraph", method = RequestMethod.GET)
	public String vivagraph(Model model, HttpServletRequest request) {
		Facebook facebook = facebook(request);
		FacebookProfile user = facebook.userOperations().getUserProfile();
		List<Friendship> selectedFriendships = dao.getSelectedFriendships(user
				.getId());
		Set<FacebookProfile> selectedFriendsProfiles = new HashSet<FacebookProfile>();
		Set<String> selectedFriendsIds = new HashSet<String>();
		for (Friendship f : selectedFriendships) {
			selectedFriendsIds.add(f.getFirstId());
			selectedFriendsIds.add(f.getSecondId());
		}
		for (String f : selectedFriendsIds) {
			selectedFriendsProfiles.add(facebook.userOperations()
					.getUserProfile(f));
		}
		// Compute and set metrics
		Graph graph = mService.getGraphWithMetrics(selectedFriendsProfiles,
				selectedFriendships, user.getId());

		model.addAttribute("graph", graph);
		model.addAttribute("user", user);
		model.addAttribute("friends", selectedFriendsProfiles);
		model.addAttribute("friendships", selectedFriendships);
		return "friendsGraph";
	}

	/**
	 * Returns the user id stored in the user cookies, using a
	 * <tt>TextEncryptor</tt> for decrypting the cookie
	 * 
	 * @param request
	 *            the http request
	 * 
	 * @return the user id
	 */
	private String getUserId(HttpServletRequest request) {
		return encryptor.decrypt(userCookieGenerator.readCookieValue(request));
	}
}
