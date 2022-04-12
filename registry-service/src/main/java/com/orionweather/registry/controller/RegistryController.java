package com.orionweather.registry.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.orionweather.registry.model.IngestorResponse;
import com.orionweather.registry.model.PlotterResponse;
import com.orionweather.registry.model.RegistryEntry;
import com.orionweather.registry.model.RegistryEntry.RegistryEntryBuilder;
import com.orionweather.registry.model.RegistryEntryRepository;
import com.orionweather.registry.model.RequestEntry;
import com.orionweather.registry.model.UserRequest;

@Controller
public class RegistryController {

	@Autowired
	RegistryEntryRepository registryRepository;

	public Iterable<RegistryEntry> readStatusHandler() {
		return registryRepository.findAll();
	}

	public RegistryEntry createEntryHandler(RegistryEntry registryEntry) {
		registryEntry.setEntryId(-1);
		registryRepository.save(registryEntry);
		return registryEntry;
	}

	public long addRequestHandler(RequestEntry requestEntry) {
		RegistryEntry registryEntry = new RegistryEntry();
		registryEntry.setEntryId(-1);
		registryEntry.setRequestValues(requestEntry);
		registryEntry = registryRepository.save(registryEntry);
		return registryEntry.getEntryId();
	}

	public long addRequestHandler(UserRequest requestEntry) {
		RegistryEntry registryEntry = new RegistryEntryBuilder()
				.entryId((long) -1).userRequest(requestEntry).build();
		registryEntry = registryRepository.save(registryEntry);
		return registryEntry.getEntryId();
	}

	public RegistryEntry plotterResponseHandler(PlotterResponse plotterResponse) {
		RegistryEntry rE = registryRepository.findById(plotterResponse.getRequestId()).get();
		rE.setPlotData(plotterResponse.getPlotData());
		registryRepository.save(rE);
		return rE;
	}

	public RegistryEntry ingestorResponseHandler(IngestorResponse ingestorResponse) {
		RegistryEntry rE = registryRepository.findById(ingestorResponse.getRequestId()).get();
		rE.setIngestorUri(ingestorResponse.getIngestorUri());
		registryRepository.save(rE);
		return rE;
	}
}