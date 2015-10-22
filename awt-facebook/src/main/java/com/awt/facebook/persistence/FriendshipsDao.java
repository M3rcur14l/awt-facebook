package com.awt.facebook.persistence;

import java.util.Collection;
import java.util.List;

/**
 * The data access object of friendships used to perform all operation with the
 * database. The user of this interface has precise control of all operation of
 * storing and deletion in the friendships table.
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 */

public interface FriendshipsDao {

	/**
	 * Stores the <tt>friendship</tt> into the database. Return <tt>true</tt> if
	 * the object is not already present in the database, <tt>false</tt> in the
	 * other case
	 * 
	 * @param friendship
	 *            the friendship object to be stored
	 * @return <tt>true</tt> if the object is not already present in the
	 *         database, <tt>false</tt> in the other case
	 */
	public boolean save(Friendship friendship);

	/**
	 * For all elements of the collection, if the object is present already
	 * present in the database it will be skipped, in the other case it will be
	 * stored
	 * 
	 * @param friendships
	 *            the friendship object to be stored
	 */
	public void save(Collection<Friendship> friendships);

	/**
	 * Deletes all friendships created by the <tt>user</tt>
	 * 
	 * @param user
	 *            the user id
	 */
	public void deleteUserFriendships(String user);

	/**
	 * Deletes the last selection of friendships performed by the <tt>user</tt>
	 * 
	 * @param user
	 *            the user id
	 */
	public void deleteSelectedFriendships(String user);

	/**
	 * Returns a list of all the friendships created by the <tt>user</tt>
	 * 
	 * @param user
	 *            the user id
	 * @return a list of all the friendships created by the <tt>user</tt>
	 */
	public List<Friendship> getAll(String user);

	/**
	 * Returns the list of the last selection of friendships performed by the
	 * <tt>user</tt>
	 * 
	 * @param user
	 *            the user id
	 * @return the list of the last selection of friendships performed by the
	 *         <tt>user</tt>
	 */
	public List<Friendship> getSelectedFriendships(String user);

	/**
	 * Returns a list of all the friendships of the <tt>localUser</tt>
	 * 
	 * @param localUser
	 *            the application user's id
	 * @return a list of all the friendships of the <tt>localUser</tt>
	 */
	public List<Friendship> getLocalUserFriendships(String localUser);

	/**
	 * Returns a list of all the friend ids of the <tt>user</tt> created by
	 * the <tt>localUser</tt> session
	 * 
	 * @param localUser
	 *            the application user id
	 * @param user
	 *            the user id
	 * @return
	 */
	public List<String> getUserFriendships(String localUser, String user);
}
