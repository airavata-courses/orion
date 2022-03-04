package com.orionweather.registry.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.context.annotation.Bean;

import org.springframework.stereotype.Component;

@Component
@Entity
public class RequestEntry {

	String userEmail;
    String date;
    String time;
    String datacenter;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	Long entryId;


    public RequestEntry(String userEmail, String date, String time, String datacenter) {
        this.userEmail = userEmail;
        this.date = date;
        this.time = time;
        this.datacenter = datacenter;
    }
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

    public RequestEntry() {}
	public void setValues(RequestEntry requestEntry) {
        userEmail = requestEntry.getUserEmail();
        date = requestEntry.getDate();
        time = requestEntry.getTime();
        datacenter = requestEntry.getDatacenter();
	}

	@Bean
	public RequestEntry reqEntry() {
		return new RequestEntry();
	}
}
