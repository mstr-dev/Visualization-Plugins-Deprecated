package com.microstrategy.sdk.transform;

import com.microstrategy.web.app.tasks.architect.json.JSONObject;

public class SomeObject {
	private JSONObject jsonObject;
	private int currentElement;
	private int currentRow;

	public SomeObject(int currentElement, int currentRow) {
		this.setCurrentElement(currentElement);
		this.setCurrentRow(currentRow);
	}

	public void setJsonObject(JSONObject jsonObject) {
		this.jsonObject = jsonObject;
	}

	public JSONObject getJsonObject() {
		return this.jsonObject;
	}

	public int getCurrentElement() {
		return currentElement;
	}

	public void setCurrentElement(int currentElement) {
		this.currentElement = currentElement;
	}

	public int getCurrentRow() {
		return currentRow;
	}

	public void setCurrentRow(int currentRow) {
		this.currentRow = currentRow;
	}

}