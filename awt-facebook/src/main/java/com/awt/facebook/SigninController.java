package com.awt.facebook;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookProfile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.awt.facebook.account.UserCookieGenerator;
import com.awt.facebook.persistence.FriendshipsDao;

@Controller
public class SigninController {

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
	 * Returns a <tt>Facebook</tt> instance by passing the user's http
	 * <tt>request</tt> . First it gets the user id with the <tt>getUserId</tt>
	 * method, then it uses the <tt>UsersConnectionRepository</tt> for
	 * retrieving the user connection from the database
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
	 * Return the main page after a user sign-in. It passes to the
	 * <tt>Model</tt> the user <tt>FacebookProfile</tt> and the user friends
	 * count
	 * 
	 * @param model
	 *            the <tt>Model</tt> object
	 * @param request
	 *            the http request
	 * @return the signed-in page
	 */
	@RequestMapping(value = "/signin", method = RequestMethod.GET)
	public String signin(Model model, HttpServletRequest request) {
		Facebook facebook = facebook(request);
		FacebookProfile user = facebook.userOperations().getUserProfile();
		int friendCount = facebook.friendOperations().getFriends().size();
		model.addAttribute("user", user);
		model.addAttribute("friendCount", friendCount);
		return "signin";
	}

	/**
	 * Return the home page after a user sign-out. It uses the
	 * <tt>UsersConnectionRepository</tt> for deleting the connection of the
	 * user for the database, the <tt>UserCookieGenerator</tt> for removing the
	 * user cookie and the <tt>FriendshipsDao</tt> for deleting all the
	 * friendships created by the user into the database
	 * 
	 * @param model
	 *            the <tt>Model</tt> object
	 * @param request
	 *            the http request
	 * @param response
	 *            the http response
	 * @return the home page
	 */
	@RequestMapping(value = "/signout", method = RequestMethod.GET)
	public String signout(Model model, HttpServletRequest request,
			HttpServletResponse response) {
		String userId = getUserId(request);
		connectionRepository.createConnectionRepository(userId)
				.removeConnections("facebook");
		dao.deleteUserFriendships(userId);
		userCookieGenerator.removeCookie(response);
		return "home";
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
