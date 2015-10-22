package com.awt.facebook.account;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.web.SignInAdapter;
import org.springframework.web.context.request.NativeWebRequest;

/**
 * This class is used for the application user sign-in. Usually this is used for
 * register the used in a security-context. As far as we avoid user registration
 * in our application, we simply set a cookie using the
 * <tt>UserCookieGenerator</tt> object with the user Facebook id. Obviously, for
 * security reasons, we encrypt this value using a <tt>TextEncryptor</tt>. This
 * value will be used for identify different users.
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 * 
 */
public class SimpleSignInAdapter implements SignInAdapter {

	/**
	 * The encryptor used to encrypt the user id cookie
	 */
	@Inject
	private TextEncryptor encryptor;
	
	/**
	 * The object for accessing the user's cookies
	 */
	private final UserCookieGenerator userCookieGenerator = new UserCookieGenerator();

	public String signIn(String localUserId, Connection<?> connection,
			NativeWebRequest request) {
		String encryptedLocalUserId = encryptor.encrypt(localUserId);
		userCookieGenerator.addCookie(encryptedLocalUserId,
				request.getNativeResponse(HttpServletResponse.class));
		return "/signin";
	}
}
