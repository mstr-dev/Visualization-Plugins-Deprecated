(function(){
	mstrmojo.requiresCls(
        "mstrmojo.num",
        "mstrmojo.plugins.VisMicroChart.VisChartUtils");

	// check if the series are percent (%) values
	var percent = 0;
	
	var $NUM = mstrmojo.num;
	
	var NumUnits = [{n:1, s:""}, {n:1000, s:"K"}, {n:1000000, s:"M"}, {n:1000000000, s:"B"}, {n:1000000000000, s:"T"}, {n:1000000000000000, s:"Q"}];
	var DEFAULT_LEN_LIMIT = 3;
	var MAX_LEN_LIMIT = 5;
	
	function normalizeValue(val, interval, isFloor) {

		var ceilOrFloor = function(val, isFloor) {
			return isFloor ? Math.floor(val) : Math.ceil(val); 
		};
		
		var lab = ceilOrFloor(val/interval, isFloor) * interval;

		if(lab.toString().indexOf(".") >= 0 && interval < 1 && lab > 1) {
			lab = parseFloat(lab.toFixed(2));
		}

		if(lab > 0 && lab < 1 && interval > 1 / 1000) {// xiawang: if the interval is extremely small, using 1 percent might not be enough to properly show the data range
			lab = parseInt(ceilOrFloor(lab * 100, isFloor)) / 100;
		}
		return lab;
	}
	
	function updateSeriesRawValues(s, ds) {
		if(!ds) {
			ds = ','; // default to ,
		}
		var sl = s.length;
		for(var i = 0; i < sl; i++) {
			var rvs = s[i].rv,
				l = rvs.length;
			for(var j = 0; j < l; j++) {
				if(Number(rvs[j])) {
					break; // series is numbers not string don't do anything
				}
				rvs[j] = rvs[j].replace(ds,'.');
			}
		}
	}

    mstrmojo.plugins.VisMicroChart.VisChartData = mstrmojo.provide(
			"mstrmojo.plugins.VisMicroChart.VisChartData",
			/**
			 * @lends mstrmojo.VisChartData
			 */
			{
				
				process: function prcss(w) {
	
					if((!w.baseModel && w.model) || w.model.vp) {
						this.setDerivedModel(w);
						//Check if we the series raw data contains anything else but . if yes update data
						var bm = w.baseModel,
							ch = bm.colHeaders,
							chl = ch.length,
							ds = ch[chl -1].items[0].ds;
						if(ds && ds !== '.') {
							updateSeriesRawValues(bm.series, ds);
						} else if(!ds) {
							updateSeriesRawValues(bm.series);
						}
					}
	
					//debugger; // this is to stop at this point for debugging in androidApp page
					//local variables
					//var	model = w.model;
                    var model = w.model;
					var	values = model.series,
					l = values.length;
					
					if (l <= 0) {
						return;
					}
	
					//make sure this is non linear chart and we are going to draw labels
					var nlc = !w.isLinearChart && w.isDrawAxis && w.drawYAxisLabels,
						ms = "";
	
					percent = 0;
					
					//return the values of all the points on Y axis sorted ascending
					var v = new Array(); 
					if (values && values[0] && values[0].rv.length) {
						for(var j = 0; j < l; j++) {
							var s = values[j].rv,
								sl = s.length,
								k = v.length;	
							for(var i = 0; i < sl; i++ ) {
								var val = s[i];
								// if value is not defined skip it
								if(!val || val.length == 0) {
									continue;
								}
								
								if(percent === 0) {
									// check if the series are percent (%) values or not
									percent = values[j].v[i].indexOf('%')  >= 0 ? 100 : 1;
								}
								
								v[k] = parseFloat(val);
								if(nlc && v[k].toString().length > ms.length) {
									ms = v[k].toString();
								}
								k++;
							}
						}
						v = v.sort(function sortArray(a,b){return a - b;});
					}
					model.mvalues = v;
					if(nlc) {
						//model.mls is the max label size
						model.mls = ms;
						model.ylbls = v;
					}
				},
	
				setDerivedModel: function sdm(w) {
					var m = w.model,
						s = m.series,
						sl = s.length,
						ri = m.ri,
						rows = m.rowHeaders,
						cols = m.colHeaders; // number of columns present we support one attribute and multiple metrics on columns.
					
					var rl = typeof(m.vp) !== 'undefined' && m.vp.rl && m.vp.rl.length > 0 ? m.vp.rl : null;
					
					w.baseModel = m;
					
					//If we have custom properties compute the range of first element
					//Compute the slice we need to draw
					var rne = s[0].rv.length,
						rns = 0;
					if(rl && w.isTimeSeries) {
						var rs = parseInt(rl[0].rs),
						 	sr = rl[0].sr;
						for(var i = 0; i < rows.length; i++) {
							// Now match which row is it to get the start point of the range
							if(rows[i].id == sr) {
								rns = rne - (rows[i].l * rs) >= 0 ? rne - (rows[i].l * rs) : 0;
								break;
							}
						}
					}
					w.model = { categories:m.categories, mtrcs:m.mtrcs, series:s, colHeaders:cols, rowHeaders:rows, rne:rne, rns:rns, ri:ri};
					
				},
				
				processLinearData: function pld(w) {
					this.process(w);
					var model = w.model;
					var vals = model.mvalues,
					_max = w.getMaxValue(),
					_min = w.getMinValue();
					
					var _lbs = this.generateAxisLabels(w, _max, _min);
					model.mvalues = _lbs;
					
	
					var da = w.isDrawAxis && w.drawYAxisLabels;
					
					var useAbbr = w.isTimeSeries ? w.formatProp.condenseLabels : true;
					
					if(da) {
						var res = this.condenseLabels(_lbs, DEFAULT_LEN_LIMIT);
						if(useAbbr){
							var duplicatedCondensed = this.checkDuplicatedCondensed(res.condensedLabels);
							if(duplicatedCondensed){
								for (i=DEFAULT_LEN_LIMIT+1; i<MAX_LEN_LIMIT; ++i) {
									res = this.condenseLabels(_lbs, i);
									duplicatedCondensed = this.checkDuplicatedCondensed(res.condensedLabels);
									if (!duplicatedCondensed) {
										break;
									}
								}
								
								// if still duplicated, don't condense.
								if (duplicatedCondensed) {
									useAbbr = false;
								}
							}
							model.mls = res.maxLabel;
							model.ylbls = res.condensedLabels;
						}
						
						if(!useAbbr){						
							var formatedStr = [];
							var ms = "";
							
							var items = model.colHeaders[model.colHeaders.length - 1].items;
							var formatMask = items && items[0] && items[0].f || "";
							
							for(var i = 0; i < _lbs.length; i++){
								formatedStr[i] = $NUM.formatByMask(formatMask, _lbs[i]);
								
								if(formatedStr[i].toString().length > ms.length) {
									ms = formatedStr[i].toString();
								}
							}
							
							model.mls = ms;
							model.ylbls = formatedStr;
						}
											
						
					}
	
				},
				
				checkDuplicatedCondensed: function checkDuplicatedCondensed(lbls){
					var duplicatedCondensed = false;
					for (var i=1; i<lbls.length; i++) {
						if (lbls[i] == lbls[i-1]) {
							duplicatedCondensed = true;
							break;
						}
					}
					
					return duplicatedCondensed;
				},
				
				condenseLabels: function condenseLabels(lbls, lenLimit){
					var ll = lbls.length;
					var ms = "";
					var _lbstr = new Array();					
					
					for(var i = 0; i < ll; i++) {
						//if greater than 1000 and less than million put K symbol else if greator than 1 million put
						// M symbol else leave it as it is
						_lbstr[i] = this.formatNumber(lbls[i], lenLimit);
						
						if(_lbstr[i].toString().length > ms.length) {
							ms = _lbstr[i].toString();
						}
					}
					
					return {condensedLabels:_lbstr, maxLabel:ms};
				},
				
				generateAxisLabels: function generateAxisLabels(w, _max, _min, intAsStep){
					var _lbs = new Array();
					
					if(_max == _min){
						if( _min < 0){
							_lbs.push(_min);
						}
						_lbs.push(0);
						if(_min > 0){
							_lbs.push(_min);
						}
						
						return _lbs;
					}
					
					var interval = this.calInterval(_max, _min, intAsStep);
									
					/*
					 * if use custom axis scale, we will not normalize the max and min label value
					 * Instead we will use exactly the max and min value user set
					 */
					if(w.isTimeSeries && w.formatProp.useCustomAxisScale){
						var labelMax = _max;					
						var labelMin = _min;
					}else{
						var labelMax = normalizeValue(_max, interval, false);					
						var labelMin = normalizeValue(_min, interval, true);
						
					}
					
					//PM required:If the numeric difference between the MINdata and (Minimun-1) tick-label divided by the step size is less then 10%:Set the (Minimum-1) tick-label to Minimum tick-label
					if((_min - labelMin) > 0.9*interval){
						labelMin =  normalizeValue(_min, interval, false);//_min;
					}
					
					if((labelMax - _max) > 0.9*interval){
						labelMax =  normalizeValue(_max, interval, true);//_max;
					}
					_lbs = new Array();
					
					
	//				var intervalCount = Math.floor((labelMax - labelMin + interval/100)/interval) + 1;
	//				for(var i = 0; i < intervalCount; i++){
	//					var tickValue = this.formatNumber(labelMin + i*interval, 3);
	//					_lbs.push();
	//				}
					
					if( interval < ((labelMax - labelMin) / 30)){
						//too small intervals, show only two ticks
						_lbs.push(labelMin);
						_lbs.push(labelMax);
					}else{
						var currentValue = labelMin;
						
						while(currentValue <= labelMax){
							_lbs.push(currentValue);
							if(currentValue == labelMin){
								currentValue  = Math.ceil((labelMin + interval/100)/interval)*interval;
							}else{
								currentValue = Math.ceil((currentValue + interval) * 1000) / 1000; // xiawang: there is a risk of infinite loop in original implementation of using round
							}
						}
						if(_lbs[_lbs.length - 1] < labelMax){
							_lbs.push(labelMax);
						}
					}
					
					return _lbs;
				},
				
				formatNumber: function formatNumber(number, lenLimit){
					var os = "",
						on = 1,
						posNum = number  * percent;
					if(posNum < 0){
						posNum = -number * percent;
						on = -1;
						os = "-";
					}
					
					if(posNum <= 1+1e-6){
						// simply deal with the number less than 1 currently.
						on *= posNum;
						if (posNum.toString().length <= lenLimit) {
							os += posNum;
						}
						else {
							var precision = 2;
							os += posNum.toFixed(precision);
							// eliminate the last "0" if exists
							
							for (var i=os.length-1; i>=0; --i) {
								if (os.charAt(i) == '.') {
									break;
								}
								else if (os.charAt(i) != '0') {
									++i
									break;
								}
							}
							if (i < os.length) {
								os = os.substr(0, i);
							}
						}
					}else{
						
						var power = Math.log(posNum)/Math.LN10 + 1e-6;
						var n = parseInt(power / 3);					
						
						if (n >= NumUnits.length) {
							n = NumUnits.length - 1;
						}
						var fNum = posNum / NumUnits[n].n;
						var sNum = fNum.toString();
						
						if (sNum.length > lenLimit) {
							var separatorIdx = sNum.indexOf('.');
							var fracLen = separatorIdx < 0 ? 0 : sNum.length - separatorIdx + 1,
								intLen = separatorIdx < 0 ? sNum.length : separatorIdx;
							var nPrecision = lenLimit - intLen - 1;
							// 3 here means the factor of the adjacent elements is 1e3.
//							var nPrecision = lenLimit - 2 - parseInt(power) % 3;
							
							
							sNum = fNum.toFixed(nPrecision < 0 ? 0 : nPrecision);
							
						}
						on *= parseFloat(sNum) * NumUnits[n].n;
						os += sNum + NumUnits[n].s;
					}
					
					return os;				
				},
	
				calInterval: function cInt(_max, _min, intAsStep) {
					var interval,	
						diff = (_max - _min);
					if(diff == 0) {
						if(_max == 0) {
							_max = 1;
							_min = -1;
						} else {
							_max = _max * 2;
							_min = _min / 2;
						}
						diff = _max - _min;
					}
					
					interval = 1;
					if(diff < 1){
						while(diff < 1){
							diff *= 10;
							interval /= 10;
						}
					} else if(diff >= 10){
						while(diff >= 10){
							diff /= 10;
							interval *= 10;
						}
					}
	
					if(diff < 1.8){
						interval *= 0.2;
					} else if(diff < 3.1){
						interval *= 0.4;
					} else if(diff < 4.6){
						interval *= 0.5;
					} else if(diff >= 8.1){
						interval *= 2;
					}
	
					if(intAsStep){
						interval = Math.round(interval);
						if(interval < 1){
							interval = 1;
						}
					}else if((interval > 0 && interval < 1) && (parseInt(interval.toFixed(2) * 100) / 100) > 0) {
						interval = parseInt(interval.toFixed(2) * 100) / 100;
					}
					
					return interval;
				}
			});

})();//@ sourceURL=VisChartData.js