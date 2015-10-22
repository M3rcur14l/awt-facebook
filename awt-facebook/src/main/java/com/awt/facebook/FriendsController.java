package com.awt.facebook;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookProfile;
import org.springframework.social.facebook.api.Reference;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.awt.facebook.account.UserCookieGenerator;
import com.awt.facebook.persistence.Friendship;
import com.awt.facebook.persistence.FriendshipsDao;

/**
 * This controller handles all the operation regarding the friends list, the
 * common friends selection and the common friends list pages.
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 * 
 */

@Controller
public class FriendsController {

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
	 * Not actually used, but it can be for handle the database storing
	 * operation asynchronously for increase response time
	 */
	@Inject
	SimpleAsyncTaskExecutor asyncSaveExecutor;

	/**
	 * Returns the <tt>Facebook</tt> instance by passing the user's http <tt>request</tt>
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
	 * Returns the friends list page. It retrieves the friends list of the user
	 * by using the Facebook API and it pass them to the <tt>Model</tt>
	 * 
	 * @param model
	 *            the <tt>Model</tt> object
	 * @param request
	 *            the http request
	 * @return the friends list page
	 */
	@RequestMapping(value = "/friendslist", method = RequestMethod.GET)
	public String friendList(Model model, HttpServletRequest request) {
		Facebook facebook = facebook(request);
		FacebookProfile user = facebook.userOperations().getUserProfile();
		model.addAttribute("user", user);
		List<FacebookProfile> friends = facebook.friendOperations()
				.getFriendProfiles();
		model.addAttribute("friends", friends);
		return "friendslist";
	}

	/**
	 * Returns the common friends list page. It handles the redirect of the
	 * <tt>getCommonFriends</tt> method or after a user page refresh. It passes
	 * into the <tt>Model</tt> the <tt>Facebook</tt> object and the user
	 * <tt>FacebookProfile</tt>.
	 * 
	 * @param model
	 *            the <tt>Model</tt> object
	 * @param request
	 *            the http request
	 * @return the common friends list page
	 */
	@RequestMapping(value = "/commonFriends", method = RequestMethod.GET)
	public String commonFriends(Model model, HttpServletRequest request) {
		Facebook facebook = facebook(request);
		FacebookProfile user = facebook.userOperations().getUserProfile();
		model.addAttribute("facebook", facebook.userOperations());
		model.addAttribute("user", user);
		return "commonFriends";
	}

	/**
	 * Perform a redirect to the common friends list page. After retrieving the
	 * user friends selection from the <tt>request</tt>, for all selected
	 * friends it uses the Facebook API to retrieve the common friends list and
	 * store all the friendships into the database. It also store all the
	 * friendships in a <tt>Map</tt> having as key value the user ids which will
	 * be added to the <tt>Model</tt>, together with the user selections
	 * 
	 * @param model
	 *            the <tt>Model</tt> object
	 * @param request
	 *            the http request
	 * @return a redirect to the common friends list page
	 */
	@RequestMapping(value = "/commonFriends", method = RequestMethod.POST)
	public String getCommonFriends(Model model, HttpServletRequest request) {
		Facebook facebook = facebook(request);
		FacebookProfile user = facebook.userOperations().getUserProfile();
		String localUserId = facebook.userOperations().getUserProfile().getId();
		String[] selectedFriends = request.getParameterValues("friend");
		Map<String, List<Reference>> friendsMap = new HashMap<String, List<Reference>>();
		dao.deleteSelectedFriendships(user.getId());
		List<Friendship> friendships = new ArrayList<Friendship>();
		for (String friendId : selectedFriends) {
			for (Reference mf : facebook.friendOperations().getMutualFriends(
					friendId)) {
				friendships.add(new Friendship(localUserId, friendId, mf
						.getId()));
			}
			friendsMap.put(friendId, facebook.friendOperations()
					.getMutualFriends(friendId));
		}
		dao.save(friendships);
		model.addAttribute("facebook", facebook.userOperations());
		model.addAttribute("user", user);
		request.getSession().setAttribute("selectedFriends", selectedFriends);
		request.getSession().setAttribute("friendsMap", friendsMap);
		return "redirect:/commonFriends";
	}

	/**
	 * It perform the save operation asynchronously in a different thread by
	 * using the <tt>SimpleAsyncTaskExecutor</tt>
	 * 
	 * @param friendships
	 *            the list of the friendships to be stored
	 */
	@SuppressWarnings("unused")
	private void saveTask(final List<Friendship> friendships) {

		asyncSaveExecutor.execute(new Runnable() {

			public void run() {
				dao.save(friendships);
			}
		});

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
