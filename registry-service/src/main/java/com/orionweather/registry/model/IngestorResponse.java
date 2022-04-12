package com.orionweather.registry.model;

public class IngestorResponse {

	Long requestId;
	String[] ingestorUri;

	public IngestorResponse(Long requestId, String[] ingestorUri) {
		this.requestId = requestId;
		this.ingestorUri = ingestorUri;
	}

	public long getRequestId() {
		return requestId;
	}
	public void setRequestId(long requestId) {
		this.requestId = requestId;
	}
	public String[] getIngestorUri() {
		return ingestorUri;
	}
	public void setIngestorUri(String[] ingestorUri) {
		this.ingestorUri = ingestorUri;
	}
}
