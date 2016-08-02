(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    function hideEmpty() {
        var value = this.value,
            inputNode = this.inputNode,
            inputNodeValue = inputNode.value,
            resolvedValue = (value !== null && value !== undefined) ? String(value) : '';

        if (resolvedValue !== inputNodeValue && (!this.keepEmpty || inputNodeValue !== this.emptyText)) {
            inputNode.value = resolvedValue;
        }

        if (inputNode.mstrmojoEmpty) {
            mstrmojo.css.removeClass(inputNode, [this.emptyClass]);
            inputNode.mstrmojoEmpty = null;
        }
    }

    function showEmpty() {
        var inputNode = this.inputNode;
        inputNode.value = this.emptyText || '';
        // Add the empty CSS class on the input node.
        mstrmojo.css.addClass(inputNode, [this.emptyClass]);
        // Set a flag on it to denote it's empty.
        inputNode.mstrmojoEmpty = true;
    }

    mstrmojo.requiresCls("mstrmojo.Container", "mstrmojo.FileUploadBox", 'mstrmojo.TextBox', 'mstrmojo.Image');
    mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSelector = mstrmojo.declare(
        mstrmojo.FileUploadBox,
        [mstrmojo._HasChildren],
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSelector",
            emptyText: 'Image URL (Optional)',
            emptyClass: 'mstrmojo-empty',
            orgValue: '',
            params: {},
            uploadTaskId: 'VisBuilderIconUpload',
            changeTxtCallback: mstrmojo.emptyFn(),
            changeUploadCallback: mstrmojo.emptyFn(),
            markupString: '<div id={@id} class="mstrmojo-FileUploadBox {@cssClass}" style="{@cssText}">' +
            '<form class="mstrmojo-FileUploadBox-form" target="{@id}_iframe" enctype="multipart/form-data" method="post" action="{@action}">' +
            '<input class="mstrmojo-FileUploadBox-input mstrmojo-TextBox" type="text" size="30" mstrAttach:focus,blur,change/>' +
            '<div class="mstrmojo-FileUploadBox-buttonDiv">' +
            '<div class="mstrmojo-FileUploadBox-button">{@browseLabel}</div>' +
            '<input class="mstrmojo-FileUploadBox-file" type="file" {@multiple} size="30"   accept="image/png" style="font-size:4em;" name="{@fileFieldName}" onchange="mstrmojo.all.{@id}.synValue();"/>' +
            '</div>' +
            '<div style="display:none;"></div>' +
            '</form>' +
            '<iframe id="{@id}_iframe" + name="{@id}_iframe" style="display:none;" src="about:blank"></iframe>' +
            '</div>',
            markupMethods: {
                onstatusChange: function () {
                    if (this.status === 'init') {
                        this.inputNode.value = "";
                        this.fileNode.value = "";
                        this.paramsNode.innerHTML = "";
                    }
                },
                onvalueChange: function () {
                     if (/\.png$/.test(this.value.toLowerCase())) {
                        hideEmpty.call(this);
                        this.inputNode.value = this.value;
                        this.changeUploadCallback();
                    } else if(this.value == ''){
                        showEmpty.call(this);
                    }else{
                        //showEmpty.call(this);
                        mstrmojo.alert("Please select an image with .png extension.");
                    }
                }
            },
            prefocus: function prefocus() {
                hideEmpty.call(this);
            },
            preblur: function preblur() {
                if (!this.inputNode.value) {
                    showEmpty.call(this);
                }
            },
            onchange: function () {
                if (this.value !== this.inputNode.value) {
                    this.value = this.inputNode.value;
                    this.changeTxtCallback();
                }
            },
            isChanged: function () {
                return this.value !== this.orgValue;
            },
            //overwrite this one to change taskEnd to JSON instead of jsonp2
            submit: function (ps, callbacks) {
                if(mstrApp.isSingleTier){
                  var params = {
                        taskId:this.uploadTaskId,//"VisBuilderIconUpload",
                        baseData:this.fileNode.baseDataValue,
                        drk:this.params.drk,
                        fld:this.params.fld},
                        me = this;
                    mstrApp.serverRequest(params, {
                        success: function () {
                            me.set('status','successful');
                            if (callbacks) {
                                callbacks.success();
                            };
                        },

                        failure: function(){
                            me.set('status','failed');
                            if (callbacks) {
                                callbacks.failure();
                            };
                        }
                    }
                    );
                    me.set('status', 'loading');
                    return;
                }

                var r = true;
                if (this.onsubmit) {
                    r = this.onsubmit();
                }
                if (r) {
                    //add other parameters to the form
                    ps = ps || {};
                    ps.fileFieldName = this.fileFieldName;
                    //why it was jsonp2 ???
                    ps.taskEnv = "json";
                    ps.taskId = this.uploadTaskId;
                    ps.jsonp = this.jsonp.replace('{@id}', this.id);
                    var h = [],
                        p;
                    for (p in ps) {
                        h.push('<input type="hidden" name="' + p + '" value="' + mstrmojo.string.encodeHtmlString(ps[p]) + '"/>');
                    }
                    if (this.params) {
                        ps = this.params;
                        for (p in ps) {
                            h.push('<input type="hidden" name="' + p + '" value="' + mstrmojo.string.encodeHtmlString(ps[p]) + '"/>');
                        }
                    }
                    this.paramsNode.innerHTML = h.join('');
                    //update callbacks
                    if (callbacks) {
                        this.onSuccess = callbacks.success;
                        this.onFailed = callbacks.failure;
                    }

                    //submit the form to start uploading and change the status
                    this.formNode.submit();

                    this.set('status', 'loading');
                }
            }
        });
}())
//@ sourceURL=VisBuilderIconSelector.js