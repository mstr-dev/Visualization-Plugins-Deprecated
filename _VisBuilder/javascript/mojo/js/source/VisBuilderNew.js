(function () {
    if (!mstrmojo.plugins._VisBuilder) {
        mstrmojo.plugins._VisBuilder = {};
    }
    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.vi.ui.rw.Xtab"
    );
    /**
     * Base code for new visualization
     */

    mstrmojo.plugins._VisBuilder.VisBuilderNew = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.VisBuilderNew",
            id: "newVis",
            cssClass: "VisBuilderNew",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [],
            useRichTooltip: false,
            plot: function () {
            }
        }
    );

}());