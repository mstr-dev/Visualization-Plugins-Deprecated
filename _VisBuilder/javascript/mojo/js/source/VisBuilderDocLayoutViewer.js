(function () {

    /**
     * Overwrites mstrmojo.vi.ui.rw.DocLayoutViewer
     * adds new pane for code editor
     * changes properties pane to new one
     * no saving of document
     */
    mstrmojo.requiresCls("mstrmojo.Container",
        "mstrmojo.vi.ui._HasBoxLayout",
        "mstrmojo.vi._MonitorsAppState",
        "mstrmojo.vi.ui.BoxPanelContainer",
        "mstrmojo.vi.ui.BoxPanel",
        "mstrmojo.vi.ui.VisualizationEditor",
        "mstrmojo.vi.ui.VIBoxPropertyEditor",
        "mstrmojo.models.FormatModel",
        "mstrmojo.vi.ui.rw._SavesChildPositions",
        "mstrmojo.vi.models.VIComponentMap",
        "mstrmojo.DocDataService",
        "mstrmojo.boxmodel",
        "mstrmojo.dom",
        "mstrmojo.array",
        "mstrmojo.func",
        "mstrmojo.hash",
        "mstrmojo.vi.models.EnumPanelTypes",
        "mstrmojo.vi.ui.rw.DocLayoutViewer",
        "mstrmojo.plugins._VisBuilder.VisBuilderVIBoxCodeEditor",
        "mstrmojo.plugins._VisBuilder.VisBuilderVIBoxPropertiesEditor");

    var MARGIN = 8,
        $ARR = mstrmojo.array,
        $BOX = mstrmojo.boxmodel,
        $DOM = mstrmojo.dom,
        $HASH = mstrmojo.hash,
        $FORMAT_MODEL = mstrmojo.models.FormatModel,
        $GET_FORMAT_OBJ = $FORMAT_MODEL.getFormatUpdate,
        $ENUM_FORMAT_PROPERTIES = $FORMAT_MODEL.ENUM_PROPERTY_NAMES,
        LAYOUT_ID = 'layout',
        BOX_CHILD_TYPE = 'c',
        $COMPONENT_TYPES = mstrmojo.vi.models.VIComponentMap.TYPES,
        PANEL_TYPES = mstrmojo.vi.ui.BoxPanel.PANEL_TYPES,
        VI_DROP_ZONES = PANEL_TYPES.DROP_ZONES,
        VI_PROPERTIES = PANEL_TYPES.PROPS,
        VI_FILTERS = PANEL_TYPES.FILTERS,
        VI_CODE_EDITOR = "vi_ceditor",
        SUPPRESS_DATA = mstrmojo.DocDataService.SUPPRESS_DATA,
        $ENUM_PANEL_TYPES = mstrmojo.vi.models.EnumPanelTypes;

    /**
     * The collection of all panel items.
     *
     * @type {Object.<number, {n: string, cls: string, id: mstrmojo.vi.ui.BoxPanel.PANEL_TYPES}>}
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     */
    var PANEL_ITEMS = {};
    PANEL_ITEMS[VI_CODE_EDITOR] = {
        n: ('Code editor'),
        cls: 'cedt',
        id: VI_CODE_EDITOR
    };
    PANEL_ITEMS[VI_DROP_ZONES] = {
        n: mstrmojo.desc(11312, 'Editor'),
        cls: 'edt',
        id: VI_DROP_ZONES
    };

    PANEL_ITEMS[VI_PROPERTIES] = {
        n: mstrmojo.desc(7558, 'Properties'),
        cls: 'prp',
        id: VI_PROPERTIES
    };

    PANEL_ITEMS[VI_FILTERS] = {
        n: mstrmojo.desc(6189, 'Filter'),
        cls: 'flt',
        id: VI_FILTERS
    };

    /**
     * Converts the supplied panel type string to the appropriate integer id.
     *
     * @param {string} type The panel type.
     *
     * @returns {mstrmojo.vi.ui.BoxPanel.PANEL_TYPES}
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     * @static
     */
    function getPanelKeyFromType(type) {
        // Is this the filter panel?
        if (type === 'filterPanel') {
            // Return filter panel
            return VI_FILTERS;
        }

        // Return either editor or properties id.
        return type === 'editPanel' ? VI_DROP_ZONES : VI_PROPERTIES;
    }

    /**
     * Returns the tab info from the drag context (or undefined if not present).
     *
     * @param {Object} context The drag context.
     *
     * @returns {mstrmojo.vi.ui.IconTabList.TabInfoType|null}
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     */
    function getTabInfo(context) {
        return context.src.data.tabInfo;
    }

    /**
     * Adds box child keys to boxes.
     *
     * @param {mstrmojo.vi.ui.BoxLayoutType} box The box whose key should be added.
     *
     * @returns {mstrmojo.vi.ui.BoxLayoutType}
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     */
    function updateBoxKey(box) {
        // Is this a child?
        if (box.t === BOX_CHILD_TYPE) {
            // Add the key to the identifier.
            box.k = mstrmojo.all[box.id].getIdentifier();

        } else {
            // Iterate children and...
            $ARR.forEach(box.children, function (child) {
                // convert them.
                updateBoxKey(child);
            });
        }

        return box;
    }

    /**
     * Returns a component from the VIMap on the {@link mstrmojo.vi.ui.DocBuilder}.
     *
     * @param {mstrmojo.DocModel} model The document model.
     * @param {mstrmojo.vi.ui.DocBuilder} builder The document builder.
     * @param {mstrmojo.vi.models.VIComponentMap.TYPES} type The component type
     *
     * @returns {mstrmojo.Widget}
     * @private
     */
    function getComponent(model, builder, type) {
        return /** @type {mstrmojo.Widget} **/ builder.getLayoutVIMap(model.getCurrentLayoutKey()).getComponent(type);
    }

    /**
     * Returns the filter stack for the current layout from the builder.
     *
     * @param {mstrmojo.DocModel} model The document model.
     * @param {mstrmojo.vi.ui.DocBuilder} builder The document builder.
     *
     * @returns {mstrmojo.vi.ui.rw.FilterPanelStack|undefined}
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     * @static
     */
    function getFilterStack(model, builder) {
        return /** @type {mstrmojo.vi.ui.rw.FilterPanelStack} **/ getComponent(model, builder, $COMPONENT_TYPES.FILTER_STACK);
    }

    /**
     * Returns the {@link mstrmojo.vi.ui.BoxPanel} for the supplied item.
     *
     * @param {{id: string}} item The panel item.
     * @param {mstrmojo.DocModel} model The document model.
     * @param {mstrmojo.vi.ui.DocBuilder} builder The document builder.
     *
     * @returns {mstrmojo.vi.ui.BoxPanel|null}
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     */
    function createPanelEditor(item, model, builder) {
        var itemId = item.id,
            props = {
                model: model,
                viPanelType: itemId,
                layoutKey: model.currlaykey
            };

        switch (itemId) {
        case VI_DROP_ZONES:
            // Return new instance.
            return new mstrmojo.vi.ui.VisualizationEditor(props);

        case VI_PROPERTIES:
            // Return new instance.
            return new mstrmojo.plugins._VisBuilder.VisBuilderVIBoxPropertiesEditor(props);
            //return new mstrmojo.vi.ui.VIBoxPropertyEditor(props);
        case  VI_CODE_EDITOR:
            return new mstrmojo.plugins._VisBuilder.VisBuilderVIBoxCodeEditor(props);
        default:
            // Get filter stack from document builder.
            var filterStack = getFilterStack(model, builder);
            if (filterStack) {
                // Add viPanelType.
                filterStack.viPanelType = itemId;

                // Return filter stack.
                return filterStack;
            }

            // Filter stack not found.
            return null;
        }
    }

    /**
     * Recursively iterates the {@link mstrmojo.vi.ui.BoxLayoutConfig} to generate the necessary instances of {@link mstrmojo.vi.ui.BoxPanelContainer}.
     *
     * @param {mstrmojo.vi.ui.BoxLayoutType} box The box to iterate.
     * @param {mstrmojo.DocModel} model The document model.
     * @param {mstrmojo.vi.ui.DocBuilder} builder The document builder.
     * @param {mstrmojo.vi.ui.rw.DocLayout} docLayout The document layout.
     *
     * @returns {Array.<mstrmojo.vi.ui.BoxPanelContainer>}
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     */
    function createPanelContainers(box, model, builder, docLayout) {
        // Is this a child?
        if (box.t === BOX_CHILD_TYPE) {
            // Is this the layout?
            var key = box.k;
            if (key === LAYOUT_ID) {
                // Add id from layout.
                box.id = docLayout.id;
            } else {
                if (key.indexOf(VI_CODE_EDITOR) === -1) {
                    key = VI_CODE_EDITOR + "|" + key;
                }
                // Create panel container.
                var panelContainer = new mstrmojo.vi.ui.BoxPanelContainer({
                    model: model
                });

                // Get id from newly created panel container.
                box.id = panelContainer.id;

                // Iterate keys.
                key.split('|').forEach(function (panelKey, idx) {
                    var selectedPosition = panelKey.length - 1,
                        isSelected = panelKey.charAt(selectedPosition) === '*';

                    // Is this panel selected (true if it has an asterisk)?
                    if (isSelected) {
                        // Strip asterisk from panel key.
                        panelKey = panelKey.substr(0, selectedPosition);
                    }

                    // Get panel item.
                    var panelItem = PANEL_ITEMS[panelKey],
                        panelEditor = createPanelEditor(panelItem, model, builder);

                    // Was the panel editor created?
                    if (panelEditor) {
                        // Set panel open status.
                        panelEditor.setOpenStatus(true, true, null);

                        // Add panel for panel item.
                        panelContainer.addPanel(panelItem, panelEditor, idx, panelKey.indexOf(VI_CODE_EDITOR) > -1);
                    }

                });

                // Return array of panel containers.
                return [ panelContainer ];
            }

        } else {
            // Create collection for panel containers.
            var panelContainers = [];

            // Iterate box children and...
            $ARR.forEach(box.children, function (child) {
                // Get panel containers from each child.
                panelContainers = panelContainers.concat(createPanelContainers(child, model, builder, docLayout));
            });

            // Return panel containers.
            return panelContainers;
        }

        return [];
    }

    /**
     * Returns the collection of box panel containers that are contained within this component.
     *
     * @returns {Array.<mstrmojo.vi.ui.BoxPanelContainer>}
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     * @this mstrmojo.vi.ui.rw.DocLayoutViewer
     */
    function getPanelContainers() {
        return /** @type {Array.<mstrmojo.vi.ui.BoxPanelContainer>} **/ $ARR.filter(this.children, function (child) {
            return child instanceof mstrmojo.vi.ui.BoxPanelContainer;
        });
    }

    /**
     * Configures the {@link mstrmojo.vi.ui.BoxLayoutConfig} for the default layout with the editor panels on the left and the layout on the right.
     *
     * @param {Array.<int>} panels The keys for the panel that should be shown in the editor.
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     * @this mstrmojo.vi.ui.rw.DocLayoutViewer
     */
    function createLayoutXml(panels) {
        var boxCfg = this.boxLayoutConfig;

        // Create default box.
        boxCfg.useDefaultBox([
            {},
            this.docLayout
        ], [ '450', 100 ]);

        // Get children.
        var boxChildren = boxCfg.box.children;

        // Add keys for panels (make sure first panel is selected).
        boxChildren[0].k = panels.map(function (panelId, idx) {
            return panelId + (!idx ? '*' : '');
        }).join('|');

        // Add layout key.
        boxChildren[1].k = LAYOUT_ID;
    }

    /**
     * Update the box layout from root defn.
     *
     * @private
     * @memberOf mstrmojo.vi.ui.rw.DocLayoutViewer
     * @this mstrmojo.vi.ui.rw.DocLayoutViewer
     */
    function updateBoxLayout() {
        var model = this.model,
            builder = this.builder,
            layoutXml = model.getRootNode().defn.layoutXML,
            layoutXmlString = JSON.stringify(layoutXml);
        // TEMPORARY HACK [mh]: Is this the old style layout xml (with numbers for panel alias)?
        if (layoutXml && layoutXmlString.match('"k":"(1|2|3)')) {
            // Override existing layout xml so we get new.
            layoutXml = null;
        }

        // Backwards compatibility issue with changing the panel names. from vi_edt to vi_drz
        layoutXml = layoutXml && JSON.parse(layoutXmlString.replace(/vi_edt/g, VI_DROP_ZONES));

        // Create box layout configuration.
        var boxCfg = this.boxLayoutConfig = new mstrmojo.vi.ui.BoxLayoutConfig({
            hostId: this.id,
            identifier: 'id',
            box: layoutXml
        });

        // Was there NO layout XML?
        if (!layoutXml) {
            // Initialize to show drop zones panel.
            var defaultPanels = [ VI_DROP_ZONES ];

            // Does the document have a filter panel stack?
            if (getFilterStack(model, builder)) {
                // Add filter panel stack.
                defaultPanels.push(VI_FILTERS);
            }

            // Add properties panel.
            defaultPanels.push(VI_PROPERTIES);

            // Create default box with all panels open.
            createLayoutXml.call(this, defaultPanels);

            // TQMS #952357: The absence of the layoutXML means we are creating a document so make the viz gallery open.
            boxCfg.box.go = true;
        }

        // Remove any panel container first.
        getPanelContainers.call(this).forEach(function (child) {
            this.removeChildren(child);
        }, this);

        // Rebuild panel containers using new layout.
        this.addChildren(createPanelContainers(boxCfg.box, model, builder, this.docLayout));
    }

    /**
     * The widget for the MicroStrategy Report Services Layout Viewer within the HTML5 VI application.
     *
     * @class
     * @extends mstrmojo.Container
     *
     * @mixes mstrmojo.vi.ui._HasBoxLayout
     * @mixes mstrmojo.vi._MonitorsAppState
     * @mixes mstrmojo.vi.ui.rw._SavesChildPositions
     */
    mstrmojo.plugins._VisBuilder.VisBuilderDocLayoutViewer = mstrmojo.declare(
        mstrmojo.Container,

        [ mstrmojo.vi.ui._HasBoxLayout, mstrmojo.vi._MonitorsAppState, mstrmojo.vi.ui.rw._SavesChildPositions ],

        /**
         * @lends mstrmojo.vi.ui.rw.DocLayoutViewer.prototype
         */
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.VisBuilderDocLayoutViewer",

            markupString: '<div id="{@id}" class="mstrmojo-VIDocLayoutViewer {@cssClass}" style="{@cssText}"></div>',

            markupSlots: {
                containerNode: function () {
                    return this.domNode;
                }
            },

            markupMethods: {
                onheightChange: mstrmojo.Widget.heightMarkupMethod,
                onwidthChange: mstrmojo.Widget.widthMarkupMethod
            },

            /**
             * @type {mstrmojo.vi.ui.rw.DocLayout}
             */
            docLayout: null,

            /**
             * @type {mstrmojo.vi.ui.BoxPanelContainer}
             */
            editorPanel: null,

            /**
             * A flag to mark if the panels' state need to be changed. Only used by presentation mode now.
             *
             * @type {boolean}
             */
            isPanelsStateDirty: false,

            /**
             * @type {mstrmojo.vi.models.DocModel}
             * @ignore
             */
            model: null,

            /**
             * @type {mstrmojo.vi.ui.DocBuilder}
             * @ignore
             */
            builder: null,

            init: function init(props) {
                this._super(props);

                // Set isPanelsStateDirty to be true when in presentation mode in case user  enter presentation mode but the layoutViewer is still not existed.
                if (mstrApp.appState === mstrmojo.vi.VisualInsightApp.APP_STATES.PRESENTATION) {
                    this.isPanelsStateDirty = true;
                }

                // TQMS952456: attach an event to sync the box layout when root defn is changed.
                this.model.attachEventListener('updateRootDefn', this.id, function () {

                    // Is this layout viewer the current layout viewer (has parent)?
                    if (!this.parent) {
                        // Set a flag to mark the box layout dirty, so that it will rebuild box layout when redisplay.
                        this.isBoxLayoutDirty = true;

                        // Update the box layout from root defn.
                        updateBoxLayout.call(this);
                    }
                });
            },

            /**
             * Set the viz not resizable  and toggle the panels when presentation mode is on.
             *
             * @param evt
             */
            onAppStateChange: function onAppStateChange(evt) {

                var presentationMode = mstrmojo.vi.VisualInsightApp.APP_STATES.PRESENTATION;
                // Hide/Show panels only when it is changed from or to presentation mode.
                this.isPanelsStateDirty = evt.value === presentationMode || evt.valueWas === presentationMode;

                this.changePanelsVisibility();

                // Call super to set the viz not resizable when presentation mode is on.
                this._super(evt);
            },

            shouldSaveSplitterMoves: function shouldSaveSplitterMoves() {
                // TQMS #932454: Resizing splitter is not an undoable action per spec.
                return false;
            },

            getSplitterHost: function getSplitterHost() {
                return this.containerNode;
            },

            preBuildRendering: function preBuildRendering() {
                // Do we have a parent?
                var parent = this.parent;
                if (parent) {
                    // Get height and width of parent slot.
                    var parentStyle = parent[this.slot].style,
                        h = this.height,
                        w = this.width;

                    // Cache height and width for this widget.
                    this.height = parseInt((h && h !== 'auto') ? h : parentStyle.height, 10) - MARGIN + 'px';
                    this.width = parseInt((w && w !== 'auto') ? w : parentStyle.width, 10) - MARGIN + 'px';
                }
                // Cache bean state.
                this.bs = this.model.bs;
                var d = this._super();
                return d;
            },

            onRender: function onRender() {
                this._super();

                // Update the box layout from root defn.
                updateBoxLayout.call(this);

                // Layout.
                this.buildBoxLayout();

                // Clear dirty flag.
                delete this.isBoxLayoutDirty;
            },

            destroy: function destroy() {
                this._super();

                // TQMS822074 Raise an event so that the hidden filter panel stack could be destroyed.
                // The reason is that when filter panel stack is hidden, it's no longer DocLayoutViewer's child.
                this.controller.view.raiseEvent({
                    name: 'destroyLayout',
                    key: this.k
                });
            },

            getLayoutOffsets: function getLayoutOffsets() {
                return {
                    h: MARGIN,       // Margin
                    w: MARGIN        // Margin
                };
            },

            beginBoxMove: function beginBoxMove(context, boxChild, noDelete) {
                var tabInfo = getTabInfo(context);

                // Is a panel being dragged?
                this._super(context, boxChild, !!(tabInfo && !tabInfo.isSingleTab) || noDelete);
            },

            endBoxMove: function endBoxMove(context, boxChild) {
                this._super(context, boxChild);

                // Is this NOT a tab drag?
                if (!getTabInfo(context)) {
                    // Restore the box child domNode to the container.
                    this.getSplitterHost().appendChild(boxChild.domNode);
                }
            },

            getBoxLayoutSaveAction: function getBoxLayoutSaveAction(boxLayout) {
                var model = this.model,
                    layoutFormatUpdate = {};

                // Add the update object to set whether to use the page width as the layout width.
                $GET_FORMAT_OBJ($ENUM_FORMAT_PROPERTIES.USE_PAGE_WIDTH_AS_LAYOUT_WIDTH, true, layoutFormatUpdate);

                // Add the update object to set the margins to 0.
                $GET_FORMAT_OBJ($ENUM_FORMAT_PROPERTIES.MARGIN_LEFT, 0, layoutFormatUpdate);
                $GET_FORMAT_OBJ($ENUM_FORMAT_PROPERTIES.MARGIN_RIGHT, 0, layoutFormatUpdate);

                // Create an action to save the root layout xml definition.
                var layoutSaveActions = [ model.getUnitFormatAction(model.getRootNode(), 1, $GET_FORMAT_OBJ($ENUM_FORMAT_PROPERTIES.LAYOUT_XML, updateBoxKey(boxLayout))) ];

                // We need to update the layout's page-width property for each layout in the document.
                model.defn.layouts.forEach(function (layoutDefn) {
                    // Add the format action using the layout update object.
                    layoutSaveActions.push(model.getUnitFormatAction({
                        k: layoutDefn.k,
                        defn: layoutDefn
                    }, 1, JSON.parse(JSON.stringify(layoutFormatUpdate))));
                });

                // Return all the layout related actions.
                return layoutSaveActions;
            },

            getChildPositionActions: function getChildPositionActions() {
                var actions = this._super(),
                    builder = this.builder,
                    model = this.model,
                    filterStack = getFilterStack(model, builder),
                    mainStack = getComponent(model, builder, $COMPONENT_TYPES.MAIN_CONTENT),
                    pageByStack = getComponent(model, builder, $COMPONENT_TYPES.PAGEBY_STACK),
                    vizStack = getComponent(model, builder, $COMPONENT_TYPES.VIZ_CONTENT),
                    filterStackPos = $DOM.position(filterStack && filterStack.domNode),
                    mainStackPos = $DOM.position(mainStack.domNode),
                    pageByStackPos = $DOM.position(pageByStack && pageByStack.domNode),
                    vizStackPos = $DOM.position(vizStack.domNode),
                    ERROR_MARGIN = 5,
                    isFilterStackAlignedHorizontally = Math.abs(filterStackPos.x - mainStackPos.x) > ERROR_MARGIN,
                    dim = isFilterStackAlignedHorizontally ? 'x' : 'y',
                    isFilterStackFirst = filterStackPos[dim] < mainStackPos[dim],
                    isFilterStackVisible = filterStack && filterStack.visible,
                    pageWidth = $DOM.position(mstrApp.rootCtrl.view.domNode).w;
                // Reset the positions of the stacks to 0.
                filterStackPos.x = filterStackPos.y = 0;
                mainStackPos.x = mainStackPos.y = 0;
                pageByStackPos.x = pageByStackPos.y = 0;
                vizStackPos.x = vizStackPos.y = 0;

                if (isFilterStackFirst && isFilterStackVisible) {
                    // Update the positions of the main stack based on the filter stack.
                    mainStackPos[dim] = filterStackPos[dim === 'x' ? 'w' : 'h'];
                } else if (!isFilterStackFirst) {
                    // Update the position of the filter stack based on the main stack.
                    filterStackPos[dim] = mainStackPos[dim === 'x' ? 'w' : 'h'];
                }

                // Is the page by stack visible ?
                if (pageByStack && pageByStack.visible) {
                    // Update the top of the main stack to account for the page by stack.
                    vizStackPos.y += pageByStackPos.h;
                }

                // Is the filter stack visible ?
                if (isFilterStackVisible) {
                    // Is the filter stack aligned horizontally ?
                    if (isFilterStackAlignedHorizontally) {
                        // Set the main stack's dimension to account for the extra width of the page.
                        mainStackPos.w = vizStackPos.w = pageWidth - filterStackPos.w;
                    }
                }

                // Now that we have the dimensions of the different stacks, create actions for all nodes with layoutXML.
                // Set up an array that maps to the page by panel types enumeration to store their relative positions.
                var posInfo = [undefined, filterStackPos, mainStackPos, pageByStackPos, vizStackPos];

                // For each layout add the layout and main panel stack formatting properties.
                model.defn.layouts.forEach(function (layoutDefn) {
                    // Add the page width actions for each of the layouts.
                    actions.push(model.getUnitFormatAction({
                        k: layoutDefn.k,
                        defn: layoutDefn
                    }, 1, $GET_FORMAT_OBJ($ENUM_FORMAT_PROPERTIES.PAGE_WIDTH, $BOX.px2Inches(model.getZoomProps(), pageWidth))));

                    Object.keys($ENUM_PANEL_TYPES).forEach(function (viType) {
                        // Grab the special stack key from the definition.
                        var stackKey = model.getVIPanelKeyFromUnits($ENUM_PANEL_TYPES[viType], layoutDefn.k);

                        // Add the dimension and position actions for each of the special panel stacks.
                        actions.push(model.getDimensionAndPositionAction({
                            k: stackKey,
                            defn: layoutDefn.units[stackKey]
                        }, posInfo[$ENUM_PANEL_TYPES[viType]]));

                        // Is this the visualization panel stack ?
                        if ($ENUM_PANEL_TYPES[viType] === $ENUM_PANEL_TYPES.VISUALIZATION) {
                            // We want to hide the title bar for it.
                            actions.push(model.getUnitFormatAction({
                                k: stackKey,
                                defn: layoutDefn.units[stackKey]
                            }, 1, $GET_FORMAT_OBJ($ENUM_FORMAT_PROPERTIES.SHOW_TITLE_BAR, false)));
                        }
                    });
                });

                // For each layout find the layoutXML nodes.
                model.defn.layouts.forEach(function (layoutDefn) {
                    Object.keys(layoutDefn.units).forEach(function (unitKey) {
                        var units = layoutDefn.units,
                            unitDefn = units[unitKey],
                            layoutXML = unitDefn.layoutXML;

                        // TQMS923857: If the isDeleted flag is true, it means this unit has been deleted (but the cached defn is kept for redo).
                        // In this case don't save the layout.
                        if (unitDefn && unitDefn._isDeleted) {
                            return;
                        }

                        // Resize any section to the dimension of the main panel stack position.
                        if (unitDefn.t === 4) {
                            // Make a copy of the main panel stack height.
                            var subsectionHeight = $HASH.copy(mainStackPos);

                            // The panel stack has a border of 1px which we don't show here so account for it.
                            subsectionHeight.h += 2;

                            // Add the dimension and position actions for each of the units defined in the layout XML.
                            actions.push(model.getDimensionAction({
                                k: unitKey,
                                defn: unitDefn
                            }, subsectionHeight));
                        }

                        // Does the unit definition have a layoutXML property ?
                        if (layoutXML !== undefined) {
                            // Create a dummy box layout config object with the given layoutXML.
                            var boxLayoutConfig = new mstrmojo.vi.ui.BoxLayoutConfig({
                                    box: layoutXML
                                }),
                                boxInfo = this.calculateBoxLayout(boxLayoutConfig, {
                                    height: vizStackPos.h,
                                    width: vizStackPos.w,
                                    top: vizStackPos.y,
                                    left: vizStackPos.x
                                }).box;

                            // Loop through all the keys in the box info.
                            Object.keys(boxInfo).forEach(function (boxUnitKey) {
                                // Grab the calculation dimensions of the unit.
                                var boxDimensions = boxInfo[boxUnitKey].dim;

                                // Add the dimension and position actions for each of the units defined in the layout XML.
                                actions.push(model.getDimensionAndPositionAction({
                                    k: boxUnitKey,
                                    defn: units[boxUnitKey]
                                }, {
                                    h: boxDimensions.height,
                                    w: boxDimensions.width,
                                    x: boxDimensions.left,
                                    y: boxDimensions.top
                                }));
                            });
                        }
                    }, this);
                }, this);

                // Return all the actions...
                return actions;
            },

            /**
             * Returns the requested VI panel.
             *
             * @param {string} type The panel type.
             *
             * @returns {mstrmojo.vi.ui.PageByPanel|mstrmojo.vi.ui.tabs.VizPanelTabStrip|mstrmojo.vi.ui.BoxPanel|null}
             */
            getViPanel: function getViPanel(type) {
                // Can the doc layout NOT find the requested panel?
                var panel = this.docLayout.getViPanel(type);
                if (!panel) {
                    // Convert panel name to ID and get collection of panel containers.
                    var panelId = getPanelKeyFromType(type);

                    // Iterate containers.
                    getPanelContainers.call(this).every(function (child) {
                        // Ask child for panel.
                        panel = child.getPanelByType(panelId);
                        return !panel;      // If panel is found then return false to halt iteration.
                    });
                }

                return panel;
            },

            /**
             * Opens the indicated VI panel.
             *
             * @param {string} type The panel type.
             * @param {mstrmojo.XhrCallbackType=} callback The XHR callback object.
             */
            openViPanel: function openViPanel(type, callback) {
                var panelKey = getPanelKeyFromType(type),
                    panelContainer = getPanelContainers.call(this)[0],
                    model = this.model,
                    builder = this.builder,
                    id = this.id,
                    fnShowPanel = function () {
                        var layoutViewer = mstrmojo.all[id],
                            update = model.getDataService().newUpdateWithoutCmd();

                        // Do we already have a panel container?
                        if (panelContainer) {
                            // Get panel item.
                            var panelItem = PANEL_ITEMS[panelKey],
                                panel = createPanelEditor(panelItem, model, builder);

                            // Add panel for panel item.
                            panelContainer.addPanel(panelItem, panel, null, true);

                            // update panel open status
                            if (panel) {
                                panel.setOpenStatus(true, false, update);
                            }
                        } else {
                            // Create default box with only this panel open.
                            createLayoutXml.call(layoutViewer, [ panelKey ]);

                            // Add generated panel containers.
                            layoutViewer.addChildren(createPanelContainers(layoutViewer.boxLayoutConfig.box, model, builder, layoutViewer.docLayout));

                            // Layout.
                            layoutViewer.buildBoxLayout();
                        }

                        // Save layout.
                        layoutViewer.saveBoxLayout(undefined, undefined, callback, update);

                        // Suppress data when we're sending a silent update.
                        update.addExtras($HASH.copy(SUPPRESS_DATA, {
                            preserveUndo: true
                        }));

                        update.submit();

                        // Update toolbar.
                        mstrApp.rootCtrl.generateToolbar();
                    };

                // Are we NOT opening the filter stack OR is the filter stack already present in the document?
                if (panelKey !== VI_FILTERS || getFilterStack(model, builder)) {
                    // Show the panel immediately.
                    fnShowPanel();
                } else {
                    // Ask model to load the hidden filter stack.
                    model.loadHiddenFilterStack(builder, function () {
                        // Show the panel.
                        fnShowPanel();
                    });
                }
            },

            /**
             * Show/hide panels visibility when app state is changed to or from presentation mode.
             *
             */
            changePanelsVisibility: function changePanelsVisibility() {

                var isPresentationMode = mstrmojo.vi.VisualInsightApp.APP_STATES.PRESENTATION === mstrApp.appState;

                if (this.isPanelsStateDirty && this.model.getCurrentLayoutKey() === this.k) {

                    var panelNames = ['propertiesPanel', 'editPanel'],
                        panel;

                    // Toggle panels.
                    if (isPresentationMode) {
                        var oldPanelState = this.oldPanelState = [];

                        panelNames.forEach(function (panelName) {
                            var panel = this.getViPanel(panelName);
                            if (panel) {
                                panel.setOpenStatus(false);
                            }
                            // Save the open state for each panel so that they can be recovered.
                            oldPanelState.push(!!panel);
                        }, this);

                        // Hide filter panel if it was shown and empty.
                        panel = this.getViPanel('filterPanel');
                        if (panel && panel.contents && (!panel.contents.children || panel.contents.children.length === 0)) {
                            // TQMS923676: Hide the filter panel without saving.
                            panel.setOpenStatus(false, true);

                            //Save the filter panel state only when there are no children so that it can be reopened when going back to normal mode
                            oldPanelState.push(!!panel);
                        }

                    } else {

                        //If there is an old state for the filter panel and is true, reopen the filter panel
                        if (this.oldPanelState[mstrmojo.vi.models.VIComponentMap.TYPES.FILTER_PANEL]) {
                            this.openViPanel('filterPanel');
                        }

                        panelNames.forEach(function (panelName, idx) {
                            if (this.oldPanelState[idx]) {
                                this.openViPanel(panelName);
                            }
                        }, this);

                        delete this.oldPanelState;
                        delete this.isPanelsStateDirty;
                    }
                }
            },

            /**
             * Get current box layout config.
             */
            getBoxLayoutConfig: function getBoxLayoutConfig() {
                var boxLayoutConfig = this.boxLayoutConfig;
                if (boxLayoutConfig) {
                    updateBoxKey(boxLayoutConfig.box);
                }

                return boxLayoutConfig;
            },

            /**
             * Saves the current box layout and update the model root defn LayoutXML
             */
            saveBoxLayout: function saveBoxLayout(cmd, stage, callback, update) {

            }
        }
    );
    mstrmojo.vi.ui.rw.DocLayoutViewer = mstrmojo.plugins._VisBuilder.VisBuilderDocLayoutViewer;
}());