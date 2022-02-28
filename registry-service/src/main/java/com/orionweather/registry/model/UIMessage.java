package com.orionweather.registry.model;

import java.io.Serializable;

public class UIMessage implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	private String sourceTag;
	private String destinationTag;
	private String data;

	public String getSourceTag() {
		return sourceTag;
	}
	public void setSourceTag(String sourceTag) {
		this.sourceTag = sourceTag;
	}
	public String getDestinationTag() {
		return destinationTag;
	}
	public void setDestinationTag(String destinationTag) {
		this.destinationTag = destinationTag;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String toString() {
		return sourceTag+";"+destinationTag+";"+data;
	}

	public UIMessage() {
	}

	public UIMessage(UIMessageBuilder builder) {
		this.sourceTag = builder.sourceTag;
		this.destinationTag = builder.destinationTag;
		this.data = builder.data;
	}

	public static class UIMessageBuilder {
		private String sourceTag;
		private String destinationTag;
		private String data;

		public UIMessageBuilder sourceTag(String sourceTag) {
			this.sourceTag = sourceTag;
			return this;
		}
		public UIMessageBuilder destinationTag(String destinationTag) {
			this.destinationTag = destinationTag;
			return this;
		}
		public UIMessageBuilder data(String data) {
			this.data = data;
			return this;
		}
		public UIMessage build() {
			return new UIMessage(this);
		}
	}

}