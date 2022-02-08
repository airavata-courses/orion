package com.orionweather.registry.model;

import java.sql.Blob;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.context.annotation.Bean;

import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "Registry")
public class RegistryEntry {

	@Column(name = "user_email")
	String userEmail;

	@Column(name = "request_body")
	String requestBody;

	@Column(name = "request_time")
	String requestTime;

	@Column(name = "ingestor_uri")
	String[] ingestorUri;

	@Column(name = "plot_data")
	@Lob
	byte[][] plotData;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	Long entryId;

	public RegistryEntry() {}
	
	public RegistryEntry(long entryId, String userEmail, String requestBody, String requestTime, String[] ingestorUri, byte[][] plotData) {
		this.entryId = entryId;
		this.userEmail = userEmail;
		this.requestBody = requestBody;
		this.requestTime = requestTime;
		this.ingestorUri = ingestorUri;
		this.plotData = plotData;
	}
	public RegistryEntry(String userEmail, String requestBody, String requestTime, String[] ingestorUri, byte[][] plotData) {
		this.userEmail = userEmail;
		this.requestBody = requestBody;
		this.requestTime = requestTime;
		this.ingestorUri = ingestorUri;
		this.plotData = plotData;
	}
	public long getEntryId() {
		return entryId;
	}
	public void setEntryId(long entryId) {
		this.entryId = entryId;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public String[] getIngestorUri() {
		return ingestorUri;
	}
	public void setIngestorUri(String[] ingestorUri) {
		this.ingestorUri = ingestorUri;
	}
	public String getRequestBody() {
		return requestBody;
	}
	public void setRequestBody(String requestBody) {
		this.requestBody = requestBody;
	}
	public String getRequestTime() {
		return requestTime;
	}
	public void setRequestTime(String requestTime) {
		this.requestTime = requestTime;
	}
	public byte[][] getPlotData() {
		return plotData;
	}
	public void setPlotData(byte[][] plotData) {
		this.plotData = plotData;
	}

	public void setRequestValues(RequestEntry requestEntry) {
		this.userEmail = requestEntry.getUserEmail();

		ObjectMapper objMap = new ObjectMapper();
		try {
			this.requestBody = objMap.writeValueAsString(requestEntry);
		} catch(Exception e) {
			this.requestBody = "";
		}
		this.requestTime = new Date(System.currentTimeMillis()).toString();
		// Not sure how Blob gets written
		// this.plotData = ;
	}

	public void setValues(RegistryEntry registryEntry) {
		this.userEmail = registryEntry.getUserEmail();
		this.requestBody = registryEntry.getRequestBody();
		this.requestTime = registryEntry.getRequestTime();
		this.plotData = registryEntry.getPlotData();
	}
}
