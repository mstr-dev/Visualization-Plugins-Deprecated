(function () {
    mstrmojo.requiresCls("mstrmojo.Editor",
        "mstrmojo.Button",
        "mstrmojo.Widget",
        "mstrmojo.Label",
        "mstrmojo.Box",
        "mstrmojo.desc",
        "mstrmojo.css",
        "mstrmojo.hash",
        "mstrmojo.array",
        "mstrmojo.models.FormatModel",
        "mstrmojo.ui._HasScroller",
        "mstrmojo.plugins._VisBuilder.DropZoneRow",
        "mstrmojo.plugins._VisBuilder.NewDropZoneRowDialog",
        "mstrmojo.plugins._VisBuilder.DropZoneRowPanel");

    var $EID = ''; //cache the editor's id


    /**
     * <p>Represents the widget for the custom drop zones GUI part</p>
     *
     * @class
     * @extends mstrmojo.Editor
     * @mixes mstrmojo.ui._HasScroller
     */
    mstrmojo.plugins._VisBuilder.DropZoneGUIEditor= mstrmojo.declare(
        // Super class
        mstrmojo.Box,

        // Mixins
        [mstrmojo.ui._HasScroller],

        /**
         * @lends mstrmojo.plugins._VisBuilder.DropZoneGUIEditor.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins._VisBuilder.DropZoneGUIEditor',

            cssClass: 'advanced-dropzone',

            title: 'Zones Editor',

            /**
             * Represents the property of the dropzone editor model.
             *
             * @type mstrmojo.plugins._VisBuilder.ui.VisBuilderDZCodeEditorModel
             */
            model: null,


            markupString: '<div id="{@id}" class="mstrmojo-Box {@cssClass}" style="{@cssText}">' +
                                "<div class='rulesTitles'>" +
                                    "<div class='order'>" + mstrmojo.desc(3095, "Order") + "</div>" +
                                    "<div class='condition'>" + "Zones" + "</div>" +
                                "</div>"+
                                '<div id="{@id}" class="mstrmojo-Box scroll-container"  style="{@cssText}">' +
                                '</div>'+
                            '</div>',
            markupSlots: {
                zonesNode: function () { return this.domNode.lastChild; }
            },

            setupScrollNodes: function setupScrollNodes() {
                this.scrollNode = this.zonesNode;
            },

            onwidthChange: function onwidthChange(e) {
                //handleDimensionChange.call(this, 'width');
               // this.updateContent();
                console.log("dropzone gui editor width change.\n");
                var width = parseInt(e.value, 10);
                //this.zonesNode.set("width", width + "px");
                this.zonesNode.width = width + "px";
                /*var width = parseInt(evt.value, 10);

                if (width > 0) {
                    this.pulldown.set("width", width - (this.btnRefreshNS.visible ? REFRESH_NS_BUTTON_WIDTH : 0) + "px"); // refresh button width 24px + margin 5px
                }*/
                this.updateContent();
            },


            /**
             * initialize the editor, cache the editor's id.
             * @param props
             * @override
             */
            init: function init(props) {
                this._super(props);
                //this.model = props.model;
                $EID = this.id;
            },

            /**
             * add zones to each row
             * @override
             */
            postBuildRendering : function postBuildRendering() {
                this._super();

                //var content = this.content;

                this.updateContent();


            },

            onOpen: function onOpen() {
                this.updateContent();

                this.setRowPanelVisibility(true);

            },


            /**
             * Update the content UI when model is edited.
             */
            ondropzoneEdit: function ondropzoneEdit() {
                this.updateContent();
            },




            /**
             * Set the visibilities of row panel and new zone link.
             *
             * @param visible {Boolean}
             */
            setRowPanelVisibility: function toggleRowPanelVisibility(visible) {
                var content = this.content;

                content.rowPanel.set('visible', visible);
                content.newZone.set('visible', visible);

                // Update the scrollbars.
                this.updateScrollbars();
            },

            addZoneRow: function addZoneRow(props)
            {
                var rowPanel = this.rowPanel,
                    children = rowPanel.children,
                    idx = isNaN(props && props.idx)? (children && children.length) || 0 : (props && props.idx),
                    model = this.model,
                    allZones = model.dropzones,
                    //$ID = "NewDropZoneRowDialog",
                    dropZoneDialog; //= mstrmojo.all[$ID];

                if (!allZones) {
                    allZones = model.dropzones = {};
                }


                dropZoneDialog =  new mstrmojo.plugins._VisBuilder.NewDropZoneRowDialog({
                        "guiEditor": this,
                        "dropzones": allZones,
                        "index": idx
                });

                dropZoneDialog.open();

                this.addDisposable(dropZoneDialog);

            },

            /**
             * Update the content part.
             */
            updateContent: function updateContent()
            {

                var model = this.model,
                    allZones = model.dropzones,//[{},{}]
                    editor = this,
                    rows = [],
                    rowPanel = this.rowPanel,
                    i = 0;

                if (allZones) {
                    // Loop model.thresholds and add expression to editor.
                    allZones.forEach(function (zone) {
                        rows.push({
                            scriptClass: 'mstrmojo.plugins._VisBuilder.DropZoneRow',
                            dropzone: zone,
                            editor: editor,
                            model: model,
                            idx: i++,
                            slot: "containerNode",
                            width:editor.zonesNode.width
                        });
                    });
                }

                // Remove existing children and add new expressions.
                rowPanel.destroyChildren(false);
                rowPanel.addChildren(rows);

                // Update the scrollbars.
                this.updateScrollbars();
            },

            children: [
                        {scriptClass: 'mstrmojo.plugins._VisBuilder.DropZoneRowPanel',
                            alias: 'rowPanel',
                            children: [
                            ],
                            slot: "zonesNode"
                        },
                        {
                            scriptClass: "mstrmojo.Label",
                            alias: 'newZone',
                            cssClass: "link",
                            text: "New Zone",
                            slot: "zonesNode",
                            onclick: function onclick() {
                                //addZoneRow.call(mstrmojo.all[$EID]);
                                mstrmojo.all[$EID].addZoneRow();
                            }
                        }
                     ]

        }
    );
}());
//@ sourceURL=DropZoneGUIEditor.js