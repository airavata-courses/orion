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

import com.orionweather.registry.model.RegistryEntry;
import com.orionweather.registry.model.RegistryEntryRepository;
import com.orionweather.registry.model.RegistryEntryWrapper;

@RestController
@RequestMapping(path = "/registry")
public class RegistryController {

	@Autowired
	RegistryEntryRepository registryRepository;

	@GetMapping(path = {"/status"},
			consumes = {},
			produces = {"application/json","application/xml"})
	@ResponseBody
	public ResponseEntity<RegistryEntryWrapper> readStatus() {

		System.out.println("Just reading from DB");

//		return new ResponseEntity<RegistryEntry>(new RegistryEntry(),HttpStatus.OK);
		return new ResponseEntity<RegistryEntryWrapper>(new RegistryEntryWrapper(registryRepository.findAll()),HttpStatus.OK);


	}

	@PostMapping(path = {"/status"},
			consumes = {MediaType.APPLICATION_JSON_VALUE},
			produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_PLAIN_VALUE})
	@ResponseBody
	public ResponseEntity<RegistryEntry>  writeStatus(@RequestBody RegistryEntry registryEntry) {

//		RegistryEntry rE = new RegistryEntry();
//		rE.setValues(registryEntry);
		registryRepository.save(registryEntry);
//		registryRepository.insert(rE);
//		registryEntry.setSenderId(1);
		return new ResponseEntity<RegistryEntry>(registryEntry, HttpStatus.OK);
	}


	@PostMapping(path = {"/stormdetection"},
			consumes = {"application/json"},
			produces = {"application/json", "application/xml"})
	@ResponseBody
	public String stormDetection() {

		return "Storm Detection";
	}
}
