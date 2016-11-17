(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    mstrmojo.requiresCls("mstrmojo.Container", 'mstrmojo.TextBox', 'mstrmojo.Image', "mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSelector", "mstrmojo.css");
    var defaultIcon = '/javascript/mojo/css/vi/images/viz_gallery_sprite.png', ENUM_ICON_TYPE = {
        DEFAULT: 1,
        UPLOADED: 2,
        HREF: 3
    };

    function handleIconChange(type) {
        var preview = this.preview, selector = this.selector;
        switch (type) {
        case ENUM_ICON_TYPE.DEFAULT:
            selector.reset();
            selector.set('value', '');
            preview.set('src', '..' + defaultIcon);
            var style = 'VisBuilderIconSectionIMG ';
            if (this.isDarkScheme) {
                style += ' DefaultDark';
            }
            preview.set('cssClass', style);
            break;
        case ENUM_ICON_TYPE.UPLOADED:
            var oFReader = new FileReader();
            if (selector.fileNode.files[0]) {
                oFReader.readAsDataURL(selector.fileNode.files[0]);
                oFReader.onload = function (oFREvent) {
                    //Add for onetier, upload icon
                    if(mstrApp.isSingleTier){
                        selector.fileNode.baseDataValue = oFREvent.target.result;
                    }
                    preview.set('src', oFREvent.target.result);
                    preview.set('cssClass', 'VisBuilderIconSectionIMG UploadedImage');
                };
            }
            break;
        case ENUM_ICON_TYPE.HREF:
            preview.set('src', selector.value);
            this.iconValue = selector.value;
            break;
        default:
            console.log('unknown action');
        }
        this.iconType = type;
    }

    mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSection = mstrmojo.declare(
        mstrmojo.Container,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSection",
            isDarkScheme: false,
            pluginFolder: '',
            label: '',
            iconValue: '',
            iconType: '',
            cssClass: "VisBuilderIconSection",
            markupString: '<div class="{@cssClass}" id="{@id}" style="{@cssText}">' +
            '<div class="mstrmojo-TextBox-label">{@label}</div>' +
            '<div class="VisBuilderIconSectionContainer">' +
            '<div class="VisBuilderIconSection">' +
            '<div class="VisBuilderIconSectionLeft"><div class="VisBuilderLine"></div><div class="VisBuilderLine"></div></div>' +
            '<div class="VisBuilderIconSectionRight"></div>' +
            ' </div>' +
            ' </div>' +
            '</div>',
            markupSlots: {
                selectorNode: function selectorNode() {
                    return this.domNode.lastChild.firstChild.firstChild.firstChild;
                },
                resetNode: function resetNode() {
                    return this.domNode.lastChild.firstChild.firstChild.lastChild;
                },
                previewNode: function previewNode() {
                    return this.domNode.lastChild.firstChild.children[1];
                }
            },
            children: [
                {
                    alias: "selector",
                    slot: "selectorNode",
                    scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSelector",
                    cssClass: "VisBuilderIconSectionFUB",
                    browseLabel: '...',
                    changeTxtCallback: function () {
                        handleIconChange.call(this.parent, ENUM_ICON_TYPE.HREF);
                    },
                    changeUploadCallback: function () {
                        handleIconChange.call(this.parent, ENUM_ICON_TYPE.UPLOADED);
                    }
                },
                {
                    alias: "resetButton",
                    slot: "resetNode",
                    scriptClass: "mstrmojo.Button",
                    text: 'Reset to default Icon',
                    cssClass: "VisBuilderIconSectionTB mstrmojo-WebButton",
                    onclick: function () {
                        handleIconChange.call(this.parent, ENUM_ICON_TYPE.DEFAULT, this.parent.selector);
                    }
                },
                {
                    alias: 'preview',
                    slot: "previewNode",
                    scriptClass: "mstrmojo.Image",
                    cssClass: "VisBuilderIconSectionIMG",
                    cssText: 'height: 32px; width: 32px;overflow:hidden;',
                    postBuildRendering: function postBuildRendering() {
                        this.imgNode.style.padding = "2px";
                    }
                }
            ],
            setIcon: function (value) {
                //if this was called with different value then update value
                if (this.iconValue !== value) {
                    this.iconValue = value;
                }

                //determin type of icon and call handleiconChange with correct type
                if (value === defaultIcon || value.indexOf(defaultIcon) > -1 || value === '') {
                    this.selector.set('value', '');

                    handleIconChange.call(this, ENUM_ICON_TYPE.DEFAULT);
                } else {
                    this.selector.set('value', this.iconValue);
                    handleIconChange.call(this, ENUM_ICON_TYPE.HREF);
                }
                this.selector.set('orgValue', this.iconValue);
            },
            postBuildRendering: function postBuildRendering() {
                this._super();
                this.resetButton.set('text', 'Reset to Default ' + (this.isDarkScheme ? 'Dark' : 'Light') + ' Icon');
                this.setIcon(this.iconValue);
            },
            apply: function () {
                if(this.selector.isChanged() && this.iconType ===ENUM_ICON_TYPE.UPLOADED){
                    this.selector.params.fld = this.pluginFolder;
                    this.selector.params.drk =  ''+this.isDarkScheme;
                    this.selector.submit();
                }
                var data = {tp: this.iconType, vl: this.iconValue, isDrk: this.isDarkScheme};
                return data;
            }
        }
    );
}())
//@ sourceURL=VisBuilderIconSection.js