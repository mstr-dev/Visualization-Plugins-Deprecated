(function () {
    mstrmojo.requiresCls(
        "mstrmojo.Box",
        "mstrmojo._HasOwnAvatar",
        "mstrmojo.css",
        "mstrmojo.dom");

    var $CSS = mstrmojo.css,
        $DOM = mstrmojo.dom;

    /**
     * Return the target threshold row using mouse event node.
     *
     * @param {Object} context
     * @returns {mstrmojo.threshold.ThresholdRow}
     */
    function getTargetRow(context) {
        var node = context.src.node,
        // Find which row contains the mouse over node.
            rows = this.children.filter(function (thresholdRow) {
                return $DOM.contains(thresholdRow.domNode, node, true, this.domNode);
            });

        return rows[0];
    }

    /**
     * Find where to insert the DnD row.
     *
     * @param {Object} context
     * @returns {int}
     */
    function getIndexByMousePosition(context) {
        var tgt = context.tgt,
            rows = this.children,
            mousePos = $DOM.getMousePosition(tgt.e, tgt.hWin),
            insertRowPos,
            insertRowIdx,
            row,
            insertRowY,
            insertRowH,
            midY,
            mouseY = mousePos.y;

        // Loop all the existing rows and find where the mouse over.
        for (var i = rows.length - 1; i >= 0; i--) {
            row = rows[i];
            insertRowPos = $DOM.position(row.domNode);

            insertRowH = insertRowPos.h;
            insertRowY = insertRowPos.y;
            midY = insertRowY + insertRowH / 2;

            // If mouse over the below half of the row, insert after this row. Otherwise, insert before this row.
            if (midY < mouseY && (i === rows.length - 1 || mouseY <= insertRowY + insertRowH)) {
                insertRowIdx = i;
                break;
            } else if ((i === 0 || insertRowY < mouseY) && mouseY <= midY) {
                insertRowIdx = i - 1;
                break;
            }
        }

        return insertRowIdx;
    }

    /**
     * Return ENUM_EDGE_TOP if idx equals -1, otherwise return ENUM_EDGE_BOTTOM.
     *
     * @param {int} idx
     */
    function getCSSClassByIndex(idx) {
        return idx === -1 ? 'top' : 'bottom';
    }

    /**
     * <p>The panel that contains DropZoneRow. Mixed in _HasOwnAvatar to enable DnD and reorder.</p>
     *
     * @class
     * @extends mstrmojo.Box
     * @mixes mstrmojo._HasOwnAvatar
     */
    mstrmojo.plugins._VisBuilder.DropZoneRowPanel = mstrmojo.declare(
        mstrmojo.Box,

        [ mstrmojo._HasOwnAvatar],

        /**
         * @lends mstrmojo.plugins._VisBuilder.DropZoneRowPanel.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins._VisBuilder.DropZoneRowPanel',

            dropZone: true,

            draggable: true,

            restrictedToAxis: 'y',

            avatarCssClass: 'dropzone-drag-avatar',

            slot: "zonesNode",

            getDragData: function getDragData(context) {
                return {
                    row: getTargetRow.call(this, context)
                };
            },

            createAvatar: function createAvatar(node, context) {
                var avatar = context.src.data.row.domNode.cloneNode(true);

                // Align the avatar with the panel.
                avatar.style.left = $DOM.position(this.domNode).x + 'px';

                return avatar;
            },

            isDragValid: function isDragValid(context) {
                var targetRow = context.getCtxtDragData().row;

                // Does the panel only contain one row OR wasn't there a target row OR the target node isn't the draggable node?
                return !(this.children.length === 1 || !targetRow || (targetRow.draggableNode !== context.src.node && targetRow.draggableElementNode !== context.src.node)) || this._super(context);
            },

            ondragstart: function (context) {
                // Call super so that avatar is created first.
                this._super(context);

                // Hide the dragged row.
                this.removeChildren(context.getCtxtDragData().row);
            },

            ondragmove: function ondragmove(context) {
                var dragData = context.getCtxtDragData(),
                    rows = this.children,
                    insertRowIdx = getIndexByMousePosition.call(this, context);

                var lastRowIdx = dragData.lastRowIdx;
                if (lastRowIdx !== insertRowIdx) {

                    // Remove the highlight CSS Class.
                    if (lastRowIdx !== undefined) {
                        $CSS.removeClass(rows[Math.max(lastRowIdx, 0)].domNode, getCSSClassByIndex(lastRowIdx));
                    }

                    // Add CSS class to highlight the border.
                    $CSS.addClass(rows[Math.max(insertRowIdx, 0)].domNode, getCSSClassByIndex(insertRowIdx));

                    // Cache the row index.
                    dragData.lastRowIdx = insertRowIdx;
                }

                // Call super.
                this._super(context);
            },

            ondragend: function ondragend(context) {

                var dragData = context.src.data,
                    i = dragData.lastRowIdx;

                // On drag end, remove border highlight.
                if (i !== undefined) {
                    $CSS.removeClass(this.children[Math.max(i, 0)].domNode, getCSSClassByIndex(i));
                }

                this._super(context);

                // Update the content.
                //TODO: change to dropzone editor content
                this.parent.model.moveZone(context.getCtxtDragData().row.idx, i + 1);
            }
        }
    );
}());
