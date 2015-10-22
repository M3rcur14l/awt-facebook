package com.awt.facebook.persistence;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

/**
 * The <tt>RowMapper</tt> used by the <tt>FriendshipsDaoJdbc</tt> object for
 * mapping the query results
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 */

public class FriendshipRowMapper implements RowMapper<Friendship> {

	public Friendship mapRow(ResultSet rs, int rowNum) throws SQLException {
		Friendship friendship = new Friendship();
		friendship.setCreatedBy(rs.getString("createdBy"));
		friendship.setFirstId(rs.getString("firstId"));
		friendship.setSecondId(rs.getString("secondId"));
		return friendship;
	}

}
