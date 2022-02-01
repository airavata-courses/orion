package com.orionweather.registry.model;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface RegistryEntryRepository extends CrudRepository<RegistryEntry, Long> {


	@Query("select e from RegistryEntry e where e.senderId = :senderId")
	List<RegistryEntry> findBySenderId(int senderId);
}
