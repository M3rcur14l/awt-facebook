package com.awt.facebook.account;

import org.springframework.social.UserIdSource;

/**
 * Usually this class is used for retrieving a user id from a security-context.
 * As far as we identify users by reading a cookie value, we don't need this
 * class. But for some reason this is required by the Social Spring API.
 * So we created it to avoid errors, but without really using it.
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 * 
 */
public class UserId implements UserIdSource {

	public String getUserId() {
		return null;
	}

}
