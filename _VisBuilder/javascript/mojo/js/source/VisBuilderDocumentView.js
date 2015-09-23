(function(){
    /**
     * Overwrites / extends mstrmojo.vi.ui.DocumentView
     * Hides sheet section - selector node to 0
     */
    if (!mstrmojo.plugins._VisBuilder) {
        mstrmojo.plugins._VisBuilder = {};
    }
/**
    fake object to replace selector - we do not want to have selector on bottom page but OOTB code assumes that it is there
    object has all or at least most of functions used by ootb code but they are empty
*/
    var fakeSelector = {
        deleteTab:function(){
        },
        setTabs:function(){
        },
        set:function(){
        },
        hasRendered:function(){
            return false;
        },
        removeChildren:function(){
        },
        setStatic:function(){
        },
        moveTab:function(){
        }
    };

    mstrmojo.requiresCls("mstrmojo.vi.ui.DocumentView");
    mstrmojo.plugins._VisBuilder.VisBuilderDocumentView = mstrmojo.declare(
        mstrmojo.vi.ui.DocumentView,
        null,
        {
            scriptClass: 'mstrmojo.plugins._VisBuilder.VisBuilderDocumentView',
            layoutConfig: {
                h: {
                    containerNode: '100%',
                    selectorNode: '0px'
                },
                w: {
                    containerNode: '100%',
                    selectorNode: '100%'
                },
                xt: true
            },
            selector :  fakeSelector,
            init:function(props){
                this._super(props);
                this.selector = fakeSelector;
            }
        }
    );
    mstrmojo.vi.ui.DocumentView = mstrmojo.plugins._VisBuilder.VisBuilderDocumentView;
}())