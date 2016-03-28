(function () {

    if(!mstrmojo.plugins){
        mstrmojo.plugins = {};
    }
    if(!mstrmojo.plugins._VisBuilder){
        mstrmojo.plugins._VisBuilder ={};
    }

    if(!mstrmojo.plugins._VisBuilder.ui){
        mstrmojo.plugins._VisBuilder.ui = {};
    }


    mstrmojo.requiresCls("mstrmojo.Editor",
        "mstrmojo.TextBoxWithLabel",
        "mstrmojo.Label",
        "mstrmojo.hash",
        "mstrmojo.RadioButton",
        "mstrmojo.TextAreaWithLabel",
        "mstrmojo.ValidationTextBox",
        "mstrmojo.plugins._VisBuilder.ui.CodeMirror",
        "mstrmojo.vi.ui.editors.EditorGroup");

    var $H = mstrmojo.hash;

    var ELEMENT_TYPE = {
        BOTH : 0,
        ATTRIBUTE: 1,
        METRIC : 2,
        ATTRIBUTEORMETRIC: 3
    };

    //1 title, by default 0
    //2 capacity, bydefault 2
    var validationTitle = false,
        validationCapacity  = true;
    function validateOkButton(wind){
        if(validationCapacity   && validationTitle ){
            wind.btns.okbutton.set('enabled', true);
        }else{
            wind.btns.okbutton.set('enabled', false);
        }
    }

    function validateValue() {
        var wind = this.parent.parent,
            zones = wind.dropzones || [],
            index = wind.index,
            zonesC = zones.length;

        if (this.changedTooltip === true) {
            this.inputNode.setAttribute('title', "Set Zone name");
            this.changedTooltip = false;
        }
        if (this.value.length > 0) {
            while (zonesC--) {
                if (index !== zonesC && zones[zonesC].name.toLowerCase() === (this.value).toLowerCase()) {
                    validationTitle = false;
                    validateOkButton(wind);
                    this.inputNode.setAttribute('title', "Name already used");
                    this.changedTooltip = true;
                    return;
                }
            }
            validationTitle = true;
            validateOkButton(wind);

        } else {
            this.inputNode.setAttribute('title', "Name should not be null");
            this.changedTooltip = true;
            validationTitle = false;
            validateOkButton(wind);
        }
    }
    function getTitleGroup(vLabel, vValue, vAlias, vHint ) {
        var content = this.nameField = new mstrmojo.TextBoxWithLabel({
            cssDisplay: 'block',
            cssClass: 'ZonePropertyLine',
            label: vLabel,
            value: vValue,
            hint: vHint,
            alias: vAlias,
            tooltip: 'Set Zone name',
            changedTooltip: false,
            onkeyup: function () {
                validateValue.call(this);
            }
        });
        return new mstrmojo.vi.ui.editors.EditorGroup($H.copy(null, {
            children: [content]
        }));
    }

    function getTooltipGroup(vLabel, vValue, vAlias, vHint ) {
        var content = this.titleField = new mstrmojo.TextBoxWithLabel({
            cssDisplay: 'block',
            cssClass: 'ZonePropertyLine',
            label: vLabel,
            value: vValue,
            hint: vHint,
            alias: vAlias
        });
        return new mstrmojo.vi.ui.editors.EditorGroup($H.copy(null, {
            children: [content]
        }));
    }

    /**
     * A validate text box with a label next to it.
     *
     * @class
     * @extends mstrmojo.ValidationTextBox
     */
    mstrmojo.plugins._VisBuilder.ValidataionTextBoxWithLabel = mstrmojo.declare(
        mstrmojo.ValidationTextBox,
        null,
        /**
         * @lends mstrmojo.TextBoxWithLabel.prototype
         */
        {
            scriptClass: 'mstrmojo.ValidataionTextBoxWithLabel',

            /**
             * The string to appear before the text box.
             *
             * @type {string}
             */
            label: '',

            /**
             * The string to appear after the text box.
             *
             * @type {string}
             */
            rightLabel: '',

            cssDisplay: 'inline',

            type: 'text',

            value: '',

            widgetCssClass : 'mstrmojo-ValidationTextBoxWithLabel',

            markupString: '<div class=" mstrmojo-TextBoxWithLabel {@widgetCssClass} {@cssClass}" style="{@cssText}">' +
            '<span class="mstrmojo-TextBox-label">{@label}</span>' +
            '<input id="{@id}" class="mstrmojo-TextBox {@inputNodeCssClass}"  style="{@inputNodeCssText}" ' +
            'title="{@tooltip}" type="{@type}" ' +
            'value="{@value}" size="{@size}" maxlength="{@maxLength}" index="{@tabIndex}"' +
            ' mstrAttach:focus,keyup,blur/>' +
            '<span class="mstrmojo-TextBox-label-right">{@rightLabel}</span>' +
            '</div>',

            markupSlots: {
                inputNode: function () {
                    return this.domNode.firstChild.nextSibling;
                },
                lblNode: function () {
                    return this.domNode.firstChild;
                }
            },

           /* init: function init(props) {

                this.value = props.value;
                this.label = props.label;
                this.cssClass = props.cssClass;
                this.cssDisplay = props.cssDisplay;
                this.hint = props.hint;
                this.alias = props.alias;
                this._super(props);
            }*/
        }
    );

    function getCapacityGroup(vLabel, vValue, vAlias, vHint ) {
        var content = this.capacityField = new mstrmojo.plugins._VisBuilder.ValidataionTextBoxWithLabel({
            cssDisplay: 'block',
            cssClass: 'ZonePropertyLine',
            label: vLabel,
            value: vValue,
            hint: vHint,
            alias: vAlias,
            constraints: {
                validator: function(v) {
                    var SC = mstrmojo.validation.STATUSCODE;

                    if(v === "" || mstrmojo.num.isInt(v) && mstrmojo.num.parseInteger(v) > 0 ) {
                        return {code:SC.VALID};
                    } else { //varchars
                        return {code:SC.INVALID, msg:mstrmojo.desc(7901, 'This field contains interger value with incorrect format')};
                    }
                },
                trigger: mstrmojo.validation.TRIGGER.ALL
            },
            onValid: function () {
                var wind = this.parent.parent;
                validationCapacity = true;
                validateOkButton(wind);
            },
            onInvalid: function(){
                var wind = this.parent.parent;
                validationCapacity = false;
                validateOkButton(wind);
            }
        });
        return new mstrmojo.vi.ui.editors.EditorGroup($H.copy(null, {
            children: [content]
        }));
    }

    mstrmojo.plugins._VisBuilder.ElementTypeRadioSelector = mstrmojo.declare(
        mstrmojo.Container,
        null,

        {
            scriptClass: 'mstrmojo.plugins._VisBuilder.ElementTypeRadioSelector',

            markupString: '<div class="mstrmojo-ElementyTypeRadio {@cssClass}">' +
            '<input type="radio" id="{@id}"   name="{@groupName}" mstrAttach:change>' +
            '<label for="{@id}" mstrAttach:click><span>{@tabName}</span></label>' +
            '</div>',

            markupSlots: {
                radioNode: function radioNode() { return this.domNode.firstChild; }
            },
            /**
             * Radio button group name
             */
            groupName: null,
            /**
             * Tab name
             */
            tabName: null,

            isSelected: false,

            groupIndex: null,

            init: function (props) {
                if (this._super) {
                    this._super(props);
                }
            },

            postBuildRendering: function () {
                if (this.isSelected) {
                    this.radioNode.checked = true;
                }
                this.attachEventListener("elementTypeChanged", this.parent.parent.parent.id, this.parent.parent.parent.onelementTypeChanged );
            },
            onclick: function (evt) {
            },

            onchange: function(evt){
                console.log("slect change");
                this.parent.set("selectedIndex",evt.src.groupIndex);
                this.raiseEvent({
                    name: 'elementTypeChanged',
                    elementType: evt.src.groupIndex,
                    domEvent: evt
                });
            }

        }
    );

    // Internal
    mstrmojo.plugins._VisBuilder.ElementTypeRadioSelectorPane = mstrmojo.declare(
        mstrmojo.Container,

        null,

        /**
         * @lends mstrmojo.vi.ui.editors.CustomVizGalleryEditorTabPane.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins._VisBuilder.ElementTypeRadioSelectorPane',

            markupString: '<div class="mstrmojo-ElementTypeRadioSelectorPane {@cssClass}">' +
            '<div class="ElementTypeTitle">'+ "{@title}" + '</div>' +
            '<div></div>' +
            '</div>',
            markupSlots: {
                containerNode: function containerNode() { return this.domNode.lastChild; }
            },
            title:null,

            group: null,

            selectedIndex: 0,

            /**
             * Array.<{name: String}> tab definitions
             */
            tabs: null,

            init: function (props) {
                if (this._super) {
                    this._super(props);
                }
                var tabs = this.tabs || [];
                var me = this;
                this.addChildren(tabs.map(function (tab, idx) {
                    return new mstrmojo.plugins._VisBuilder.ElementTypeRadioSelector({
                        groupName: me.id + '-' + me.group,
                        tabName: tab.name,
                        groupIndex: idx,
                        isSelected: idx === me.selectedIndex
                    });
                }));
            }


        }
    );

    function getElementTypeGroup(vLabel, vValue) {

        var content = this.elementTypeField = new mstrmojo.plugins._VisBuilder.ElementTypeRadioSelectorPane({
            title: vLabel,
            group: 'elementType',
            selectedIndex: vValue,
            tabs: [
                {
                    name: "Attribute and Metric"
                },
                {
                    name: "Attribute"//mstrmojo.desc(14413, 'Microstrategy'),
                },{
                    name: "Metric"
                },{
                    name: "Attribute or Metric"
                }
            ]
        });
        return new mstrmojo.vi.ui.editors.EditorGroup($H.copy(null, {
            children: [content]
        }));
    }
    /**
     *
     *New or Edit row zone item dialog
     * @extends mstrmojo.Editor
     *
     */

    mstrmojo.plugins._VisBuilder.NewDropZoneRowDialog = mstrmojo.declare(
        mstrmojo.Editor,
        null,
        /**
         * @lends mstrmojo.vi.ui.VisBuilderVersionInfoDialog.prototype
         */
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.NewDropZoneRowDialog",

            title: null, //mstrmojo.desc(*****, 'Visualization Builder'),

            cssClass : "mstrmojo-visbuilder-newzone",

            //id : "NewDropZoneRowDialog",

            modal : true,

            visible : false,

            btnAlignment: 'right',

            dropzones : null,

            index : -1,

            guiEditor : null,

            isNewZone: true,

            disabledTxt: null,


            init: function init(props) {
                var that = this;

                this.dropzones =props.dropzones || {};
                this.index = props.index || 0;
                this.guiEditor = props.guiEditor;
                if(this.dropzones.length && this.index < this.dropzones.length && this.index >= 0){
                    this.isNewZone = false;
                    this.title = "Edit Zone";
                }else{
                    this.isNewZone = true;
                    this.title = "New Zone";
                }
                //!*Set the buttons and the callbacks*!/

                this.addChildren(
                    {
                        scriptClass: "mstrmojo.HBox",
                        cssClass: "Editor-buttonBox",
                        alias: 'btns',
                        slot: "buttonNode",
                        children: [
                            {
                                scriptClass: "mstrmojo.HTMLButton",
                                cssClass: "mstrmojo-Editor-button",
                                iconClass: "mstrmojo-Editor-button-OK",
                                text: mstrmojo.desc(1442, "OK"),
                                enabled: !this.isNewZone,
                                alias: 'okbutton',
                                onclick: function () {
                                    if(that.saveZoneRow()){
                                        that.close();
                                    }
                                }
                            },
                            {
                                scriptClass: "mstrmojo.HTMLButton",
                                cssClass: "mstrmojo-Editor-button",
                                iconClass: "mstrmojo-Editor-button-Close",
                                text: 'Cancel',
                                onclick: function () {
                                    that.close();
                                }
                            }
                        ]
                    }
                )
                this._super(props);
            },


            onelementTypeChanged: function onelementTypeChanged(evt){
                var titlefield = this.titleField;
                switch(evt.elementType){
                    case ELEMENT_TYPE.ATTRIBUTE:
                        titlefield.set("value", "Drag Attribute Here");
                        break;
                    case ELEMENT_TYPE.METRIC:
                        titlefield.set("value", "Drag Metric Here");
                        break;
                    case ELEMENT_TYPE.BOTH:
                    case ELEMENT_TYPE.ATTRIBUTEORMETRIC:
                        titlefield.set("value", "Drag Object Here");
                }
            },

            postBuildRendering: function postBuildRendering() {

                var zone = {},
                    contents;

                if(this.dropzones.length !== this.index){
                    zone = this.dropzones[this.index];//edit zone dialog
                }

                contents = this.getContent(zone);
                contents.forEach(function (child) {
                    child.slot = 'containerNode';
                });
                this.addChildren(contents );

                this._super();
            },

            /**
             *
             * @param param
             */
            saveZoneRow: function () {

                var zone,
                    nameField = this.nameField,
                    elementTypeField = this.elementTypeField,
                    titleField = this.titleField,
                    capacityField = this.capacityField,
                    disabledTxt = this.disabledTxt;

                if (!disabledTxt.isValid()) {
                    mstrmojo.alert("There is a error in javascript code");
                    return false;
                }


                if(this.isNewZone){
                    zone = {};
                    if(!this.dropzones){
                        this.dropzones = [];
                    }
                }else{
                    zone = this.dropzones[this.index];
                }

                if (nameField && nameField.value) {
                    zone.name = nameField.value;
                }
                if (elementTypeField && !isNaN(elementTypeField.selectedIndex)) {
                    zone.allowObjectType = elementTypeField.selectedIndex;
                }
                if (titleField && titleField.value) {
                    zone.title = titleField.value;
                }

                zone.disabled =  "" + disabledTxt.getValue().trim() + "";

                if (capacityField && capacityField.value) {
                    zone.maxCapacity = capacityField.value;
                }

                this.dropzones[this.index] = zone;

                if(this.isNewZone){
                    this.guiEditor.rowPanel.addChildren([{
                        scriptClass: 'mstrmojo.plugins._VisBuilder.DropZoneRow',
                        dropzone: zone,
                        editor: this.guiEditor,
                        model: this.guiEditor.model,
                        idx: this.index
                    }]);
                }
                this.guiEditor.model.addZone(zone, this.index);

                return true;
            },

            getContent: function getContent(zone) {

                this.disabledTxt = new mstrmojo.plugins._VisBuilder.ui.CodeMirror({value: zone && zone.disabled || "",mode: "javascript", cssClass:"disabledCode"});
                return [getTitleGroup.call(this,"Zone Name:", zone && zone.name || "", "name", "New Drop Zone Title"),
                    getElementTypeGroup.call(this,"Element Type:", zone && zone.allowObjectType || 0),
                    getCapacityGroup.call(this,"Max Capacity:", zone && zone.maxCapacity || "", "maxCapacity", "Maximum element number"),
                    getTooltipGroup.call(this,"Zone Tooltip:", zone && zone.title || "Drag Object Here", "title", "New drop zone drag tooltip"),
                    new mstrmojo.vi.ui.editors.EditorGroup($H.copy(null, {
                        children: [new mstrmojo.Label({cssClass: "disabled-edt-title", text: "Disabled:"}), this.disabledTxt]}))
                ];
            }

        }
    );
}());
//@ sourceURL=NewDropZoneRowDialog.js