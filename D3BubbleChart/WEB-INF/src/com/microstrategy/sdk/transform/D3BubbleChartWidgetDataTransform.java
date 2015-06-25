package com.microstrategy.sdk.transform;

import com.microstrategy.utils.StringUtils;
import com.microstrategy.web.app.beans.AppContext;
import com.microstrategy.web.app.tasks.architect.json.JSONArray;
import com.microstrategy.web.app.tasks.architect.json.JSONException;
import com.microstrategy.web.app.tasks.architect.json.JSONObject;
import com.microstrategy.web.app.transforms.AbstractBasicReportTransform;
import com.microstrategy.web.beans.BeanContext;
import com.microstrategy.web.beans.MarkupOutput;
import com.microstrategy.web.blocks.Block;
import com.microstrategy.web.blocks.BlockContext;
import com.microstrategy.web.blocks.BlockFactory;
import com.microstrategy.web.blocks.BlockProperty;
import com.microstrategy.web.blocks.EnumBlockPropertyTypes;
import com.microstrategy.web.blocks.renderers.JsonRenderer;
import com.microstrategy.web.objects.WebGridRows;
import com.microstrategy.web.objects.WebHeader;
import com.microstrategy.web.objects.WebObjectsException;
import com.microstrategy.web.transform.FormalParameter;
import com.microstrategy.web.transform.FormalParameterAnnotation;


public class D3BubbleChartWidgetDataTransform extends AbstractBasicReportTransform {
		/**
		 * Main method which will set parameters with their values returned back to client
		 * 
		 * @param gridBlock
		 */
		public void populateGridBlock(Block gridBlock) {
			String reportData = getDataAsJsonString();
			// Those properties will be accessible in javascript from model object:
			BlockProperty prop = gridBlock.setOrCreateProperty("data", EnumBlockPropertyTypes.PROPTYPE_STRING, reportData);
			if (reportData != null) {
				// below line will format string as JSON and not as String so JavaScript can use value as object immediately
				prop.getAnnotationGroups(true).getGroup(JsonRenderer.PROPERTY_ANNOTATION_GROUP, true).getAnnotation(JsonRenderer.PROPERTY_ANNOTATION_EXPRESSION, true).setValue("true");
			}
		}

		/**
		 * Generates report data as JSON JSON is constructed to populate google.visualization.DataTable() as described in https://developers.google.com/chart/interactive/docs/reference#DataTable
		 * 
		 * @return JSON with report data
		 */
		private String getDataAsJsonString() {
			JSONObject obj = new JSONObject();
			try {
				obj = renderReportDataAsJSON();
			} catch (WebObjectsException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return obj.toString();
		}

		/**
		 * Gets data set name as set on document
		 * 
		 * @return name
		 * @throws IllegalArgumentException
		 * @throws WebObjectsException
		 * @throws JSONException
		 */
		
		private SomeObject processChildren(WebGridRows rows, String name, boolean hasChildren, SomeObject currentObject) throws JSONException {
			int currentRow = currentObject.getCurrentRow();
			int currentElement = currentObject.getCurrentElement();
			JSONObject child = new JSONObject();
			if (StringUtils.isNotEmpty(name)) {
				child.put("name", name);
				JSONArray children = new JSONArray();
				while (currentRow < rows.size()) {
					hasChildren = (currentElement + 1) < rows.get(currentRow).getHeaderElements().size();
					SomeObject object = processChildren(rows, null, hasChildren, currentObject);
					currentObject.setCurrentRow(object.getCurrentRow());
					currentRow = object.getCurrentRow();
					currentObject.setCurrentElement(currentElement);
					children.put(object.getJsonObject());
				}
				child.put("children", children);
			} else {
				WebHeader webHeader = rows.get(currentRow).getHeaderElements().get(currentElement);
				child.put("name", webHeader.getDisplayName());
				if (!hasChildren) {
					child.put("size", Double.valueOf(rows.get(currentRow).get(0).getRawValue()));
					currentObject.setCurrentRow(currentRow++);
				} else {
					JSONArray children = new JSONArray();
					boolean doneProcessingChildren = false;
					while (!doneProcessingChildren) {
						hasChildren = (currentElement + 1) < (rows.get(currentRow).getHeaderElements().size() - 1);
						currentObject.setCurrentElement(currentElement + 1);
						currentObject.setCurrentRow(currentRow);
						SomeObject object = processChildren(rows, null, hasChildren, currentObject);
						children.put(object.getJsonObject());
						if (object.getCurrentRow() >= rows.size() || !webHeader.getDisplayName().equals(rows.get(object.getCurrentRow()).getHeaderElements().get(currentElement).getDisplayName())) {
							doneProcessingChildren = true;
						}
						currentRow = object.getCurrentRow();
					}
					child.put("children", children);
				}
			}
			currentObject.setCurrentRow(currentRow);
			currentObject.setJsonObject(child);
			return currentObject;
		}

		
		
		private JSONObject renderReportDataAsJSON() throws WebObjectsException, IllegalArgumentException, JSONException {
			
			JSONObject result = new JSONObject();
			try{
				String rootName = getWebReportGrid().getColumnTitles().get(0).getWebElements().get(0).getDisplayName();
				
				result = processChildren(getWebReportGrid().getGridRows(), rootName, true, new SomeObject(0, 0)).getJsonObject();
			}
			catch (Exception e){
				e.printStackTrace();
			}
			return result;
			
		}

		@Override
		public String getDescription() {
			return "Transform to render data for Mojo visualization";
		}

		/**
		 * Everything below can be removed if upcoming version
		 */
		private FormalParameter contentTypeParam;
		static final String FP_NAME_CONTENT_TYPE = "contentType";

		public D3BubbleChartWidgetDataTransform() {
			// Initialize the content type formal parameter...
			contentTypeParam = addFormalParameter(FP_NAME_CONTENT_TYPE, FormalParameter.PARAM_TYPE_STRING, "json", "The type of Content generated by the Blocks");
			// Indicate it is usable...
			setAnnotation(contentTypeParam, FormalParameterAnnotation.USABLE);
		}

		@Override
		protected void render(MarkupOutput out) {
			try {
				prepareMarkupOutput(out);
				Block gridBlock = BlockFactory.getInstance().newBlock("GridModel");
				populateGridBlock(gridBlock);
				out.addBlock(gridBlock);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		private void prepareMarkupOutput(MarkupOutput out) {
			// Get the AppContext...
			AppContext appContext = getAppContext();
			// Create a new BlockContext object...
			BlockContext blockContext = new BlockContext(appContext);
			// Did the caller specify a content type?
			if (contentTypeParam.getValue() != null) {
				// Set it on the BlockContext so that the MarkupOutput can generate
				// its output...
				blockContext.setUnconditionalContentType(contentTypeParam.getValue().toString());
			}
			// Associate the BlockContext with the MarkupOuptut...
			out.setBlockContext(blockContext);
		}

		protected AppContext getAppContext() {
			AppContext __result = null;
			if (_bean != null) {
				BeanContext bc = _bean.getBeanContext();

				if (bc != null && bc instanceof AppContext) {
					__result = (AppContext) bc;
				}
			}
			return __result;
		}

	}

