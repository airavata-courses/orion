package com.orionweather.registry.model;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestEntryRepository extends CrudRepository<RequestEntry, Long> {
}
