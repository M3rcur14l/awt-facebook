package com.awt.facebook.account;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionFactory;
import org.springframework.social.connect.web.ProviderSignInInterceptor;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.Reference;
import org.springframework.util.MultiValueMap;
import org.springframework.web.context.request.WebRequest;

import com.awt.facebook.persistence.Friendship;
import com.awt.facebook.persistence.FriendshipsDao;

/**
 * This interceptor handles the database friendships storing operation after a user sign-in operation.
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 *
 */
public class FriendshipsInterceptor implements
		ProviderSignInInterceptor<Facebook> {

	/**
	 * The friendships data access object
	 */
	@Inject
	private FriendshipsDao dao;

	public void preSignIn(ConnectionFactory<Facebook> connectionFactory,
			MultiValueMap<String, String> parameters, WebRequest request) {
		return;
	}
	
	public void postSignIn(Connection<Facebook> connection, WebRequest request) {
		Facebook facebook = (Facebook) connection.getApi();
		String localUserId = facebook.userOperations().getUserProfile().getId();
		List<Reference> friends = facebook.friendOperations().getFriends();
		List<Friendship> friendships = new ArrayList<Friendship>();
		for (Reference f : friends) {
			friendships.add(new Friendship(localUserId, localUserId, f.getId()));
		}
		dao.save(friendships);
		return;
	}
}
