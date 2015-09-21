(function(){

	 mstrmojo.requiresCls("mstrmojo.dom");

	var $DOM = mstrmojo.dom;

	var TEXTMARGIN = 5; //This is to put sapce from left side of chart when drawing label
	/**
     * Variable to control drawing start point arc
     */
	var D_S_P = 1;
	/**
     * Variable to control drawing end point arc
     */
	var D_E_P = 2;
	/**
	 * xiawang: This is used by MicroChart
	 * Variable to control drawing other point art
	 */
	var D_O_P = 4;

	var T_Z_A = 0;

	var needAdjust = true;

	var ZoomFactor = 0;


	/**
	 * Variable that contains total milliseconds in day
	 */
	var millisOnDay = 86400000;

	mstrmojo.plugins.VisMicroChart.VisChartUtils = mstrmojo.provide(
        "mstrmojo.plugins.VisMicroChart.VisChartUtils",
        /**
         * @lends mstrmojo.plugins.VisChartUtils
         */
        {
        	getScreenZoomFactor: function getScrnZmFctr(){
        		if(ZoomFactor == 0){
        			/*if(mstrMobileApp){
        				var dpi = mstrMobileApp.getDeviceDPI();
        				console.log("dpi:"+dpi);
    	        		ZoomFactor = dpi/160;
        			}else{*/
        				ZoomFactor = 1;
        			//}

        		}
        		return ZoomFactor;
        	},

        	changeElementSize: function chngfntsz(el,prop,zf){

        		if(prop == 'fontSize' || prop == 'height' || prop == 'line-height'){
        			var propValue = mstrmojo.css.getStyleValue(el,prop);
	        		var intSize = Math.round(zf*parseInt( propValue ));
	        		//el.style[prop] = ""+ Math.round(zf*intSize)+ size.slice(size.length -2 );

	        		el.style[prop] = intSize + "px";
	        	//	console.log(prop+"change frome: "+size+" to:"+el.style[prop]);
        		}else if(prop == 'font'){
        			var fontSize = mstrmojo.css.getStyleValue(el,'fontSize');
        			var intSize = Math.round(zf*parseInt( fontSize ));
        			var fontWeight = mstrmojo.css.getStyleValue(el,'fontWeight');
        			var fontFamily = mstrmojo.css.getStyleValue(el,'fontFamily');
        			el.style.font = fontWeight+ " "+ intSize+"px " + fontFamily;
        			//	console.log(prop+"change frome: "+size+" to:"+el.style[prop]);
        		}
        	},

        	rgbaStr2rgba: function C_rgbaStr2rgba(color) {
                var rgba = null;
                color = color.replace(/ /g, ''); //get rid of the possible blank space
                var i = color.indexOf('rgba');
                if (i >= 0) {
                    color = color.substring(i + 5, color.length - 1);
                    rgba = color.split(',');
                }
                return rgba;
            },

            /**
             *fills the canvas' base context with the theme color, adds a gloss gradient
             * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
             */
            fillBackground: function fllBckgrnd(widget, width, height, context, opacity) {

                //local vars
                var cntx = context || widget.context,
                    wd = width || widget.canvas.width,
                    ht = height || widget.canvas.height,
                    themeColor = widget.themeColor || '#000000', // if theme color was not defined than use black as default
                    gradient = null,
                    opc = opacity || 1;

				if(!cntx){
					//console.log("can't get context! cntx = widget.canvas.getContext('2d')")
					cntx = widget.canvas.getContext('2d');
					if(!cntx){
						//console.log("can't get context for widget:")
						return;
					}
				}
                cntx.save();

                if (widget.noBackground) {
                	// xiawang: if the widget says no background, do nothing
                } else if(!widget.isAndroid && !widget.isTimeSeries) {

                	gradient = cntx.createLinearGradient(0, 0, 0, ht / 2);

                	//set context settings
                	cntx.fillStyle = themeColor;
                	cntx.fillRect(0, 0, wd, ht);

                	//add gloss

                	cntx.globalAlpha = 0.4;

                	gradient.addColorStop(0, '#fff');
                	gradient.addColorStop(0.1, '#fff');
                	gradient.addColorStop(1, themeColor);


                	cntx.fillStyle = gradient;
                	cntx.rect(0, 0, wd, ht / 2);
                	cntx.fill();


                	cntx.globalAlpha = 0.1;
                	cntx.fillStyle = '#fff';
                	cntx.fillRect(0, 0, wd, ht / 2);
                } else if(widget.isTimeSeries) {
                	var formatProp = widget.formatProp;

            		gradient = cntx.createLinearGradient(0, 0, 0, ht);
                	//add gloss
                	cntx.globalAlpha = formatProp.backgroundAlpha;

//                	var topGradient = this.rgb2rgbStr(formatProp.backgroundClr, 0.83) || '#2c2c2c';
//     			    var bottomGradient = this.rgb2rgbStr(formatProp.backgroundClr) || '#000000';
//					gradient.addColorStop(0, topGradient);
//                	gradient.addColorStop(1, bottomGradient);
                	cntx.fillStyle = this.rgb2rgbStr(formatProp.backgroundClr) || '#000000';
                	cntx.rect(0, 0, wd, ht);
                	cntx.fill();

                }else {
                	cntx.globalAlpha = opc;
                	cntx.fillStyle = themeColor;
                	cntx.fillRect(0, 0, wd, ht);
                }

                cntx.restore();

            },

            rgb2rgbStr: function rgb2rgbStr(rgb, opc){
            	var result = '';

            	if(!rgb || rgb.length != 3){
            		return result;
            	}

            	if(opc || opc == 0){
            		result = 'rgba('+ rgb[0] + ','+rgb[1]+','+rgb[2]+','+opc+')';
            	}else{
            		result = 'rgb('+ rgb[0] + ','+rgb[1]+','+rgb[2]+')';
            	}

            	return result;
            },

            /*
             * return a new rgb array, which is calculated by using the opacity and background color white
             * rgb: the rgb color for under the opacity layer
             * rgb2: the rgb color for the opacity layer, default to [255,255,255]
             */
            getRGBWithOpacity: function getRGBWithOpacity(rgb, opacity, rgb2){
            	if(isNaN(opacity)){
            		return;
            	}

            	if(!rgb2){
            		rgb2 = [255, 255, 255];
            	}

            	var resultRGB = [];

            	for(color in rgb){
            		resultRGB[color] = parseInt( rgb[color]*(1 - opacity) + rgb2[color]*opacity );
				}
            	return resultRGB;
            },

            fillMasterChartBackground: function fillMasterChartBackground(widget, topX, topY, width, height, bottomY, context){
				 //local vars
			     var cntx = context || widget.context,
			         wd = width || widget.canvas.width,
			         ht = height || widget.canvas.height,
			         themeColor = widget.themeColor,
			         gradient = null;

			     var formatProp = widget.formatProp;

			    cntx.save();
			    cntx.globalAlpha = formatProp.backgroundAlpha;
			    cntx.fillStyle = this.rgb2rgbStr(formatProp.backgroundClr) || '#000000';
				cntx.fillRect(0, 0, wd, topY + height + bottomY);

				/**
				 * iOS7: No gradient overlay on top
				 *
				//add gloss
				gradient = cntx.createLinearGradient(0, 0, 0, ht/2);
			    var topGradient = this.rgb2rgbStr( this.getRGBWithOpacity(formatProp.backgroundClr, 0.45) ) || '#737373';
			    var bottomGradient = this.rgb2rgbStr( this.getRGBWithOpacity(formatProp.backgroundClr, 0.13) ) || '#222222';
				gradient.addColorStop(0, topGradient);
				gradient.addColorStop(1, bottomGradient);
				cntx.fillStyle = gradient;
				cntx.fillRect(topX, topY, wd, ht/2 );

				cntx.fillStyle = this.rgb2rgbStr(formatProp.backgroundClr) || '#000000';
				cntx.fillRect(topX, topY + ht/2, wd, ht/2 + bottomY);
				*/

				//draw the dividing line
				cntx.globalAlpha = 1;
				cntx.strokeStyle = this.rgb2rgbStr ( widget.formatProp.textClr, 0.50 );
				cntx.lineWidth = 1;
				//top dividing line
				var lineY = topY +0.5;
				this.drawLineSet(this, [{
	                x: topX,
	                y: lineY
	            }, {
	                x: topX + wd,
	                y: lineY
	            }], false, cntx);
				//bottom dividing line
				//var lineY = Math.floor(topY+ ht) < topY+ ht ? Math.floor(topY+ ht) + 0.5 : topY+ ht - 0.5;
				lineY = topY + ht - 0.5;
				this.drawLineSet(this, [{
	                x: topX,
	                y: lineY
	            }, {
	                x: topX + wd,
	                y: lineY
	            }], false, cntx);

				cntx.restore();
          },

			/*
			 * Draw a line according to the given array, if the array is too large then make it into N-pass drawing
			 * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
			 * @param {Array} [lines] an array of points for the line to draw
			 * @param {Boolean} [fill] indicates whether the line will be a closed polygon
			 * @param {CanvasContext2D} [context] the context object to use
			 * @param {Number} [split] maximal number of points per drawing
			 */
			drawLineSetWithSplit: function(widget, lines, fill, context, split) {
				var n = lines.length, // number of points
					np = Math.ceil(n / split), // number of pass
					start, end;
				for (var i = 0; i < np; i++) {
					start = i * split; // inclusive
					end = Math.min(start + split + 1, n); // exclusive
					this.drawLineSet(widget, lines.slice(start, end), fill, context);
				}
			},

            /**
             * Draws a line given a privided array of points
             * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
             * @param {Array} [lines] an array of points for the line to draw
             * @param {Boolean} [fill] indicates whether the line will be a closed polygon
             * @param {CanvasContext2D} [context] the context object to use
             */
			drawLineSet: function drwlnst(widget, lines, fill, context) {

                //local vars
				var cntx = null,
					l = lines.length,
					li = null;

                //local context
                if (context) {
                    cntx = context;
                } else {
                    cntx = widget.context;
                }

            	//TQMS 661017: handle the chart which is composed of single point
            	var lastPoint = null,
            		moveToPoint = false;

                //begin the line, position the first point
				cntx.beginPath();
				var i = 0;
				while(i < l) {
					if(lines[i]) {
						cntx.moveTo(lines[i].x, lines[i].y);
						lastPoint = lines[i];
						moveToPoint = true;
						i++;
						break;
					}

					i++;

				}
				//#494324 If null points are sent do not lineTo next point but move to next point so that line is cut off and
				// not drawn between the points which contains null data in between.
				var skip = false;
				for(;i<l;i++) {
					li = lines[i];
					if(li) { // skip the points that are null
						if(!skip) {
							cntx.lineTo(li.x, li.y);
							moveToPoint = false;
						} else {
							cntx.moveTo(li.x, li.y);
							moveToPoint = true;
							lastPoint = li;
							skip = false;
						}
					} else {
						if(!skip){
							skip = true;
							if(moveToPoint){
									//draw last single point
									cntx.arc(lastPoint.x,lastPoint.y, 1, 0, Math.PI * 2, false);
							}
						}
					}
				}

                //close polygon or open line
				if (fill) {
					cntx.closePath();
					cntx.fill();
				} else {
					cntx.stroke();
				}
			},

			//calculate the highest point in the lines
			getMinYPosition: function getMinYPosition(lines, start, end){
				var i = start,min;
				while(i <= end){
					if(lines[i]){
						min = lines[i].y;
						break;
					}
					i++;
				}
				for(i = start; i <= end;i++){
					if(lines[i]){
						min = Math.min(min,lines[i].y);
					}
				}
				return min;
			},

			drawLineAreaWithSplit: function (widget, lines, start, end, bottomY, rgbClr, context, split) {
				var n = end - start + 1, // number of points
					np = Math.ceil(n / split), // number of pass
					p1, p2;
				for (var i = 0; i < np; i++) {
					p1 = start + i * split; // inclusive
					p2 = Math.min(p1 + split, start + n - 1); // inclusive
					this.drawLineArea(widget, lines, p1, p2, bottomY, rgbClr, context);
				}
			},

			/**
	             * Draws a line given a privided array of points and filled the area below the line
	             * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
	             * @param {Array} [lines] an array of points for the line to draw
	             * @param {Boolean} [fill] indicates whether the line will be a closed polygon
	             * @param {CanvasContext2D} [context] the context object to use
	             */
			drawLineArea: function drwlnst(widget,lines, start, end, bottomY, rgbClr, context) {
				//local vars
				var cntx = null,
					l = lines.length,
					li = null,
					startBottomX = 0,
					endBottomX = 0;

		        //local context
		        if (context) {
		            cntx = context;
		        } else {
		            cntx = widget.context;
		        }

		        //TQMS 661017: handle the chart which is composed of single point
            	var lastPoint = null,
            		moveToPoint = false;

		        cntx.save();

		        cntx.lineWidth = 0;
		        //begin the line, position the first point
				cntx.beginPath();
				var i = start, startIndex;
				while(i <= end) {
					if(lines[i]) {
						startBottomX = lines[i].x;
						cntx.moveTo(startBottomX, bottomY);
						lastPoint = lines[i];
						moveToPoint = true;
						break;
					}
					i++;
				}
				startIndex = i;
				//#494324 If null points are sent do not lineTo next point but move to next point so that line is cut off and
				// not drawn between the points which contains null data in between.
				var skip = false;
				for( ;i<=end;i++) {
					li = lines[i];
					if(li) { // skip the points that are null
						if(!skip) {
							cntx.lineTo(li.x, li.y);
							moveToPoint = false;
							endBottomX = li.x;
						} else {

							startBottomX = li.x;
							cntx.moveTo(startBottomX, bottomY);
							if(i+1<=end && lines[i+1]){
								cntx.lineTo(li.x, li.y);
							}
							lastPoint = li;
							skip = false;
							startIndex = i;
						}
					} else {
						if(!skip){
							skip = true;
							if(!moveToPoint){
								cntx.lineTo(endBottomX, bottomY);
								cntx.lineTo(startBottomX, bottomY);
								var MinY = this.getMinYPosition(lines, startIndex, i) || 0;

//								var my_gradient  = cntx.createLinearGradient(0,MinY,0,bottomY);
//							    my_gradient.addColorStop(1,this.rgb2rgbStr(rgbClr, 0));
//							    my_gradient.addColorStop(0,this.rgb2rgbStr(rgbClr, 1));
							    cntx.fillStyle = this.rgb2rgbStr(rgbClr, 1);
							    cntx.globalAlpha = 0.65;
								cntx.fill();
							}
						}
					}
				}

		         //close polygon or open line
		        if(!moveToPoint){
					cntx.lineTo(endBottomX, bottomY);
					cntx.lineTo(startBottomX, bottomY);
					var MinY = this.getMinYPosition(lines, startIndex, end) || 0;
					cntx.closePath();
//					var my_gradient  = cntx.createLinearGradient(0,MinY,0,bottomY);
//				    my_gradient.addColorStop(1,this.rgb2rgbStr(rgbClr, 0));
//				    my_gradient.addColorStop(0,this.rgb2rgbStr(rgbClr, 1));
				    cntx.fillStyle = this.rgb2rgbStr(rgbClr, 1);
				    cntx.globalAlpha = 0.65;
					cntx.fill();
		        }

				cntx.restore();
			},

			/**
			 * Draws a rectangle given the given parameters
			 * @param  {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
			 * @param x point on x axes
			 * @param y point on y axes
			 * @param w width of the rectangle
			 * @param h height of the rectangle
			 * @param {Boolean} [fill] indicates whether to just draw empty or filled rectangle.
			 * @param {CanvasContext2D} [context] the context object to use
			 */
			drawRectangle: function drwRect(widget, x, y, w, h, fill, context) {
				var cntx = null;

				//local context
				if (context) {
					cntx = context;
				} else {
					cntx = widget.context;
				}

				if(fill) {
					cntx.fillRect(x,y,w,h);
				} else {
					cntx.strokeRect(x,y,w,h);
				}
			},
			/**
			 * Draws an arc on the given context.  If context is not provided will draw on the base context
			 * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
			 * @param x point on x axes
			 * @param y point on y axes
			 * @param radius radius of the arc we want to draw
			 * @param startAngle define the end point of the arc in radians
			 * @param endAngle define the end point of the arc in radians
			 * @param {Boolean} [anticlockwise] whether to draw arc anticlockwise or clockwise
			 * @param {Boolean} [fill] indicates whether to just draw empty or filled arc.
			 * @param {CanvasContext2D} [context] the context object to use
			 */
			drawArc: function drwArc(widget, x, y, radius, startAngle, endAngle, anticlockwise, fill, context) {
				var cntx = null;

				//local context
				if (context) {
					cntx = context;
				} else {
					cntx = widget.context;
				}

				cntx.beginPath();

				cntx.arc(x,y,radius,startAngle,endAngle,anticlockwise);

				if(fill) {
					cntx.fill();
				} else {
					cntx.stroke();
				}

			},

			/**
			 * Draws a rounded rectangle using the current state of the canvas.
			 * If you omit the last three params, it will draw a rectangle
			 * outline with a 5 pixel border radius
			 * @param {CanvasRenderingContext2D} ctx
			 * @param {Number} x The top left x coordinate
			 * @param {Number} y The top left y coordinate
			 * @param {Number} w The width of the rectangle
			 * @param {Number} h The height of the rectangle
			 * @param {Number} r The corner radius. Defaults to 5;
			 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false
			 */
			drawRoundRect: function drawRoundRect(ctx, x, y, w, h, r, fill) {
				//make sure the radius is not to large
				r = Math.min(w/2, h/2, r);

				ctx.beginPath();
				ctx.moveTo(x + r, y);
				ctx.arcTo(x+w, y,   x+w, y+h, r);
				ctx.arcTo(x+w, y+h, x,   y+h, r);
				ctx.arcTo(x,   y+h, x,   y,   r);
				ctx.arcTo(x,   y,   x+w, y,   r);
//				ctx.lineTo(x + width - radius, y);
//				ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//				ctx.lineTo(x + width, y + height - radius);
//				ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//				ctx.lineTo(x + radius, y + height);
//				ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//				ctx.lineTo(x, y + radius);
//				ctx.quadraticCurveTo(x, y, x + radius, y);
				ctx.closePath();

				if (fill) {
					ctx.fill();
				}else{
					ctx.stroke();
				}
			},

			drawHalfRoundedRectangle: function drwHRRect(widget, x, y, w, h, r, fill, context) {
				var cntx = null;

				//local context
				if (context) {
					cntx = context;
				} else {
					cntx = widget.context;
				}

				cntx.beginPath();
				cntx.moveTo(x+w,y);
				cntx.lineTo(x+r,y);
				cntx.arcTo(x,y,x,y+r,r);
				cntx.lineTo(x,y+h-r);
				cntx.arcTo(x,y+h,x+r,y+h,r);
				cntx.lineTo(x+w,y+h);
				if(fill) {
					cntx.fill();
				} else {
					cntx.stroke();
				}
			},

			/**
			 * computes if user wants to draw start or end point or both and draw accordingly.
			 * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
			 * @param lines - array containing the x and y points for all the points
			 * @param {CanvasContext2D} [context] the context object to use
			 * @param dp highlight start and end points.
             * 0 - No points
             * 1 - start point only
             * 2 - end point only
             * 3 - start and end points both {default}
             * 4 - draw other points only. other point means non-start and non-end points. added by xiawang
             * 7 - draw all point. added by xiawang
			 */
			drawStartEndPoints: function dsep(widget, lines, context, dp) {
				var l = lines.length;

				var cntx = null,
				r = widget.startEndPointRadius;

				//local context
				if (context) {
					cntx = context;
				} else {
					cntx = widget.context;
				}

				cntx.save();

				var spc = '#f0f43e',
					epc = '#f0f43e',
					opc = '#663300';

				if(widget.startPointColor) {
					spc = widget.startPointColor;
				}

				if(widget.endPointColor) {
					epc = widget.endPointColor;
				} else {
					// if end point is greater green color red otherwise based on y value of line so
					// higher the y smaller the value of y greater the point value.
					var	s = lines[0].y,
					h = lines[l -1].y;
					if( s > h) {
						epc = '#008000';
					} else if( s < h) {
						epc = '#8d1616';
					} else {
						epc = spc;
					}
				}

				if (widget.otherPointColor) {
					opc = widget.otherPointColor;
				}

				if(dp & D_S_P && lines[0]) {
					cntx.strokeStyle = spc;
					cntx.fillStyle = spc;
					// draw only the start point
					this.drawArc(this, lines[0].x, lines[0].y, r, 0, Math.PI * 2, true, true, cntx);
				}

				if(dp & D_E_P && lines[l - 1]) {
					cntx.strokeStyle = epc;
					cntx.fillStyle = epc;
					this.drawArc(this, lines[l - 1].x, lines[l - 1].y, r, 0, Math.PI * 2, true, true, cntx);
				}

				if(dp & D_O_P) {
					cntx.strokeStyle = opc;
					cntx.fillStyle = opc;
					// xiawang: draw other point
					for (var i = 1; i < l -1; i ++) {
						if(lines[i]){
							this.drawArc(this, lines[i].x, lines[i].y, r, 0, Math.PI * 2, true, true, cntx);
						}
					}
				}

				cntx.restore();
			},

            /**
             * returns the color used to draw lines and text. #000 or #fff depending on the theme color
             * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
             */
			getColor: function gtclr(w) {
				return (parseInt(w.themeColor.substr(1), 16) > 0x7fffff) ? '#000000' : '#ffffff';
			},

            /**
             * draws an horizontal dotted line across the chart
             * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
             * @param {Integer} [y] the y axis coordinate where the line will be drawn
             */
            drawHighlightLine: function drwHghlghtln(w, y) {
				var ctx = w.context,
                    margin = w.margin,
					x1 = margin.l,
					x2 = w.isTimeSeries ? w.chartWidth + margin.l : w.getWidth() - margin.r;

				ctx.save();
                //set the context settings
				ctx.globalAlpha = 1;
				ctx.strokeStyle = this.rgb2rgbStr(w.formatProp.textClr, 0.35)//this.getColor(w);
				ctx.lineWidth = 1;
				ctx.lineCap = 'round';

                //create a dotted line by creating  separate paths
				while (x1 < x2) {
					ctx.beginPath();
					ctx.moveTo(x1, y);
					x1 += 2;
					ctx.lineTo(x1, y);
					ctx.stroke();
					x1 += 3;
				}

				ctx.restore();
			},


            /**
             * adds a data label to the chart on its y axis
             * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
             * @param {String} [text] the label's text
             * @param {Integer} [x] the x axis coordinate
             * @param {Integer} [y] the y axis coordinate
             */
			addLabel: function adDtLbl(w, text, x, y, width, rotate, prevLabel) {

				//create an html div node
                var lbl = document.createElement("div");
                lbl.className = 'mstrmojo-Chart-lbl';
                lbl.style.color = this.rgb2rgbStr(w.formatProp.textClr, 0.8);

                lbl.innerHTML = text;

                if (width) {
                    lbl.style.width = width + 'px';
                }
                var node = null;
                var aWidth = 0;
                if(w.isTimeSeries) {
                	if(prevLabel.w >= 0) {
                		node = w.xdiv;
                		aWidth = w.animationCanvas.width;
                	} else {
                		node = w.domNode.getElementsByClassName('mstrmojo-chart-ylbl-div')[0];
                		if(!node) {
                			node = document.createElement("div");
                			node.id = 'mstrmojo-chart-ylbl-div';
                			node.className = 'mstrmojo-chart-ylbl-div';
                	//		node.style.backgroundColor = '#000000';
                	//		node.style.position = 'absolute';
                			w.domNode.appendChild(node);
                		}
                		node.style.width = w.margin.l - 1 + 'px';
                	}
                } else {
                	node = w.domNode;
                	aWidth = w.getWidth();
                }

                //append it to the Chart Widget's dom node
                //w.domNode.appendChild(lbl);
                node.appendChild(lbl);

                var lblTextWidth = lbl.offsetWidth || ( w.getTextWidth && w.getTextWidthByElem(text,lbl) );

                //TODO in case of rotate labels we need to calculate the x axis differently

                //check for labels overlapping for X and Y axis depending of which one is being drawn
                var ht = lbl.offsetHeight || 22*(ZoomFactor || 1); // #498285 make the default height of label a little bigger
                var wd = width || lblTextWidth || 100;

                var X_PAD = w.xLabelPadding/2;
                var Y_PAD = w.yLabelPadding/2;

                /*
                 * remove the x-axis label if it will be cutoff
                 * If the center of the x-axis label is between the left boundary and the y-axis, we will remove this label.
                 */
                 if(prevLabel.w >= 0 && w.isTimeSeries && w._scroller.origin){
                	 var distanceOffOrgin = x - w._scroller.origin.x;
                	 if(distanceOffOrgin <= 0 && (distanceOffOrgin + lblTextWidth/2 > -w.maxYLblWidth)){
                	 	w.needRedrawVerticalLine = true;
                	 	node.removeChild(lbl);
                		return null;
                	 }

                	 var distanceOffLegend = distanceOffOrgin - w.getChartWidthOnScreen();
                	 if( (distanceOffLegend - lblTextWidth/2) <=0  && distanceOffLegend >= 0){
                	 	w.needRedrawVerticalLine = true;
                	 	node.removeChild(lbl);
                		return null;
                	 }
                 }


                if(prevLabel.w >= 0) {
                	x = x - wd /2;
                }

                //check overlap for Y-axis Labels
                if(prevLabel.h >= 0 && ((y >= prevLabel.y - Y_PAD && y <= prevLabel.y + prevLabel.h) ||
                		(y + ht >= prevLabel.y - Y_PAD && y + ht <= prevLabel.y + prevLabel.h) ||
                		(y + ht >= w.canvas.height - w.margin.b) )) {
                	node.removeChild(lbl);
                	return null;
                }

                //check overlap for X-axis Labels
                if(prevLabel.w >= 0 && (((x >= prevLabel.x && x < prevLabel.x + prevLabel.w + X_PAD)) || x < prevLabel.x || x < w.margin.l || x + wd > aWidth)) {
                	node.removeChild(lbl);
                	return null;
                }

                //Now show the label at the correct position
                if(w.isTimeSeries && prevLabel.h >= 0) {
                	node.style.top = (w.margin.t - ht/2) + 'px';
                	//  -1 is to avoid covering the xAxis line which is 2px width
                	node.style.height = (w.canvas.height - w.margin.t - w.margin.b -1 + ht/2) + 'px'; // #493113 do not subtract margin.b to extend the div height to the bottom to hide x-label divs underneath
                	this.translateCSS(x, (y - w.margin.t) + ht/2, rotate, lbl);
                } else {
                	this.translateCSS(x, y, rotate, lbl);
                	lbl.style.maxHeight = ht + 'px'; //#493077 temp fix for label to not show in two lines
                }

                //save the last label drawn positions
                prevLabel.x = x;
                prevLabel.y = y;
                if(prevLabel.h >= 0) {
                	prevLabel.h = ht;
                }
                if(prevLabel.w >= 0){
                	prevLabel.w = wd;
                	lbl.style.textAlign = 'center';
                }

                return lbl;
			},

            /**
             * adds a data label to the chart on its y axis
             * @param {mstrmojo.plugins.VisChart} [widget] a reference to the Chart Widget
             * @param {String} [text] the label's text
             * @param {Integer} [y] the y axis coordinate
             */
			addDataLabel: function adDtLbl(w, text, y, prevLabel) {
				var xText = (w.margin.l > w.margin.r) ? TEXTMARGIN : w.getWidth() - w.margin.r + TEXTMARGIN,
                    spaceAvailable = (w.margin.l > w.margin.r) ? w.margin.l : w.margin.r;
                //TODO y - 10 this is used to move the y label up to display
                return this.addLabel(w, text, xText, y - 10, spaceAvailable-TEXTMARGIN*2, false, prevLabel);
			},

			/**
			 * adds translate property to the given div element
			 * @param x point on x-axis
			 * @param y point on y-axis
			 * @param rotate  boolean to simply rotate by 45 degree or no rotation of div
			 * @param lbl  element that need be translated
			 */

			translateCSS: function trnlt(x, y, rotate, lbl) {
			    var value = 'translate(' + x + 'px,' + y + 'px)';
			    if (rotate) {
			        value += ' rotate(45deg)';
			    }

                lbl.style[$DOM.CSS3_TRANSFORM] = value;
			},

			getTouchXYOnWidget: function getTouchXYOnWidget(touchX, touchY, widget){
				var TouchScroller = mstrmojo.TouchScroller,
			 		scrollerOffsets = (TouchScroller && widget.parent && TouchScroller.getScrollPositionTotals(widget.parent)) || { x: 0, y:0}; // for Web visualizations

				touchX = touchX - widget.offsetLeft + scrollerOffsets.x;
				touchY = touchY - widget.offsetTop + scrollerOffsets.y;
				return {touchX:touchX, touchY:touchY};
			},

			//return the y value in the canvas given an x point
		    getYValue: function gyval(widget, point) {
		        var height = widget.canvas.height,
		            margin = widget.margin,
		            mvalues = widget.model.mvalues;
		        return height - margin.b - 4 -((parseFloat(point) - mvalues[0]) * widget.RTY);
		    },

		  //return the y value in the canvas given an x point
		    getMasterYValue: function getMasterYValue(widget, point, mm /*masterMargin*/) {
		        var height = widget.masterCanvas.height,
		            mvalues = widget.model.mvalues;
		        return height - mm.b - 3 - ((parseFloat(point) - mvalues[0]) * widget.MRTY);
		    },

		    // returns the value of closest y point in the series
		    getSeriesIndexAndYValue: function gsiyv(w, rowIdx, touchY) {
		    	var s = w.model.series,
		    	l = s.length,
		    	si = 0;
				y = this.getYValue(w, s[si].rv[rowIdx]) || 0;
		    	var cp = touchY - y < 0 ? - (touchY - y) : touchY - y,
		    			pp = cp;
		    	for(var i = 1; i < l; i++) {
		    		var cy = this.getYValue(w, s[i].rv[rowIdx]) || 0;
		    		cp = touchY - cy < 0 ? - (touchY - cy) : touchY - cy;
		    		if(cp < pp) {
		    			y = cy;
		    			pp = cp;
		    			si = i;
		    		}
		    	}

		    	return {y:y, si:si};
		    },

		    getLabelWidthForMargin: function tsip(w, text) {
		    	var lbl = document.createElement("div");
                lbl.className = 'mstrmojo-Chart-lbl';
                lbl.innerHTML = text;

                //append it to the Chart Widget's dom node
                w.domNode.appendChild(lbl);
                var wd = lbl.offsetWidth || 60;
                w.domNode.removeChild(lbl);
                return wd + TEXTMARGIN * 2;
		    },

			animateLineSet: function anmtHLnSt(w, fromLines, toLines, cfg) {
                var lines = [],
                    x = w.animationContext,
                    l = toLines.length;

                x.clearRect(0, 0, w.getWidth(), w.canvas.height);

                if (!cfg.index) {
                    cfg.index = 0;
                } else if (cfg.index >= cfg.rate) { // last time
                    this.drawLineSet(w, toLines, false, x);
                    w.drawLabels();
                    if(w.isFillLinesArea) {
                    	//fill the Lines area
                    	this.fillLinesArea(w,toLines.slice(0));
                    }
                    if(w.isDrawStartEndPoints) {
                    	this.drawStartEndPoints(w, toLines, x, w.isDrawStartEndPoints);
                    }
                    return;
                }

                for (var i = 0; i < l; i++) {
                    var tli = toLines[i],
                        fli = fromLines[i];
                    lines[i] = {x:(cfg.index * (tli.x - fli.x) / cfg.rate) + fli.x, y:(cfg.index * (tli.y - fli.y) / cfg.rate) + fli.y};
                }

                this.drawLineSet(w, lines, false,  x);

                var me = this;
                cfg.index++;
                window.setTimeout(function() {
                    me.animateLineSet(w, fromLines, toLines,  cfg);
                }, 40);

			},

			//fill in the area below the lines
            fillLinesArea: function flA(w,area) {
				var hgt = w.canvas.height;

				area.push({x:w.getWidth() - w.margin.r, y:hgt - w.margin.b});
				area.push({x:w.margin.l, y:hgt - w.margin.b});

                var fillColor = new Array();
                if(w.fillinColor) {
                	mstrmojo.requiresCls("mstrmojo.color");
                	var g = mstrmojo.color.hex2rgb(w.fillinColor).join(',');
                	fillColor[0] = 'rgba(' +  g + ', 0.8)';
                	fillColor[1] = 'rgba(' +  g + ', 0.2)';
                } else {
                	fillColor = ['rgba(255,128,0,0.8)', 'rgba(255,128,0,0.2)'];
                }

                var ctx = w.animationContext;
                var g = ctx.createLinearGradient(0, 0, 0, hgt);

                g.addColorStop(0, fillColor[0]);
                g.addColorStop(0.75, fillColor[1]);

                ctx.fillStyle = g;
                this.drawLineSet(w, area, true, ctx);
            },

            convertRawValueToMilliseconds: function convertRawValueToMilliseconds(/*String*/val) {
                var daysSinceJan1st1899_12_30 = Number(val),
                    realVal = daysSinceJan1st1899_12_30 - ((new Date('1/1/1970').getTime() - new Date('12/30/1899').getTime())/millisOnDay) - T_Z_A,
                    dt = new Date(realVal * millisOnDay); // new date with time zone
                return new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()).getTime(); //adjust to ignore the time zone difference, but use an absolute UTC time.
            },

            /**
             * get the background color of the nearest ancestor which has "background-color"
             * @param widget
             * return the background color if any, or else return null
             */
            getAncestorBgColor: function getAncestorBgColor(widget) {
                var bgColor = null,
                    me = widget,
                    modelData = me.modelData ? me.modelData : me.model,
                    docModel = null;
                if (me.hasOwnProperty("xtabModel") && me.xtabModel.hasOwnProperty("docModel")) {
                    docModel = me.xtabModel.docModel;
                }
                if (docModel && docModel.defn && docModel.defn.layouts && docModel.defn.layouts.length>0) {
                    var layouts = docModel.defn.layouts,
                        layout;
                    var i;
                    // for document which has multiple layouts
                    for(i in layouts) {
                        if (layouts[i].loaded) {
                            layout = layouts[i];
                        }
                    }
                    if (layout && layout.hasOwnProperty("units")) {
                        var units = layout.units;
                        var parent = modelData.parent;
                        while (parent) {
                            var pk = parent.k || null;
                            if (units[pk] && units[pk].fmts && units[pk].fmts["background-color"]) {
                                bgColor = units[pk].fmts["background-color"];
                                break;
                            } else {
                                parent = parent.parent || null;
                            }
                        }
                        if (!bgColor) {
                            if (layout.fmts && layout.fmts["background-color"]) {
                                bgColor = layout.fmts["background-color"];
                            }
                        }
                    }

    			}

    			return bgColor;

        	},

            /**
             * Check if the given color is light color (the brightness is greater than 150
             *
             * @param color
             * @returns {boolean}
             */
            isLightColor: function isLightColor(color) {
                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,
                    i,
                    r,
                    g,
                    b,
                    brightness,
                    isLight = false;

                if (color) {
                    var colorNew,
                        tempColor;
                    if (/^(rgba|RGBA)/.test(color)) {
                        tempColor = color.replace(/rgba\(|RGBA\(/, "");
                        tempColor = tempColor.replace(")", "");
                        colorNew = tempColor.split(",");
                        r = colorNew[0];
                        g = colorNew[1];
                        b = colorNew[2];
                    } else if (/^(rgb|RGB)/.test(color)) {
                        tempColor = color.replace(/rgb\(|RGB\(/, "");
                        tempColor = tempColor.replace(")", "");
                        colorNew = tempColor.split(",");
                        r = colorNew[0];
                        g = colorNew[1];
                        b = colorNew[2];
                    } else if (reg.test(color)) {
                        if (color.length === 4) {
                            colorNew = "#";
                            for (i = 1; i < 4; i++) {
                                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                            }
                            color = colorNew;
                        }
                        var colorChange = [];
                        for (i = 1; i < 7; i += 2) {
                            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
                        }
                        r = colorChange[0];
                        g = colorChange[1];
                        b = colorChange[2];
                    }

                    brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    if (brightness > 150) {
                        isLight = true;
                    }
                }

                return isLight;
            },

        	getPointDistanceSquare: function getPointDistSquare(p1 ,p2){
            	return (p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y);
            },

            truncateTextToLine: function(elem, span, lineCount){
            	span.className = elem.className;
            	span.style.whiteSpace = "nowrap";
//            	span.style.visibility = "visible";
            	var str = span.innerHTML = elem.innerHTML;
            	var paddingWidth = parseInt(elem.offsetWidth) - parseInt(elem.style.width);
            	var maxWidth = lineCount * parseInt(elem.style.width) + paddingWidth ;

            	var res = str;
            	if(span.offsetWidth > maxWidth){
            		var low = 0,
                    high = str.length - 1;
	                while (low <= high) {
	                    var mid = Math.round((low + high) / 2);
	                    var s0 = str.substr(0, mid+1);
	                    var s1 = str.substr(0, mid+2);
	                    span.innerHTML = s0;
	                    var h0 = span.offsetWidth;
	                    span.innerHTML = s1;
	                    var h1 = span.offsetWidth;

	                    if (h0 <= maxWidth && h1 > maxWidth) {
	                        break;
	                    } else if (h0 > maxWidth) { // still exceeds
	                        high = mid - 1;
	                    } else if (h1 <= maxWidth) {
	                        low = mid + 1;
	                    }
	                }

	                res = str.substr(0, mid+1);
	                if (res.length < str.length) { // for some extreme case, they might be identical.
	                    if (res.charAt(res.length-1) === ' ') { // remove last char if it's ' '
	                        res = res.substr(0, res.length-1);
	                    }
	                    var pos = res.lastIndexOf(' ');
	                    var left = res.length - 1 - pos; // how many characters are there after the last ' '
	                    if (left >= 2 && left <= 8) { // do some wrapping
	                        res = res.substr(0, res.length-left-1) + '...';
	                    } else {
	                        res = res.substr(0, res.length-3) + '...'; // simply remove last 3 characters and append '...'
	                    }
	                }
            	}

            	elem.innerHTML = res;
            },
            getLen:function(text, span, errorAdjust, paddingWidth)
            {
            	span.innerHTML = text;
        		var wiLen = span.offsetWidth + errorAdjust - paddingWidth;
        		return wiLen;
            },

            splitWordIfTooLong: function(wlst, span, availSp, paddingWidth, errorAdjust){
        	//return wlst;
        	var wordsArr = wlst.split(' ');
        	var res = [];
        	var sz = wordsArr.length;
        	var i = 0;
        	var j = 0;
        	for (i = 0; i < sz; i++)
        	{
        		var wd = wordsArr[i];
        		while(true){
        			//span.innerHTML = wd;
        			var wiLen = this.getLen(wd, span, errorAdjust, paddingWidth);//span.offsetWidth + errorAdjust - paddingWidth;
        			if(wiLen > availSp){
        				var clipL = (availSp/wiLen) * wd.length;
        				var intClip = Math.round(clipL);

        				while(intClip > 0){
        					var tpWd = wd.substr(0, intClip);
        					var len1 = this.getLen(tpWd, span, errorAdjust, paddingWidth);
        					if(len1<=availSp){
        						res.push( tpWd );
        						break;
        					}
        					else
        						intClip--;
        				}
        				//wiLen = availSp; // if one word is already larger than the space, clip it.
        				wd = wd.substr(intClip, wd.length - intClip);
        			}
        			else{
        				res.push(wd);
        				break;
        			}
        		}
        	}
        	return res.join(' ');
        },
            truncateTextToLineWithWordWrap: function(elem, span, lineCount){
            	span.className = elem.className;
            	span.style.whiteSpace = "nowrap";
//            	span.style.visibility = "visible";
            	var errorAdjust = 7;
            	//max Width is the available space, span.offsetWidth is the measured width of text
            	var availSp = -1;
            	if(elem.style && elem.style.width && elem.style.width.length > 0){
            		availSp= parseFloat(elem.style.width);
            	}
            	if(availSp < 0)
            		availSp = parseFloat(mstrmojo.css.getComputedStyle(elem).width);

            	var str = elem.innerHTML;
            	var paddingWidth = parseFloat(elem.offsetWidth) - availSp;//parseInt(elem.style.width);
            	//var maxWidth = lineCount * availSp + paddingWidth ;

            	str = this.splitWordIfTooLong( str, span, availSp, paddingWidth, errorAdjust );

            	var wordsArr = str.split(' ');
            	var lenArr = [];
            	var preLenArr = [];
            	var i = 0;
            	var totalLen = 0;
            	var sz = wordsArr.length;
            	span.innerHTML = '&nbsp;';
            	var blankSpaceLen = span.offsetWidth - paddingWidth;
            	preLenArr.push(0);//the len is zero with none words is considered
            	for (i = 0; i < sz; i++)
            	{
            		//span.innerHTML = wordsArr[i];
            		//var wiLen = span.offsetWidth + errorAdjust - paddingWidth;
            		var wiLen = this.getLen(wordsArr[i], span, errorAdjust, paddingWidth);
            		if(wiLen > availSp){
            			var wd = wordsArr[i];
            			var clipL = (availSp/wiLen) * wd.length;
            			wordsArr[i] = wd.substr(0, parseInt(clipL));
            			wiLen = availSp; // if one word is already larger than the space, clip it.
            		}
            		lenArr.push(wiLen);
            		totalLen += wiLen;
            		preLenArr.push(totalLen);
            		if( i !== sz - 1 )
            			totalLen += blankSpaceLen;
            	}
            	//now lets arrange the words for each line
            	var lnS = 0, lnE = 0;//the start and end index for this line
            	var ln = lineCount;
            	for (; lnE < preLenArr.length; )
            	{
            		var len1 = preLenArr[lnE] - preLenArr[lnS];
            		if(lnS > 0 && lnE != lnS)
            			len1 -= blankSpaceLen;
            		var len2 = preLenArr[lnE+1]-preLenArr[lnS];
            		if(lnS > 0 && lnE + 1 != lnS )
            			len2 -= blankSpaceLen;
            		if( len1 <= availSp &&  ((lnE+1 == preLenArr.length) || (len2 > availSp)))
            		{
            			//one line consumed
            			ln --;
            			if( ln == 0 || lnE === sz )
            				break;
            			else
            			{
            				lnS = lnE;
            				lnE++;
            			}
            		}
            		else
            		{
            			lnE++;
            		}
            	}
            	if(lnE > sz)
            		lnE = sz;
            	var lastlineLen = preLenArr[lnE] - preLenArr[lnS];
        		if(lnS > 0 && lnE != lnS)
        			lastlineLen -= blankSpaceLen;

            	var res;
            	if(lnE >= sz && lastlineLen < availSp)//all words can be fit in
            		res = wordsArr.join(' ');
            	else{
            		res = wordsArr.slice(0, lnE).join(' ');
            		//we need to add ...
            		//var lastlineLen = preLenArr[lnE] - preLenArr[lnS];
            		//if(lnS > 0 && lnE != lnS)
            		//	lastlineLen -= blankSpaceLen;

            		//span.innerHTML = '...';
                	//var elipLen = span.offsetWidth + errorAdjust - paddingWidth;
                	var elipLen = this.getLen('...', span, errorAdjust, paddingWidth);

                	if( lastlineLen + elipLen <= availSp)
                		res += '...';
                	else
                	{
                		if (res.charAt(res.length-1) === ' ') { // remove last char if it's ' '
	                        res = res.substr(0, res.length-1);
	                    }
	                    var pos = res.lastIndexOf(' ');
	                    var left = res.length - 1 - pos; // how many characters are there after the last ' '
	                    /*if (left >= 2 && left <= 8) { // do some wrapping
	                        res = res.substr(0, res.length-left-1) + '...';
	                    } else {
	                        res = res.substr(0, res.length-3) + '...'; // simply remove last 3 characters and append '...'
	                    }*/
	                    if( left === 3 )
	                    	res = res.substr(0, res.length-3) + ' ...'; // simply remove last 3 characters and append '...'
	                    else
	                    	res = res.substr(0, res.length-3) + '...';
                	}
            	}
            	elem.innerHTML = res;
            },

            getLen2:function(text, fontStr, txtCvs)
            {
            	var canvas = txtCvs;
				var context = canvas.getContext('2d');
				context.font = fontStr;
				context.textAlign = 'center';
				context.fillStyle = 'blue';
				// get text metrics
				var metrics = context.measureText(text);
				var width = metrics.width;
				return width;
            },

            splitWordIfTooLong2: function(wlst, availSp, fontStyle, txtCvs){
            	//return wlst;
            	var wordsArr = wlst.split(' ');
            	var res = [];
            	var sz = wordsArr.length;
            	var i = 0;
            	var j = 0;
            	for (i = 0; i < sz; i++)
            	{
            		var wd = wordsArr[i];
            		while(true){
            			//span.innerHTML = wd;
            			var wiLen = this.getLen2(wd, fontStyle, txtCvs);//span.offsetWidth + errorAdjust - paddingWidth;
            			if(wiLen > availSp){
            				var clipL = (availSp/wiLen) * wd.length;
            				var intClip = Math.max(Math.round(clipL), 1);//will infinit loop if intClip < 1

            				while(intClip > 0){
            					var tpWd = wd.substr(0, intClip);
            					var len1 = this.getLen2(tpWd, fontStyle, txtCvs);
            					//to avoid infinit loop and constrain that at least one letter
            					if(len1<=availSp ||intClip == 1){
            						res.push( tpWd );
            						break;
            					}
            					else
            						intClip--;
            				}
            				//wiLen = availSp; // if one word is already larger than the space, clip it.
            				wd = wd.substr(intClip, wd.length - intClip);
            			}
            			else{
            				res.push(wd);
            				break;
            			}
            		}
            	}
            	return res.join(' ');
            },

            //We can't get the computedStyle.font on device, but we can get it by construct
            getComputedFontStyle: function getCFontStyle(computedStyle){
                var fontStyle = computedStyle.fontStyle + " "
                    + computedStyle.fontWeight + " "
                    + computedStyle.fontSize + "/"
                    + computedStyle.fontVariant
                    + " " + computedStyle.fontFamily;

                return fontStyle;
            },

            /***
             * truncate a given text to fixed lines. Use word-wrap
             *
             * @param elem the dom elem to truncate
             * @param str the txt str to truncate
             * @param txtCvs canvas used to measure the width of text
             * @param lineCount the line count to truncate
             *
             * return true if the text can't be fit in the elem
             */
            truncateTextToLineWithWordWrap2: function(elem, str, txtCvs, lineCount){
            	//max Width is the available space, span.offsetWidth is the measured width of text
            	var availSp = -1;
            	if(elem.style && elem.style.width && elem.style.width.length > 0){
            		var paddingWidth = 0;

					var compStyle = mstrmojo.css.getComputedStyle(elem);
					if( compStyle.paddingLeft ){
						paddingWidth += parseFloat(compStyle.paddingLeft);
					}
					if( compStyle.paddingRight ){
						paddingWidth += parseFloat(compStyle.paddingRight);
					}

					var elemWidth = elem.offsetWidth;
					availSp = elemWidth ? elemWidth - paddingWidth : parseInt(elem.style.width);
            	}
            	if(availSp < 0){
//            		availSp = parseFloat(mstrmojo.css.getComputedStyle(elem).width);
            		elem.innerHTML = "...";
            		return;
            	}

            	var computedStyle = mstrmojo.css.getComputedStyle(elem);
            	var fontStyle = this.getComputedFontStyle(computedStyle);
            	str = this.splitWordIfTooLong2( str, availSp, fontStyle, txtCvs );


            	var wordsArr = str.split(' ');
            	var lenArr = [];
            	var preLenArr = [];
            	var i = 0;
            	var totalLen = 0;
            	var sz = wordsArr.length;
            	//span.innerHTML = '&nbsp;';
            	var blankSpaceLen = this.getLen2(' ', fontStyle, txtCvs);//span.offsetWidth - paddingWidth;
            	preLenArr.push(0);//the len is zero with none words is considered
            	for (i = 0; i < sz; i++)
            	{
            		//span.innerHTML = wordsArr[i];
            		//var wiLen = span.offsetWidth + errorAdjust - paddingWidth;
            		var wiLen = this.getLen2(wordsArr[i], fontStyle, txtCvs);
            		if(wiLen > availSp){
            			var wd = wordsArr[i];
            			var clipL = (availSp/wiLen) * wd.length;
            			wordsArr[i] = wd.substr(0, parseInt(clipL));
            			wiLen = availSp; // if one word is already larger than the space, clip it.
            		}
            		lenArr.push(wiLen);
            		totalLen += wiLen;
            		preLenArr.push(totalLen);
            		if( i !== sz - 1 )
            			totalLen += blankSpaceLen;
            	}
            	//now lets arrange the words for each line
            	var lnS = 0, lnE = 0;//the start and end index for this line
            	var ln = lineCount;
            	for (; lnE < preLenArr.length; )
            	{
            		var len1 = preLenArr[lnE] - preLenArr[lnS];
            		if(lnS > 0 && lnE != lnS)
            			len1 -= blankSpaceLen;
            		var len2 = preLenArr[lnE+1]-preLenArr[lnS];
            		if(lnS > 0 && lnE + 1 != lnS )
            			len2 -= blankSpaceLen;
            		if( len1 <= availSp &&  ((lnE+1 == preLenArr.length) || (len2 > availSp)))
            		{
            			//one line consumed
            			ln --;
            			if( ln == 0 || lnE === sz )
            				break;
            			else
            			{
            				lnS = lnE;
            				lnE++;
            			}
            		}
            		else
            		{
            			lnE++;
            		}
            	}
            	if(lnE > sz)
            		lnE = sz;
            	var lastlineLen = preLenArr[lnE] - preLenArr[lnS];
        		if(lnS > 0 && lnE != lnS)
        			lastlineLen -= blankSpaceLen;

            	var res;
            	if(lnE >= sz && lastlineLen < availSp)//all words can be fit in
            		res = wordsArr.join(' ');
            	else{
            		res = wordsArr.slice(0, lnE).join(' ');
            		//we need to add ...
            		//var lastlineLen = preLenArr[lnE] - preLenArr[lnS];
            		//if(lnS > 0 && lnE != lnS)
            		//	lastlineLen -= blankSpaceLen;

            		//span.innerHTML = '...';
                	//var elipLen = span.offsetWidth + errorAdjust - paddingWidth;
                	var elipLen = this.getLen2('...', fontStyle, txtCvs);

                	if( lastlineLen + elipLen <= availSp)
                		res += '...';
                	else
                	{
                		if (res.charAt(res.length-1) === ' ') { // remove last char if it's ' '
	                        res = res.substr(0, res.length-1);
	                    }
	                    var pos = res.lastIndexOf(' ');
	                    var left = res.length - 1 - pos; // how many characters are there after the last ' '
	                    /*if (left >= 2 && left <= 8) { // do some wrapping
	                        res = res.substr(0, res.length-left-1) + '...';
	                    } else {
	                        res = res.substr(0, res.length-3) + '...'; // simply remove last 3 characters and append '...'
	                    }*/
	                    if( left === 3 )
	                    	res = res.substr(0, res.length-3) + ' ...'; // simply remove last 3 characters and append '...'
	                    else
	                    	res = res.substr(0, res.length-3) + '...';
                	}
            	}
            	elem.innerHTML = res;

                return res.indexOf('...') > -1;
            },



            truncateDivContent: function (str, span, comp) {
				span.innerHTML = str;
                if (span.offsetHeight > comp) { // str causes overflow, need to cut it shorter
                    var low = 0,
                        high = str.length - 1;
                    while (low <= high) {
                        var mid = Math.round((low + high) / 2);
                        var s0 = str.substr(0, mid+1);
                        var s1 = str.substr(0, mid+2);
                        span.innerHTML = s0;
                        var h0 = span.offsetHeight;
                        span.innerHTML = s1;
                        var h1 = span.offsetHeight;

                        if (h0 <= comp && h1 > comp) {
                            break;
                        } else if (h0 > comp) { // still exceeds
                            high = mid - 1;
                        } else if (h1 <= comp) {
                            low = mid + 1;
                        }
                    }

                    var res = str.substr(0, mid+1);
                    if (res.length < str.length) { // for some extreme case, they might be identical.
                        if (res.charAt(res.length-1) === ' ') { // remove last char if it's ' '
                            res = res.substr(0, res.length-1);
                        }
                        var pos = res.lastIndexOf(' ');
                        var left = res.length - 1 - pos; // how many characters are there after the last ' '
                        if (left >= 2 && left <= 8) { // do some wrapping
                            res = res.substr(0, res.length-left-1) + '...';
                        } else {
                            res = res.substr(0, res.length-3) + '...'; // simply remove last 3 characters and append '...'
                        }
                    }
                    return res;
                } else {
					return str;
				}
			},

            /**
             * position tooltip according to the following priority:
             * top left > top middle > top right
             * > left middle > bottom left > right middle
             * > bottom middle > bottom right
             *
             * @param tooltipDom
             * @param anchorPoint {x: , y: } the touch point in bounaryDom
             * @param boundaryDom
             * @param offset the distance of tooltip away from the touch point
             */
            positionTooltip: function (tooltipDom, anchorPoint, boundaryDom, offset) {

                if (!tooltipDom || !anchorPoint || !boundaryDom) {
                    return;
                }

                if (isNaN(offset)) {
                    offset = 45;
                }

                var pWidth = boundaryDom.offsetWidth,
                    pHeight = boundaryDom.offsetHeight,
                    tWidth = tooltipDom.offsetWidth,
                    tHeight = tooltipDom.offsetHeight,
                    tDomStyle = tooltipDom.style,
                    tempLeft = 0,
                    tempTop = 0;

                function putL() {
                    return tWidth + offset < anchorPoint.x && tHeight < pHeight;
                }
                function putT() {
                    return tHeight + offset < anchorPoint.y && tWidth < pWidth;
                }
                function putR() {
                    return anchorPoint.x + offset + tWidth < pWidth && tHeight < pHeight;
                }
                function putB() {
                    return anchorPoint.y + offset + tHeight < pHeight && tWidth < pWidth;
                }
                function putMX() {
                    return anchorPoint.x > tWidth / 2 && (pWidth - anchorPoint.x) > tWidth / 2;
                }
                function putMY() {
                    return anchorPoint.y > tHeight / 2 && (pHeight - anchorPoint.y) > tHeight / 2;
                }
                function putTL() {
                    return putT() && putL();
                }
                function putTM() {
                    return putT() && putMX();
                }
                function putTR() {
                    return putT() && putR();
                }
                function putLM() {
                    return putL() && putMY();
                }
                function putBL() {
                    return putB() && putL();
                }
                function putRM() {
                    return putR() && putMY();
                }
                function putBM() {
                    return putB() && putMX();
                }
                function putBR() {
                    return putB() && putR();
                }

                if (putTL()) {
                    tempLeft = anchorPoint.x - offset - tWidth;
                    tempTop = anchorPoint.y - offset - tHeight;
                } else if (putTM()) {
                    tempLeft = anchorPoint.x - tWidth / 2;
                    tempTop = anchorPoint.y - offset - tHeight;
                } else if (putTR()) {
                    tempLeft = anchorPoint.x + offset;
                    tempTop = anchorPoint.y - offset - tHeight;
                } else if (putLM()) {
                    tempLeft = anchorPoint.x - offset - tWidth;
                    tempTop = anchorPoint.y - tHeight / 2;
                } else if (putBL()) {
                    tempLeft = anchorPoint.x - offset - tWidth;
                    tempTop = anchorPoint.y + offset;
                } else if (putRM()) {
                    tempLeft = anchorPoint.x + offset;
                    tempTop = anchorPoint.y - tHeight / 2;
                } else if (putBM()) {
                    tempLeft = anchorPoint.x - tWidth / 2;
                    tempTop = anchorPoint.y + offset;
                } else if (putBR()) {
                    tempLeft = anchorPoint.x + offset;
                    tempTop = anchorPoint.y + offset;
                }

                tDomStyle.left = tempLeft + 'px';
                tDomStyle.top = tempTop + 'px';

            }


        });

})();//@ sourceURL=VisMicroUtils.js