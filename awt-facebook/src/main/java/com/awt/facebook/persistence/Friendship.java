package com.awt.facebook.persistence;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * The friendship entity class. It has three attributes: <tt>createdBy</tt> is
 * the id of the user that has created the friendship; <tt>firstId</tt> and
 * <tt>secondId</tt> are the ids used for identifying the friendship relation.
 * In the application two <tt>Friendship</tt> with the <tt>firstId</tt> and
 * <tt>secondId</tt> attributes swapped are considered equals.
 * 
 * @author Antonello Fodde
 * @author Chai Botta
 */
@Entity
@Table(name = "friendships")
public class Friendship implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "createdBy")
	private String createdBy;
	@Id
	@Column(name = "firstId")
	private String firstId;
	@Id
	@Column(name = "secondId")
	private String secondId;

	public Friendship() {
	}

	public Friendship(String createdBy, String firstId, String secondId) {
		super();
		this.createdBy = createdBy;
		this.firstId = firstId;
		this.secondId = secondId;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getFirstId() {
		return firstId;
	}

	public void setFirstId(String firstId) {
		this.firstId = firstId;
	}

	public String getSecondId() {
		return secondId;
	}

	public void setSecondId(String secondId) {
		this.secondId = secondId;
	}

}
