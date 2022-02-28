package com.orionweather.registry.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

import com.orionweather.registry.model.RegistryEntry;
import com.orionweather.registry.model.RegistryEntryRepository;
import com.orionweather.registry.model.RegistryEntryWrapper;
import com.orionweather.registry.model.RequestEntry;

@RestController
@RequestMapping(path = "/registry")
public class RegistryRestController {

	@Autowired
	RegistryEntryRepository registryRepository;

	@GetMapping(path = {"/getAll"},
			consumes = {},
			produces = {"application/json","application/xml"})
	@ResponseBody
	public ResponseEntity<RegistryEntryWrapper> readStatus() {
		return new ResponseEntity<RegistryEntryWrapper>(new RegistryEntryWrapper(registryRepository.findAll()),HttpStatus.OK);
	}

	@PostMapping(path = {"/addEntry"},
			consumes = {MediaType.APPLICATION_JSON_VALUE},
			produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_PLAIN_VALUE})
	@ResponseBody
	public ResponseEntity<RegistryEntry>  createEntry(@RequestBody RegistryEntry registryEntry) {

		System.out.println("Tjis");
		registryEntry.setEntryId(-1);
		registryRepository.save(registryEntry);
		return new ResponseEntity<RegistryEntry>(registryEntry, HttpStatus.OK);
	}

	@PostMapping(path = {"/newRequest"},
			consumes = {MediaType.APPLICATION_JSON_VALUE},
			produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_PLAIN_VALUE})
	@ResponseBody
	public ResponseEntity<Long>  addRequest(@RequestBody RequestEntry requestEntry) {

		RegistryEntry registryEntry = new RegistryEntry();
		registryEntry.setEntryId(-1);
		registryEntry.setRequestValues(requestEntry);
		registryEntry = registryRepository.save(registryEntry);
		return new ResponseEntity<Long>(registryEntry.getEntryId(), HttpStatus.OK);
	}

	@PostMapping(path = {"/plotResponse"},
			consumes = {MediaType.APPLICATION_JSON_VALUE},
			produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_PLAIN_VALUE})
	@ResponseBody
	public ResponseEntity<RegistryEntry>  plotResponse(@RequestBody RegistryEntry registryEntry) {

		RegistryEntry rE = registryRepository.findById(registryEntry.getEntryId()).get();
		rE.setPlotData(registryEntry.getPlotData());
		registryRepository.save(rE);
		return new ResponseEntity<RegistryEntry>(registryEntry, HttpStatus.OK);
	}

	@PostMapping(path = {"/ingestorResponse"},
			consumes = {MediaType.APPLICATION_JSON_VALUE},
			produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_PLAIN_VALUE})
	@ResponseBody
	public ResponseEntity<RegistryEntry> ingestorResponse(@RequestBody RegistryEntry registryEntry) {

		RegistryEntry rE = registryRepository.findById(registryEntry.getEntryId()).get();
		rE.setIngestorUri(registryEntry.getIngestorUri());
		registryRepository.save(rE);
		return new ResponseEntity<RegistryEntry>(registryEntry, HttpStatus.OK);
	}
}