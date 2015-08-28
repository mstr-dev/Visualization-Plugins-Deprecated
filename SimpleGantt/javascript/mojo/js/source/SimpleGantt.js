(function () { 
    if (!mstrmojo.plugins.SimpleGantt) {
        mstrmojo.plugins.SimpleGantt = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.SimpleGantt.SimpleGantt = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.SimpleGantt.SimpleGantt",
            cssClass: "simplegantt",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires four or more attributes.",
            externalLibraries: [{url:"https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"}],
            useRichTooltip: true,
            reuseDOMNode: true,
            plot:function(){

var taskArray = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS);

var div = d3.select(this.domNode).append("div")   
.attr("id", "tag");              

var w = parseInt(this.domNode.style.width, 10);
var h = parseInt(this.domNode.style.height, 10);

var svg = d3.select(this.domNode)
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("class", "svg");	
			
var dateFormat = d3.time.format("%m/%d/%Y %H:%M:%S %p"); 
var timeScale = d3.time.scale()
	.domain([d3.min(taskArray, function(d) {
		return dateFormat.parse(d.startTime);
	  }),
	  d3.max(taskArray, function(d) {
		return dateFormat.parse(d.endTime);
	  })
	])
	.range([0, w - 125]);

var categories = new Array();

for (var i = 0; i < taskArray.length; i++) {
	categories.push(taskArray[i].type);
}

var catsUnfiltered = categories; 

categories = checkUnique(categories);

makeGant(taskArray, w, h);

function makeGant(tasks, pageWidth, pageHeight) {

	var topPadding = 0; 
	var leftPadding = 85; 
	var bottomPadding = 50; 
	var rightPadding = 0; 

	var spacing = 4;
	var barHeight =  d3.round((pageHeight - topPadding - bottomPadding - (spacing * tasks.length))/tasks.length); //was 20
	var gap = barHeight + spacing;
	var colorScale   = d3.scale.category10();

	makeGrid(leftPadding, topPadding, pageWidth, pageHeight);
	drawRects(tasks, gap, topPadding, leftPadding, barHeight, colorScale, pageWidth, pageHeight);
	vertLabels(gap, topPadding, leftPadding, barHeight, colorScale);

}

function drawRects(theArray, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w, h) {

var bigRects = svg.append("g")
  .selectAll("rect")
  .data(theArray)
  .enter()
  .append("rect")
  .attr("x", 0)
  .attr("y", function(d, i) {
	return i * theGap + theTopPad - 2;
  })
  .attr("width", function(d) {
	return w - theSidePad / 2;
  })
  .attr("height", theGap)
  .attr("stroke", "none")
  .attr("fill", function(d) {
	for (var i = 0; i < categories.length; i++) {
	  if (d.type == categories[i]) {
		return d3.rgb(theColorScale(i));
	  }
	}
  })
  .attr("opacity", 0.2);
  

var rectangles = svg.append('g')
  .selectAll("rect")
  .data(theArray)
  .enter();

var innerRects = rectangles.append("rect")
  .attr("rx", 3)
  .attr("ry", 3)
  .attr("x", function(d) {
	return timeScale(dateFormat.parse(d.startTime)) + theSidePad;
  })
  .attr("y", function(d, i) {
	return i * theGap + theTopPad;
  })
  .attr("width", function(d) {
	return (timeScale(dateFormat.parse(d.endTime)) - timeScale(dateFormat.parse(d.startTime)));
  })
  .attr("height", theBarHeight)
  .attr("stroke", "none")
  .attr("fill", function(d) {
	for (var i = 0; i < categories.length; i++) {
	  if (d.type == categories[i]) {
		return d3.rgb(theColorScale(i));
	  }
	}
  })

var rectText = rectangles.append("text")
  .text(function(d) {
	return d.task;
  })
  .attr("x", function(d) {
	return (timeScale(dateFormat.parse(d.endTime)) - timeScale(dateFormat.parse(d.startTime))) / 2 + timeScale(dateFormat.parse(d.startTime)) + theSidePad;
  })
  .attr("y", function(d, i) {
	//return i * theGap + 14 + theTopPad;
	return i * theGap + d3.round(theGap/2) + theTopPad;
  })
  .attr("font-size", 12)
  .attr("text-anchor", "middle")
  .attr("text-height", theBarHeight)
  //.attr("fill", "#fff");
  .attr("fill", "#222222");


  rectText.on('mouseover', function(e) {
  // console.log(this.x.animVal.getItem(this));
  var tag = "";

  if (d3.select(this).data()[0].details != undefined) {
	tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
	  "Type: " + d3.select(this).data()[0].type + "<br/>" +
	  "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
	  "Ends: " + d3.select(this).data()[0].endTime + "<br/>" +
	  "Details: " + d3.select(this).data()[0].details;
  } else {
	tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
	  "Type: " + d3.select(this).data()[0].type + "<br/>" +
	  "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
	  "Ends: " + d3.select(this).data()[0].endTime;
  }
  var output = document.getElementById("tag");

  var x = this.x.animVal.getItem(this) + "px";
  var y = this.y.animVal.getItem(this) + 25 + "px";

  output.innerHTML = tag;
  output.style.top = y;
  output.style.left = x;
  output.style.display = "block";
}).on('mouseout', function() {
  var output = document.getElementById("tag");
  output.style.display = "none";
});

innerRects.on('mouseover', function(e) {
  //console.log(this);
  var tag = "";

  if (d3.select(this).data()[0].details != undefined) {
	tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
	  "Type: " + d3.select(this).data()[0].type + "<br/>" +
	  "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
	  "Ends: " + d3.select(this).data()[0].endTime + "<br/>" +
	  "Details: " + d3.select(this).data()[0].details;
  } else {
	tag = "Task: " + d3.select(this).data()[0].task + "<br/>" +
	  "Type: " + d3.select(this).data()[0].type + "<br/>" +
	  "Starts: " + d3.select(this).data()[0].startTime + "<br/>" +
	  "Ends: " + d3.select(this).data()[0].endTime;
  }
  var output = document.getElementById("tag");

  var x = (this.x.animVal.value + this.width.animVal.value / 2) + "px";
  var y = this.y.animVal.value + 25 + "px";

  output.innerHTML = tag;
  output.style.top = y;
  output.style.left = x;
  output.style.display = "block";
}).on('mouseout', function() {
  var output = document.getElementById("tag");
  output.style.display = "none";

});
}

function makeGrid(theSidePad, theTopPad, w, h) {

var xAxis = d3.svg.axis()
  .scale(timeScale)
  .orient('bottom')
  //.ticks(d3.time.days, 1)
  .tickSize(-h + theTopPad + 20, 0, 0);
  //.tickFormat(d3.time.format('%m/%d'));

var grid = svg.append('g')
  .attr('class', 'grid')
  //.attr('transform', 'translate(' + theSidePad + ', ' + (h - 50) + ')')
  .attr('transform', 'translate(' + theSidePad + ', ' + (h - 25) + ')')
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "middle")
  .attr("fill", "#444444")
  .attr("stroke", "none")
  .attr("font-size", 11)
  .attr("dy", "1em");
}

function vertLabels(theGap, theTopPad, theSidePad, theBarHeight, theColorScale) {
var numOccurances = new Array();
var prevGap = 0;

for (var i = 0; i < categories.length; i++) {
  numOccurances[i] = [categories[i], getCount(categories[i], catsUnfiltered)];
}

var axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
  .selectAll("text")
  .data(numOccurances)
  .enter()
  .append("text")
  .text(function(d) {
	return d[0];
  })
  .attr("x", 10)
  .attr("y", function(d, i) {
	if (i > 0) {
	  for (var j = 0; j < i; j++) {
		prevGap += numOccurances[i - 1][1];
		// console.log(prevGap);
		return d[1] * theGap / 2 + prevGap * theGap + theTopPad;
	  }
	} else {
	  return d[1] * theGap / 2 + theTopPad;
	}
  })
  .attr("font-size", 14)
  .attr("text-anchor", "start")
  .attr("text-height", 14)
  .attr("fill", function(d) {
	for (var i = 0; i < categories.length; i++) {
	  if (d[0] == categories[i]) {
		//  console.log("true!");
		return d3.rgb(theColorScale(i)).darker();
	  }
	}
  });

}

//from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
function checkUnique(arr) {
var hash = {},
  result = [];
for (var i = 0, l = arr.length; i < l; ++i) {
  if (!hash.hasOwnProperty(arr[i])) { //it works with objects! in FF, at least
	hash[arr[i]] = true;
	result.push(arr[i]);
  }
}
return result;
}

//from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
function getCounts(arr) {
var i = arr.length, // var to loop over
  obj = {}; // obj to store results
while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
return obj;
}

// get specific from everything
function getCount(word, arr) {
return getCounts(arr)[word] || 0;
}



}})}());
