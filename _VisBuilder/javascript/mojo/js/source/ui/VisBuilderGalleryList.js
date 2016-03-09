(function () {
    if (!mstrmojo.plugins._VisBuilder.ui) {
        mstrmojo.plugins._VisBuilder.ui = {};
    }
    mstrmojo.requiresCls("mstrmojo.vi.ui.VizGalleryList");
    var itemMarkup;
    /**
     * Custom list of visualizations for Open window
     *
     * @class mstrmojo.plugins._VisBuilder.ui.VisBuilderGalleryList
     * @extends mstrmojo.vi.ui.VizGalleryList
     */
    mstrmojo.plugins._VisBuilder.ui.VisBuilderGalleryList = mstrmojo.declare(
        mstrmojo.vi.ui.VizGalleryList,
        null,
        {
            scriptClass: "mstrmojo.plugins._VisBuilder.ui.VisBuilderGalleryList",
            init: function init(props) {
                this._super(props);
                //hide New Visualization from this list
                if(this.items[0] && this.items[0].id==='VisBuilderNew'){
                    this.items =  this.items.splice(1);
                }
            },
            getItemMarkup: function getItemMarkup(item) {
                if (!itemMarkup) {
                    //we want to have name of visualization back in markup
                    itemMarkup = this._super(item).replace('<div><div></div></div>', '<div><div></div></div><p>{@n}</p>');
                }
                return itemMarkup;
            }
        }
    );
}());
//@ sourceURL=VisBuilderGalleryList.js