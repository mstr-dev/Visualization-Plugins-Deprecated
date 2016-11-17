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
    var  widget;

    mstrmojo.requiresCls("mstrmojo.Container", "mstrmojo.FileUploadBox", 'mstrmojo.TextBox', 'mstrmojo.Image', 'mstrmojo.vi.ui.rw._ValidInputLocalImage');
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
                                '<label class="mstrmojo-FileUploadBox-buttonDiv" >' +
                                    '<input class="mstrmojo-FileUploadBox-file" type="file" {@multiple} size="30"   accept="image/png" style="position: absolute; left: -10000px; font-size:4em; width: 30px" name="{@fileFieldName}" onchange="mstrmojo.all.{@id}.synValue();"/>' +
                                    '<div class="mstrmojo-FileUploadBox-button" ></div>' +
                                '</label>' +
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

            children: [
                mstrmojo.Button.newWebButton("...", function (){
                        if (mstrApp.isSingleTier) {
                            widget = this.parent;
                            var formWrapper = window.FormWrapper;
                            formWrapper.openImageFileDialog("mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSelector.onOneTierFileSelected");
                        }
                    }, false,
                    {
                        alias: "browseBtn",
                        slot: 'buttonNode',
                        enabled: true
                    })
            ],

            markupSlots: {
                formNode: function(){return this.domNode.firstChild;},
                inputNode: function(){return this.domNode.firstChild.firstChild;},
                fileNode: function(){return this.domNode.firstChild.childNodes[1].firstChild;},
                buttonNode: function(){return this.domNode.firstChild.childNodes[1].childNodes[1];},
                paramsNode: function(){return this.domNode.firstChild.lastChild;}
            },

            /**
             * <p>Extends the rendering cycle to trigger the rendering of child widgets, if any.</p>
             *
             * <p>This method triggers the rendering of this container's children after the container's domNode
             * has been rendered but BEFORE the container's "hasRendered" property is set to true.</p>
             */
            postBuildRendering: function postBuildRendering() {
                if (this._super() !== false) {
                    widget = this;

                    // If we have a "children" config, initialize our children.
                    if (this.children) {
                        this.initChildren();
                    }
                    this.renderChildren();
                    // Override the return value to show that we rendered.
                    return true;
                }

                return false;
            },


            /**
             * <p>Asks all children who are ready for rendering to render now.</p>
             *
             * <p>Container's implementation of renderChildren renders
             * all the children immediately who pass the "childRenderCheck" filter.
             * Subclasses of Container can enhance/overwrite this behavior to support alternative rendering modes.
             */
            renderChildren: function renderChildren() {
                var ch = this.children,
                    len = (ch && ch.length) || 0,
                    i;

                for (i = 0; i < len; i++) {
                    var c = ch[i];
                    if (this.childRenderCheck(c)) {
                        c.render();
                    }
                }
            },

            /**
             * <p>Returns true if a given child is ready to be rendered.</p>
             *
             * <p>A child is considered ready if:</p>
             * <ol>
             * <li>the child has not rendered yet, and</li>
             * <li>the child's "slot" property corresponds to a non-null slot in this Container.</li>
             * </ol>
             *
             * <p>The slot check was important because a container may choose to
             * deliberately omit a slot so that certain children won't render.</p>
             *
             * @param {mstrmojo.Widget} c The child widget to be checked.
             *
             * @returns {Boolean} true if the child is ready to be rendered; false otherwise.
             */
            childRenderCheck: function childRenderCheck(c) {
                if (c && !c.hasRendered) {
                    var s = c.slot || this.defaultChildSlot;
                    return !!this[s];
                }
                return false;
            },


            /**
             * <p>Inserts a given child widget's DOM into a slot of this container. Once all children are
             * rendered, raises a "childrenRendered" event.</p>
             *
             * <p>The target slot name is determined by the child's "slot" property (if missing,
             * this container's "defaultChildSlot" property value is assumed).</p>
             *
             * <p>If the targeted slot is not defined in the current rendering, the child widget's domNode is
             * simply removed from DOM until future use.
             * If the targeted slot is defined, the child's domNode will be appended to
             * the slot node, unless this Container's "preserveChildDomOrder" property is
             * true; if so, the child's domNode will be inserted at the child index corresponding
             * to the child's order in this container's "children" array.</p>
             *
             * @param {mstrmojo.Widget} child The child whose rendering is to be inserted.
             */
            onchildRenderingChange: function onchildRenderingChange(child) {
                var d = child && child.domNode;
                if (!d) {
                    return;
                }

                // Compare the domNode's parentNode to the slot node it belongs under.
                var defaultChildSlot = this.defaultChildSlot,
                    childSlot = child.slot || defaultChildSlot,
                    slot = this[childSlot],
                    children = this.children;

                if (!slot) {
                    // No slot found. Remove child domNode from DOM.
                    if (d.parentNode) {
                        d.parentNode.removeChild(d);
                    }
                } else {
                    // We have a slot. Is the domNode already inserted into the slotNode?
                    // TO DO: Do we really need this parentNode check? What happens if you try to call node.parentNode.appendChild(node)?
                    if (d.parentNode === slot) {
                        return;
                    }
                    // Insert the domNode; compute the insertion index.
                    if (!this.preserveChildDomOrder) {
                        // Append the domNode, insertion index is irrelevant.
                        slot.appendChild(d);
                    } else {
                        // Compute an insertion position. Find the domNode of the last preceding child in the same slot (if any).
                        var sib,
                            i;

                        for (i = children.length - 1; i >= 0; i--) {
                            var c = children[i];

                            // Is this the rendered child?
                            if (c === child) {
                                // We've found the child so the last sib value is it's sib.
                                break;
                            }

                            // Is this child in the same slot as the rendered child?
                            if (childSlot === (c.slot || defaultChildSlot)) {
                                // Does it have a domNode?
                                var cNode = c.domNode;

                                // Does the parent of the domNode match the slotNode?
                                if (cNode && cNode.parentNode === slot) {
                                    // This is the node of the child that should appear after the rendered child.
                                    sib = cNode;
                                }
                            }
                        }

                        // Do we have a child that should appear after the rendered child?
                        if (sib) {
                            // Yes, then insert the child before that node.
                            slot.insertBefore(d, sib);
                        } else {
                            // No, then append the child to the slot node.
                            slot.appendChild(d);
                        }
                    }
                }

                // Raise a "childrenRendered" if all children are now rendered.
                if (mstrmojo.publisher.hasSubs(this.id, "childrenRendered")) {
                    var childrenLength = children.length,
                        k;

                    // Iterate my children
                    for (k = 0; k < childrenLength; k++) {
                        // Does the domNode NOT exist?  We check for the existence of the domNode rather than the isRendered flag because at this point, the
                        // isRendered flag has not been set yet.
                        if (!children[k].domNode) {
                            // No, then no reason to raise event.
                            return;
                        }
                    }

                    // All children are rendered so raise the event.
                    this.raiseEvent({
                        name: "childrenRendered"
                    });
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

    //Call back for onetier upload file
    mstrmojo.plugins._VisBuilder.ui.VisBuilderIconSelector.onOneTierFileSelected = function (res) {
        if (res && res.data && res.filename) {
            var BASE64_MARKER = ';base64,',
                parent = widget.parent,
                preview = parent.preview, selector = parent.selector,
                data = res.data;

            //in case the response one tier send back dosen't contain BASE64 MARKER
            if (res.data.indexOf(BASE64_MARKER) === -1) {
                res.data = 'data:image/jpeg;base64,' + res.data;
            }


            hideEmpty.call(widget);
            widget.inputNode.value = res.filename;
            parent.iconType = 2;//Enum_ICON_TYPE.UPLOAD

            if(mstrApp.isSingleTier){
                selector.fileNode.baseDataValue = data;
            }
            preview.set('src', data);
            preview.set('cssClass', 'VisBuilderIconSectionIMG UploadedImage');
        }
    };

}())
//@ sourceURL=VisBuilderIconSelector.js