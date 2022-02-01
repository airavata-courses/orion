package com.orionweather.registry.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.context.annotation.Bean;

import org.springframework.stereotype.Component;

@Component
@Entity
@Table(name = "Registry")
public class RegistryEntry {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	Long entryId;

	@Column(name = "sender_id")
	int senderId;

    @Column(name = "url")
	String url;
	// TODO: Add datetime here

	public RegistryEntry() {}
	public void setValues(RegistryEntry registryEntry) {
		this.senderId = registryEntry.getSenderId();
		this.url = registryEntry.getUrl();
	}
	public RegistryEntry(long entryId, int senderId, String url) {
		this.entryId = entryId;
		this.senderId = senderId;
		this.url = url;
	}
	public RegistryEntry(int senderId, String url) {
		this.senderId = senderId;
		this.url = url;
	}
	public long getEntryId() {
		return entryId;
	}

	public void setEntryId(long entryId) {
		this.entryId = entryId;
	}
	public int getSenderId() {
		return senderId;
	}

	public void setSenderId(int senderId) {
		this.senderId = senderId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Bean
	public RegistryEntry regEntry() {
		return new RegistryEntry();
	}
}
