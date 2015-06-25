(function() {
	//Custom mojo visualization requires Vis library to render, and in this case LoadedExternalJSURLs to load 3rd party JS files
	mstrmojo.requiresCls("mstrmojo.Vis", "mstrmojo.LoadedExternalJSURLs");
	/**
	 * A Vis Google Charts - Microstrategy data with Google Charts code
	 * @extends mstrmojo.Vis
	 */
	//Declaration of the plugin
	mstrmojo.plugins['D3BubbleChart'] = mstrmojo.plugins['D3BubbleChart'] || {};
	//Declaration of the visualization object
	mstrmojo.plugins.D3BubbleChart.D3BubbleChartVis = mstrmojo.plugins.D3BubbleChart.D3BubbleChartVis|| mstrmojo
			.declare(
					// superclass
					mstrmojo.Vis,
					// mixins
					[ "mstrmojo.LoadedExternalJSURLs" ],
					{
						scriptClass : 'mstrmojo.plugins.D3BubbleChart.D3BubbleChartVis',
						model : null,
						/**
						 * markupString is a structure of a div to
						 * create as a placeholder for charts id is
						 * important since will be passed in to Google code
						 * as reference to div to append results
						 */
						markupString : '<div id="{@id}" style="top:{@top};left:{@left};position:absolute;overflow:none;"></div>',
						/**
						 * code is ready lets prepare data
						 */
						postBuildRendering : function () {
							if (this._super) {
								this._super();
							}
							this.domNode.style.width = parseInt(this.width)	+ 'px';
							this.domNode.style.height = parseInt(this.height)+ 'px';
							// loading required google code
							this.load3rdPartyScripts();
						},
						/**
						 * load Google visualization library
						 */
						load3rdPartyScripts : function() {
							// array of required JS files
							var scriptsObjectArray = [];
							scriptsObjectArray.push({url : "../plugins/D3BubbleChart/javascript/d3.v3.min.js"});
							var me = this;
							// load required external JS files and after that run renderGraph method
							this.requiresExternalScripts(scriptsObjectArray, function() {
						    	 // Load  visualization with callback to run when the D3 Visualization API is loaded.
								me.renderGraph();
							});
						},
						/**
						 * At this point we have Google library and we can render graph
						 */
						renderGraph : function(){
							//var data = new google.visualization.DataTable(this.model.data);
				            // Set chart options
				            var options = {'width':this.width,'height':this.height};
					        // Instantiate Chart with Dom element to attach to 
				            debugger;
				            var placeHolder= this.domNode;
				            var data=this.model.data; 
				            
				            var legend=1;
				            var colorBy=0;
				            
				            if(microstrategy.bones[this.containerid].visProps){
				            	legend= Number(microstrategy.bones[this.containerid].visProps.legend);
								colorBy= microstrategy.bones[this.containerid].visProps.colorby;
				            }				            
				            
				            var bubbleWidth=options.height;
				            var legendWidth=0;
				            if(legend==1){
						
				            	if(options.width*0.8>options.height){
				            		bubbleWidth=options.height;
				            		legendWidth=options.width-bubbleWidth;
				            	}
				            	else{
				            		bubbleWidth=options.width*0.8;
				            		legendWidth=options.width*0.2;
				            	}

				            }
				            
				            var diameter =  Math.min(bubbleWidth, options.height),
					            format = d3.format(",d"),
					            color = d3.scale.category10();
					            //color = d3.scale.category20();
					        	//color = d3.scale.category20b();
					        	//color = d3.scale.category20c();

					        var bubble = d3.layout.pack()
					            .sort(null)
					            .size([bubbleWidth, options.height])
					            .padding(1.5);
	
					        var svg = d3.select(placeHolder).append("svg")
					            .attr("width", diameter)
					            .attr("height", diameter)
					            .attr("class", "bubble");
					            

					        var root = data;
					        
					        root=bubble.nodes(classes(root));

					          var node = svg.selectAll(".node")
					              .data(root.filter(function(d) { return !d.children; }))
					              .enter().append("g")
					              .attr("class", "node")
					              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	
					          node.append("title")
					              .text(function(d) { return d.className + ": " + format(parseInt(Number(d.value))); });
	
					          node.append("circle")
					              .attr("r", function(d) { return d.r; })
					              .style("fill", function(d) {
					            	  if (colorBy == 0)	return color(d.packageName); 
					            	  else if (colorBy ==1) return color(d.className); 
					            	  else return color(d.packageName); 
					            	  });
					              //.style("fill", function(d) { return color(d.packageName); });
	
					          node.append("text")
					              .attr("dy", ".3em")
					              //.attr("font-size",function(d){ return (d.r/3).toString()+"px";})
						      .style("font-size","small")
					              .style("text-anchor", "middle")
					              .text(function(d) { return d.className.substring(0, d.r / 3); });
					          
					        if(legend==1){
					          var legendCount =0;
						  legendWidth=legendWidth-20;
				                  var legendPlaceHolder=d3.select(placeHolder).append("div")
                                                    .style("width", legendWidth+"px")
					            .attr("id","legendplaceholder")
					            .style("padding-left","20px")
					            .style("top","0")
					            .style("position","relative")
					            .style("height",options.height+"px")
					            .style("display","inline-block")
						    .style("vertical-align", "top");
					          var legendSvg = d3.select("#legendplaceholder").append("svg")
					            .style("height", options.height+"px");

					          var lastElement="";
					          var legends = legendSvg.selectAll(".legend")
				                 .data(root.filter(function(d) { return !d.children; })
						              .filter(function(d){
						            	  if(colorBy==0){
						            		  if(d.packageName==lastElement) {return false;}
							            	  else {lastElement=d.packageName; return true;}
						            	  }
						            	  else{
						            		  if(d.className==lastElement) {return false;}
							            	  else {lastElement=d.className; return true;}
						            	  }
						              }))
						              .enter().append("g")
						              .attr("class", "legend")
						              .attr("transform", function(d) { 
						            	  legendCount++;
						            	  return "translate(10,"+((legendCount-1)*20+10)+")";
					                  });
					          legendSvg.style("height",legendCount*20+"px");
						  if((legendCount-1)*20+10>options.height){
                                                      legendPlaceHolder.style("overflow-y", "scroll");
                                                  }
					          legends.append("circle")
					            .attr("r", 5)
					            .style("fill",function(d) {
					            	  if(colorBy==0){
					            		  return color(d.packageName);
					            	  }
					            	  else{
					            		  return color(d.className);
					            	  }
    			            	          });
					          
					          legends.append("text").text(function(d){
					        	  if(colorBy==0){
				            		  return d.packageName;
				            	  }
				            	  else{
				            		  return d.className;
				            	  }
					          }).attr("x","15px").attr("y","4px").style("font-size","small");
					          
					        }  
					          

					        // Returns a flattened hierarchy containing all leaf nodes under the root.
					        function classes(root) {
					          var classes = [];
	
					          function recurse(name, node) {
					            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
					            else classes.push({packageName: name, className: node.name, value: node.size});
					          }
	
					          recurse(null, root);
					          return {children: classes};
					        }
	
					        d3.select(self.frameElement).style("height", diameter + "px");

                                            }

					});
		})();
