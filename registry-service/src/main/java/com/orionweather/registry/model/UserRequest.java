package com.orionweather.registry.model;

import java.io.Serializable;

public class UserRequest implements Serializable {

	private static final long serialVersionUID = 1L;

	private String userEmail;
	private String date;
	private String time;
	private String datacenter;

	public UserRequest(String userEmail, String date, String time, String datacenter) {
		this.userEmail = userEmail;
		this.date = date;
		this.time = time;
		this.datacenter = datacenter;
	}

	public UserRequest() {}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getDatacenter() {
		return datacenter;
	}

	public void setDatacenter(String datacenter) {
		this.datacenter = datacenter;
	}

	public String toString() {
		return "{\"userEmail\":\""+userEmail
				+"\",\"date\":\""+date
				+"\",\"time\":\""+time
				+"\",\"datacenter\":\""+datacenter+"\"}";
	}
}