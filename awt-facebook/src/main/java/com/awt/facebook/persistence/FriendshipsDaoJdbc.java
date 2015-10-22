package com.awt.facebook.persistence;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;

public class FriendshipsDaoJdbc implements FriendshipsDao {

	private final JdbcTemplate jdbcTemplate;

	public FriendshipsDaoJdbc(DataSource dataSource) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
	}

	public boolean save(Friendship friendship) {
		String existsQuery = "select * from friendships where createdBy = ? and (firstId = ? and secondId = ? or firstId = ? and secondId = ?)";
		String saveQuery = "insert into friendships (createdBy, firstId, secondId) values (?, ?, ?)";
		boolean notExists = jdbcTemplate.queryForList(
				existsQuery,
				new Object[] { friendship.getCreatedBy(),
						friendship.getFirstId(), friendship.getSecondId(),
						friendship.getSecondId(), friendship.getFirstId() })
				.isEmpty();
		if (notExists) {
			jdbcTemplate
					.update(saveQuery, new Object[] {
							friendship.getCreatedBy(), friendship.getFirstId(),
							friendship.getSecondId() });
			return true;
		}
		return false;
	}

	public void save(Collection<Friendship> friendships) {
		String existsQuery = "select * from friendships where createdBy = ? and (firstId = ? and secondId = ? or firstId = ? and secondId = ?)";
		String saveQuery = "insert into friendships (createdBy, firstId, secondId) values (?, ?, ?)";
		for (Friendship friendship : friendships) {
			boolean notExists = jdbcTemplate
					.queryForList(
							existsQuery,
							new Object[] { friendship.getCreatedBy(),
									friendship.getFirstId(),
									friendship.getSecondId(),
									friendship.getSecondId(),
									friendship.getFirstId() }).isEmpty();
			if (notExists) {
				jdbcTemplate.update(
						saveQuery,
						new Object[] { friendship.getCreatedBy(),
								friendship.getFirstId(),
								friendship.getSecondId() });
			}
		}
	}

	public void deleteUserFriendships(String user) {
		String sql = "delete from friendships where createdBy = ?";
		jdbcTemplate.update(sql, new Object[] { user });
	}

	public void deleteSelectedFriendships(String user) {
		String sql = "delete from friendships where createdBy = ? and firstId <> ?";
		jdbcTemplate.update(sql, new Object[] { user, user });
	}

	public List<Friendship> getAll(String user) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<Friendship> getSelectedFriendships(String user) {
		String sql = "select * from friendships where createdBy = ? and firstId <> ?";
		return jdbcTemplate.query(sql, new Object[] { user, user },
				new FriendshipRowMapper());
	}

	public List<Friendship> getLocalUserFriendships(String localUser) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<String> getUserFriendships(String localUser, String user) {
		String sql1 = "select secondId from friendships where createdBy = ? and firstId = ? and secondId <> ?";
		String sql2 = "select firstId from friendships where createdBy = ? and secondId = ? and firstId <> ?";
		List<String> list = new ArrayList<String>();
		List<Map<String, Object>> rows1 = jdbcTemplate.queryForList(sql1,
				new Object[] { localUser, user, localUser });
		for (Map<String, Object> row : rows1) {
			list.add((String) row.get("secondId"));
		}
		List<Map<String, Object>> rows2 = jdbcTemplate.queryForList(sql2,
				new Object[] { localUser, user, localUser });
		for (Map<String, Object> row : rows2) {
			list.add((String) row.get("firstId"));
		}
		return list;
	}

}
