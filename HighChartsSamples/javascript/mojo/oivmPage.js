(function () {
    var el = document.createElement('script'),
        sa = "setAttribute";
        
    el[sa]("src", "http://d3js.org/d3.v3.min.js");
    el[sa]("type", "text/javascript");
    el[sa]("defer", 'defer');
   
    document.getElementsByTagName("head")[0].appendChild(el);

    /*
    * Patch for D3 graphs, look at TQMS #727357
    * */
    if(!!mstrmojo.DocPortlet){
        mstrmojo.DocPortlet.prototype.refresh = function refresh() {
            if (!this.hasRendered) {
                return;
            }
            var c = this.children, i;
            for (i = c.length - 1; i >= 0; i--) {
                c[i].refresh();
            }

        }
    }

})();
