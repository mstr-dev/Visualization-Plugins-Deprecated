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

                var width = parseInt(e.value, 10);

                this.zonesNode.width = width + "px";

                this.updateContent();
            },


            /**
             * initialize the editor, cache the editor's id.
             * @param props
             * @override
             */
            init: function init(props) {
                this._super(props);
                $EID = this.id;
            },

            /**
             * add zones to each row
             * @override
             */
            postBuildRendering : function postBuildRendering() {
                this._super();

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
                //var content = this.content;

                /*content.rowPanel.set('visible', visible);
                content.newZone.set('visible', visible);*/

                this.rowPanel.set('visible', visible);
                this.newZone.set('visible', visible);


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
                    dropZoneDialog;

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
                                mstrmojo.all[$EID].addZoneRow();
                            }
                        }
                     ]

        }
    );
}());
//@ sourceURL=DropZoneGUIEditor.js