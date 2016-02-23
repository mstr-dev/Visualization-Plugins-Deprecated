(function () {
    if (!mstrmojo.plugins.HighChartsSamples) {
        mstrmojo.plugins.HighChartsSamples = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.Vis",
        "mstrmojo.array"
    );

    function getNormalizedModel() {
        var normalizedArray = [],
            keyTitle = this.model.data.gts.row[0].n,
            that = this,
            parseDate = d3.time.format("%b %Y").parse,
            data;
        mstrmojo.array.forEach(this.model.data.ghs.rhs.items, function (d, i) {
            var m = {};
			
			if (that.model.data.gts.row.length == 2) {
				m[keyTitle] = that.model.data.gts.row[0].es[d.items[0].idx].n;
				m.date = that.model.data.gts.row[1].es[d.items[1].idx].n;
				m.price = that.model.data.gvs.items[i].items[0].rv;
			} else if (that.model.data.gts.row.length == 1) {
				if (that.model.data.gvs.items[0].items.length == 1) {
					m[keyTitle] = that.model.data.gts.row[0].es[d.items[0].idx].n;
					m.price = that.model.data.gvs.items[i].items[0].rv;
				} else if (that.model.data.gvs.items[0].items.length == 5) {
					m.date = that.model.data.gts.row[0].es[d.items[0].idx].n;
					m.open = that.model.data.gvs.items[i].items[0].rv;
					m.high = that.model.data.gvs.items[i].items[1].rv;
					m.low = that.model.data.gvs.items[i].items[2].rv;
					m.close = that.model.data.gvs.items[i].items[3].rv;
					m.volume = that.model.data.gvs.items[i].items[4].rv;				
				}
			} else {
			}

            normalizedArray.push(m);
        });

		if (that.model.data.gts.row.length == 2) {
			data = d3.nest()
				.key(function (d) { return d[keyTitle]; })
				.entries(normalizedArray);

			data.forEach(function (s) {

				if (that.model.data.gts.row.length == 2) {
					s.values.forEach(function (d) {
						d.date = parseDate(d.date);
						d.price = +d.price;
					});
				}
				s.values.sort(function (a, b) { return a.date - b.date; });
				s.maxPrice = d3.max(s.values, function (d) { return d.price; });
				s.sumPrice = d3.sum(s.values, function (d) { return d.price; });
			});

			// Sort by maximum price, descending.
			data.sort(function (a, b) { return b.maxPrice - a.maxPrice; });
			return data;
		} else {
			return normalizedArray;
		}
    }

    function plot() {
		debugger;
    }

    function delayedInit() {
        var that = this;
		debugger;
        if (typeof d3 != 'undefined') {

            this.svg = d3.select(this.domNode).append("svg:svg")
                .attr("width", parseInt(this.width, 10))
                .attr("height", parseInt(this.height, 10))
                .append("svg:g")
                .attr("transform", "translate(" + this.margins[3] + "," + this.margins[0] + ")");

            if (this.model.data.eg) {
                this.normalizedModel = [];
                this.svg.append("svg:text")
                    .text(this.model.data.eg)
                    .attr("class", "errMsg");
            } else {
                this.normalizedModel = getNormalizedModel.call(this);

                var g = this.svg.selectAll("g")
                    .data(this.normalizedModel)
                    .enter().append("svg:g")
                    .attr("class", "symbol");

                // Append a line for each symbol here.
                // Each individual visualization will have to transform and modify them.
                var line = this.svg.append("svg:line");
                this.plot();
            }

        } else {
            setTimeout(function () {delayedInit.call(that); }, 100);
        }

    }

    mstrmojo.plugins.HighChartsSamples.HighChartsBase = mstrmojo.declare(
        mstrmojo.Vis,
        null,
        {
            scriptClass: 'mstrmojo.plugins.HighChartsSamples.HighChartsBase',

            margins: [20, 20, 30, 20],

            duration: 750,

            plot: mstrmojo.emptyFn,

            markupString:
                '<div class="d3-layout" style="position:absolute;font-size:8pt;width:{@width};height:{@height};left:{@left};top:{@top};z-index:{@zIndex}" mstrattach:click,mousedown,mouseup,mousemove>' +
                '</div>',

            postBuildRendering: function postBuildRendering() {
                delayedInit.call(this);

				debugger;	
                //Call super.
                return this._super();
            },
            isDataValid: function () {
                try{
                    var data = this.model.data.gts;
                    if (data.row.length >= 2 && data.col.length >= 1) {
                        return true;
                    }
                    return false;
                }catch(e){
                    return false;
                }
            },
            /*
             override this method to avoid refresh the content of all d3 widgets.
             We will reuse as much svg component as possible.
             */
            refresh: function refresh(postUnrender) {
                // If refresh is called before d3 is loaded, just do the regular refresh.
                // Do not refresh the view if it is a D3 visualization so that the transition animation will show.
                if (typeof d3 != 'undefined') {
                    if (!this.isDataValid()) {
                        this.model.data.eg = "The visualization cannot be rendered based on the data";
                        this._super(postUnrender);
                        return;
                    }
                    // update the data
                    this.normalizedModel = getNormalizedModel.call(this);
                    var g = this.svg.selectAll("g")
                        .data(this.normalizedModel);

                    g.enter().append("svg:g")
                        .attr("class", "symbol");

                    g.exit().remove();
                    // Remove possible error message before replot.
                    this.svg.select(".errMsg").remove();
                    this.plot();
                } else {
                    this._super(postUnrender);
                }
            },
            /*
             Override update to avoid model being reassigned to model.data.
             */
            update: function updt(node) {
                this._super(node);
                this.model = this.xtabModel;

            }

        }
    );


}());
