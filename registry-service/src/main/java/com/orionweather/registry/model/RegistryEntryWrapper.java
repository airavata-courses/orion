package com.orionweather.registry.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class RegistryEntryWrapper {

	private List<RegistryEntry> registryEntryList;

	public RegistryEntryWrapper() {

	}

	public RegistryEntryWrapper(List<RegistryEntry> registryEntryList) {
		this.registryEntryList = registryEntryList;
	}

	public RegistryEntryWrapper(Iterable<RegistryEntry> iterable) {
		this.registryEntryList = new ArrayList<RegistryEntry>();
		for(RegistryEntry iter: iterable) {
			registryEntryList.add(iter);
		}
	}
	public void setRegistryEntryList(List<RegistryEntry> registryEntryList) {
		this.registryEntryList = registryEntryList;
	}

	public List<RegistryEntry> getRegistryEntryList() {
		return registryEntryList;
	}
}
