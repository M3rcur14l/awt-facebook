package com.awt.facebook.persistence;

import java.util.Collection;
import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.SessionFactory;

public class FriendshipsDaoHibernate implements FriendshipsDao {

	private SessionFactory sessionFactory;

	public FriendshipsDaoHibernate(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Transactional
	public boolean save(Friendship friendship) {
		boolean notExist = sessionFactory
				.getCurrentSession()
				.createQuery(
						"from Friendship where createdBy = :createdBy and ( (firstId = :firstId and secondId = :secondId) or (firstId = :secondId and secondId = :firstId) )")
				.setParameter("createdBy", friendship.getCreatedBy())
				.setParameter("firstId", friendship.getFirstId())
				.setParameter("secondId", friendship.getSecondId()).list()
				.isEmpty();
		if (notExist) {
			sessionFactory.getCurrentSession().persist(friendship);
			return true;
		}
		return false;
	}

	@Transactional
	public void save(Collection<Friendship> friendships) {
		for (Friendship friendship : friendships) {
			boolean notExist = sessionFactory
					.getCurrentSession()
					.createQuery(
							"from Friendship where createdBy = :createdBy and ( firstId = :firstId and secondId = :secondId or firstId = :secondId and secondId = :firstId )")
					.setParameter("createdBy", friendship.getCreatedBy())
					.setParameter("firstId", friendship.getFirstId())
					.setParameter("secondId", friendship.getSecondId()).list()
					.isEmpty();
			if (notExist) {
				sessionFactory.getCurrentSession().persist(friendship);
			}
		}
	}

	@Transactional
	public void deleteUserFriendships(String user) {
		sessionFactory.getCurrentSession()
				.createQuery("delete Friendship where createdBy = :user")
				.setParameter("user", user).executeUpdate();
	}

	@Transactional
	public void deleteSelectedFriendships(String user) {
		sessionFactory
				.getCurrentSession()
				.createQuery(
						"delete Friendship where createdBy = :user and firstId <> :user")
				.setParameter("user", user).executeUpdate();
	}

	@Transactional
	public List<Friendship> getAll(String user) {
		return sessionFactory.getCurrentSession()
				.createQuery("from Friendship where createdBy = :user")
				.setParameter("user", user).list();
	}

	@Transactional
	public List<Friendship> getSelectedFriendships(String user) {
		return sessionFactory
				.getCurrentSession()
				.createQuery(
						"from Friendship where createdBy = :user and firstId <> :user")
				.setParameter("user", user).list();
	}

	@Transactional
	public List<Friendship> getLocalUserFriendships(String localUser) {
		return sessionFactory
				.getCurrentSession()
				.createQuery(
						"from Friendship where createdBy = :localUser and firstId = :localUser")
				.setParameter("user", localUser).list();
	}

	@Transactional
	public List<String> getUserFriendships(String localUser, String user) {
		List<String> list = sessionFactory
				.getCurrentSession()
				.createQuery(
						"select f.secondId from Friendship as f where f.createdBy = :localUser and f.firstId = :user and f.secondId <> :localUser")
				.setParameter("localUser", localUser)
				.setParameter("user", user).list();
		list.addAll(sessionFactory
				.getCurrentSession()
				.createQuery(
						"select f.firstId from Friendship as f where f.createdBy = :localUser and f.secondId = :user and f.firstId <> :localUser")
				.setParameter("localUser", localUser)
				.setParameter("user", user).list());
		return list;
	}

	@Transactional
	public boolean notExistsOpposite(String createdBy, String firstId,
			String secondId) {
		return sessionFactory
				.getCurrentSession()
				.createQuery(
						"from Friendship where createdBy = :createdBy and firstId = :secondId and secondId = :firstId")
				.setParameter("createdBy", createdBy)
				.setParameter("firstId", firstId)
				.setParameter("secondId", secondId).list().isEmpty();
	}
}
