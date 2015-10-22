package com.awt.facebook.account;

import javax.inject.Inject;

import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionSignUp;
import org.springframework.social.facebook.api.Facebook;

/**
 * This class is used for specifying the identifier of the user that will be
 * used for the creation of the persistent connection into the database. Usually
 * this is used for wiring the application user id with the connection. As far
 * as we avoid user registration in our application, we simply use the user
 * Facebook id.
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 * 
 */
public final class SimpleConnectionSignUp implements ConnectionSignUp {

	/**
	 * The encryptor used to encrypt the user id
	 */
	@Inject
	private TextEncryptor encryptor;

	public String execute(Connection<?> connection) {
		Facebook facebook = (Facebook) connection.getApi();
		String userId = facebook.userOperations().getUserProfile().getId();
		return encryptor.encrypt(userId);
	}

}
