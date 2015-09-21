(function () {

    mstrmojo.requiresCls('mstrmojo.plugins.VisMicroChart.VisTooltip');

    var $CSS = mstrmojo.css;

    /**
     * @class
     * @extends {mstrmojo.plugins.VisTooltip}
     */
    mstrmojo.plugins.VisMicroChart.VisMicroChartTooltip = mstrmojo.declare(

        mstrmojo.plugins.VisMicroChart.VisTooltip,

        null,

        /**
         * @lends mstrmojo.plugins.VisMicroChartTooltip.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins.VisMicroChart.VisMicroChartTooltip',

            show: false,

            adjustBulletNameDisplay: function adjustBulletNameDisplay() {
                // Iterate row tags.
                this.domNode.getElementsByTagName('tr').forEach(function (tableRow) {
                    var firstCell = tableRow.cells[0],
                        containerDiv = firstCell.firstChild,
                        legend = containerDiv.firstChild,
                        style = $CSS.getComputedStyle(legend),
                        legendStyle = legend.style,
                        marginLeft = (firstCell.offsetWidth - legend.offsetWidth - containerDiv.lastChild.offsetWidth - parseInt(style.marginRight, 10)) + 'px',
                        marginTop = Math.round((firstCell.offsetHeight - parseInt(style.height, 10)) / 2) + 'px';

                    legendStyle.marginLeft = marginLeft;
                    legendStyle.marginTop = marginTop;
                });
            },

            setBorderColor: function setbc(color){
            	this.domNode.style.borderColor = color;
            },

            toggle: function toggle(show){
                this._super(show);

                this.show = !!show;
              	this.domNode.style.visibility = show ? 'visible' : 'hidden';
            }
        }
    );

}());//@ sourceURL=VisMicroChartTooltip.js