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

	public RegistryEntry(RegistryEntryBuilder reb) {
		this.entryId = reb.entryId;
		this.ingestorUri = reb.ingestorUri;
		this.plotData = reb.plotData;
		this.requestBody = reb.requestBody;
		this.requestTime = reb.requestTime;
		this.userEmail = reb.userEmail;
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
	}

	public void setValues(RegistryEntry registryEntry) {
		this.userEmail = registryEntry.getUserEmail();
		this.requestBody = registryEntry.getRequestBody();
		this.requestTime = registryEntry.getRequestTime();
		this.plotData = registryEntry.getPlotData();
	}

	public static class RegistryEntryBuilder {
		private String userEmail;
		private String requestBody;

		private String requestTime;
		private String[] ingestorUri;
		private byte[][] plotData;
		private Long entryId;

		public RegistryEntryBuilder userEmail(String userEmail) {
			this.userEmail = userEmail;
			return this;
		}

		public RegistryEntryBuilder requestBody(String requestBody) {
			this.requestBody = requestBody;
			return this;
		}

		public RegistryEntryBuilder requestTime(String requestTime) {
			this.requestTime = requestTime;
			return this;
		}

		public RegistryEntryBuilder ingestorUri(String[] ingestorUri) {
			this.ingestorUri = ingestorUri;
			return this;
		}

		public RegistryEntryBuilder plotData(byte[][] plotData) {
			this.plotData = plotData;
			return this;
		}

		public RegistryEntryBuilder entryId(Long entryId) {
			this.entryId = entryId;
			return this;
		}

		public RegistryEntryBuilder userRequest(UserRequest userRequest) {
			this.userEmail = userRequest.getUserEmail();

			ObjectMapper objMap = new ObjectMapper();
			try {
				this.requestBody = objMap.writeValueAsString(userRequest);
			} catch(Exception e) {
				this.requestBody = "";
			}
			this.requestTime = new Date(System.currentTimeMillis()).toString();
			return this;
		}

		public RegistryEntry build() {
			return new RegistryEntry(this);
		}
	}
}
