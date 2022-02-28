package com.orionweather.registry.model;

public class PlotterResponse {

	Long requestId;
	byte[][] plotData;

	public PlotterResponse(Long requestId, byte[][] plotData) {
		this.requestId = requestId;
		this.plotData = plotData;
	}

	public long getRequestId() {
		return requestId;
	}
	public void setRequestId(long requestId) {
		this.requestId = requestId;
	}
	public byte[][] getPlotData() {
		return plotData;
	}
	public void setPlotData(byte[][] plotData) {
		this.plotData = plotData;
	}
}