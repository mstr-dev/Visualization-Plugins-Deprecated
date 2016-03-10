(function () {
    mstrmojo.requiresCls(
        "mstrmojo.Widget",
        "mstrmojo.Box",
        "mstrmojo.Label",
        "mstrmojo.hash",
        "mstrmojo.array",
        "mstrmojo.ui.Checkbox",
        "mstrmojo.css",
        "mstrmojo._HasLayout",
        "mstrmojo.ui.menus._HasMenuPopup");



    var $HASH = mstrmojo.hash,
        $WIDGET = mstrmojo.Widget;
    /**
     * A special type of box of sort rules used by Advanced Threshold Editor
     *
     * @class
     *
     * @extends mstrmojo.Box
     */
    mstrmojo.plugins._VisBuilder.DropZoneRow = mstrmojo.declare(
        mstrmojo.Box,

        [ mstrmojo._HasLayout, mstrmojo.ui.menus._HasMenuPopup ],

        /**
         * @lends mstrmojo.plugins._VisBuilder.DropZoneRow.prototype
         */
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.DropZoneRow",
            markupString:
            '<div id="{@id}" class="mstrmojo-dropzoneRow cf {@cssClass}" style="{@cssText}" mstrAttach:click>' +
                '<div>' +
                    '<div class="draggable-icon"></div>' +
                '</div>' +
                '<div>' +
                    '<div class="container">' +
                        '<div class = "leftText" style="float:left">'+ //style="width:15px"
                        '</div>'+
                        '<div class = "rightText" >'+ // style="width:75%"
                        '</div>'+
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<div class="menu"></div>' +
                '</div>' +
                '<div>' +
                    '<div class="delete"></div>' +
                '</div>' +
            '</div>',
            markupSlots: {
                containerNode: function containerNode() { return this.domNode.children[1]; },
                leftTextNode : function leftTextNode(){ return this.domNode.children[1].firstChild.children[0];},
                rightTextNode : function rightTextNode(){ return this.domNode.children[1].firstChild.children[1];},

                draggableNode: function draggableNode() { return this.domNode.firstChild; },
                draggableElementNode:function draggableElementNode(){ return this.domNode.firstChild.firstChild;},
                menuNode: function containerNode() { return this.domNode.children[2]; },
                menuElementNode: function menuElementNode(){ return this.domNode.children[2].firstChild;},
                deleteNode: function deleteNode() { return this.domNode.children[3]; },
                deleteElementNode: function deleteElementNode(){ return this.domNode.children[3].firstChild;}

            },

            layoutConfig: {

                w: {
                    //leftTextNode: '20%',
                    //rightTextNode:"70",
                    //leftTextNode:'25%',
                    leftTextNode:'15px',
                    rightTextNode:'75%',
                    containerNode: '100%',
                    draggableNode:"25px",
                    menuNode:"25px",
                    deleteNode:"25px"
                },
                xt: true
            },

            /**
             * Sets the width of the domNode and then calls doLayout.
             */
           /* onwidthChange: function onwidthChange(e) {
                //handleDimensionChange.call(this, 'width');
                this.widthMarkupMethod();
            },*/

            /*onwidthChange: function onwidthChange(){
                $WIDGET.widthMarkupMethod();
                this.parent.parent.updateContent();

            },*/


          /* markupMethods: {
                onheightChange: $WIDGET.heightMarkupMethod,
                onwidthChange: $WIDGET.widthMarkupMethod
            },*/

            //width: "100%",

            /**
             * The dropzone data .
             */
            dropzone: undefined,

            /**
             * The index of this row in the editor.
             */
            idx: undefined,

            /**
             * Reference to Advanced Threshold Editor
             *
             * @type mstrmojo.plugins._VisBuilder.DropZoneGUIEditor
             */
            editor: undefined,

            /**
             * Reference to Threshold Model
             *
             * @type mstrmojo.plugins._VisBuilder.DropZoneGUIModel
             */
            model: undefined,

            /**
             * Child alias
             *
             * @ignore
             */
            lblIndex: undefined,

            /**
             * Child alias
             *
             * @ignore
             */
            chkBox: undefined,

            /**
             * Child alias
             *
             * @ignore
             */
            exprTree: undefined,

            postBuildRendering: function postBuildRendering() {

                this.destroyChildren(false);

                var dropzone = this.dropzone;


                this.destroyChildren(false);
                this.addChildren([
                    {
                        scriptClass: 'mstrmojo.Label',
                        alias: 'lblIndex',
                        slot: 'leftTextNode',
                        text: this.idx + 1
                    },
                    {
                        scriptClass: 'mstrmojo.TextBox',
                        alias: 'zonename',
                        slot: 'rightTextNode',
                        value: dropzone && dropzone.name,
                        readOnly : true
                    }
                ]);

                //this.width = this.parent.domNode.offsetWidth;

                return this._super();
            },


            /*doLayout: function doLayout() {

                //create layout config and set xt to true if it does not exist
                this.layoutConfig = this.layoutConfig ? $HASH.copy({xt:true},this.layoutConfig) : {xt: true};

                //if it is in filter panel, set the width of child nodes

                    this.layoutConfig.w = {
                        leftTextNode: '20%',
                        rightTextNode: '80%'

                    };


                this._super();
            },*/


            /**
             * Check if the click is on the delete button, if so,
             * raise an event to the parent and this whole box will be
             * removed in the parent's level.
             *
             * @param event
             */
            onclick: function onclick(event) {
                var editor = this.editor,
                    target = event.getTarget(),
                    me = this,
                    model = this.model;

                if (target === this.deleteNode ||target === this.deleteElementNode) { // Delete this condition.

                    this.removeFromModel();

                } else if (target === this.menuNode || target === this.menuElementNode) { // Open menu popup.

                    var menuCfg = new mstrmojo.ui.menus.MenuConfig();
                    menuCfg.hostId = this.id;
                    menuCfg.hostElement = this.menuNode;
                    menuCfg.isHostedWithin = false;

                    // Editor
                    menuCfg.addMenuItem("Edit", '', function () {
                        editor.addZoneRow({"idx":me.idx});
                    });

                    if (this.idx !== 0) {
                        // Move Up
                        menuCfg.addMenuItem(mstrmojo.desc(7978, 'Move Up'), '', function () {
                            model.moveZone(me.idx, me.idx - 1);
                        });
                    } else {
                        menuCfg.addNonInteractiveMenuItem(mstrmojo.desc(7978, 'Move Up'), '', true);
                    }

                    if (this.idx !== model.dropzones.length - 1) {
                        // Move Down
                        menuCfg.addMenuItem(mstrmojo.desc(7979, 'Move Down'), '', function () {
                            model.moveZone(me.idx, me.idx + 1);
                        });
                    } else {
                        menuCfg.addNonInteractiveMenuItem(mstrmojo.desc(7979, 'Move Down'), '', true);
                    }

                    // New Condition
                    menuCfg.addMenuItem("New Zone", '', function () {
                        editor.addZoneRow();
                    });

                    // Show menu popup
                    this.openPopup(menuCfg.newInstance());

                }

            },

            /**
             * Remove this row itself from model.
             */
            removeFromModel: function removeFromModel() {
                this.model.deleteDropZone(this.dropzone);
            }


        }

    );

}());
//@ sourceURL=DropZoneRow.js