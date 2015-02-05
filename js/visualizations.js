function rotateText(names){
	if(names.length > 4 ){
		return 40;
	}else{
		return 0;
	}
}
function xHeight(names,r){
	var word = getArrayMaxElement(names,1);

		// word +=" ";
		if(r>10){
			return getWordWidth2(word);
		}else{
			return getWordHeight(word) * 2;
		}

	}

/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/
function bar(options){
	var m = options.matrix;
	//Answers 
	var names = columnNames(m);
	var r;
	if(options.swap){
		r= rotateText(names);
	}else{
		r= rotateText(m[0]);
	}
	var rot = m.length > 7; rotated : false ? rotated : true;
	for (var i = 1; i < m[0].length; i++) {
		names.push(m[0][i]);
	};
	//Space between legend and chart depentent on length of axistext and rotation
	if(!options.tumb){
			options.legendMargin = xHeight(names,r);
		}else{
			options.legendMargin=0;
		}

	// options.legendMargin = textWidth(getArrayMaxElement(),)

	//Specifications for the chart
	var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction},
		data: {
			x : m[0][0],
			columns : m,
			type: 'bar',
			color: function (color, d) {
				return datacolors.getColor(d,names,options);
			},
			section : {enabled : false}
		},
		bar: {
			width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
    },

    tooltip: {
    	show : options.tooltip,
    	grouped : false
    },
    legend : {
    	show : options.legend
    },
    axis: {
    	rotated : rot,
    	x: {
    		height: options.legendMargin,
    		show : options.axis,
    		label : options.xlabel,
    		type: 'categorized',
    		tick: {
    			rotate : r
    		},
    	},
    	y : {
    		show : options.axis,
    		label : options.ylabel
    	},
    },
};
//Check additional settings
if(options.chartOptions != null){
	settings = visGenerator.addOptions(settings,options.chartOptions);
}
	//render chart
	var chart = c3.generate(settings);

	// Removes side text
/*	if(rot && m.length > 2){
		$(options.container+" .c3-axis-x .tick text").remove();
		// $("#charty2 .c3-axis-x .tick text").remove();
	}*/
	return chart;
	// pollchart.data.push({chart : chart, matrix : matrix});
}
/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/

function histogram(options){
	//discrete data
	var ma = disk(options.matrix);
	var d=ma[0];
	var names = d[0].slice(0);
	//
	if(options.xlabel != null){
	d[0].unshift(options.xlabel);
	}else{
		options.xlabel = "interval"
		d[0].unshift("interval");
	}
	var r = rotateText(names, options);

	options.legendMargin = xHeight(names,70);
	var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			x: options.xlabel,
			columns : d,
			type: 'bar',
			color: function (color, d) {
				console.log(d);

				console.log(ma[1]);
				var myInt = parseInt(options.answer);
				if(d.index != null){
					if(myInt >= ma[1]*d.index && myInt < ma[1]*(d.index+1)){
						return "#EE474D";
					}
				}
				return "#1F4557"
			}
		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},
		axis: {
			x: {
				show : options.axis,
				label : options.xlabel,
				height : options.legendMargin,
				type: 'categorized',
				tick : {
					rotate : 55
				}
			},
			y:{
				show: options.axis,
				label : options.ylabel
			}
		}
	};

	//Check additional settings
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	var chart = c3.generate(settings);
	// 
	$('#chart1 .c3-legend-item').remove();
	return chart;
}

/**
* Plots a line chart
*param{Array} matrix - array holding the table
*/
function lineCat(options){
	optionHandler.pointer = options.id;
	// matrix.unshift(header);
	var names = columnNames(options.matrix);
	var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			x : options.matrix[0][0],
			columns : options.matrix,
			type: 'line',
			color: function (color, d) {
				return datacolors.getColor(d,names,options);
			},

		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},
		axis: {
			x: {
				label : options.xlabel,
				show : options.axis,
				height : 100,
				type: 'categorized',
				tick : {
					rotate : 70
				}
			},
			y :{
				label : options.ylabel,
				show : options.axis,
			}
		}
	};

	//Check additional settings
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}

	var chart = c3.generate(settings);
	return chart;
}

	/**
* Plots a line chart
*param{Array} matrix - array holding the table
*/
function line(options){
	optionHandler.pointer = options.id;
	// matrix.unshift(header);
	var t = new Object();
	var names=columnNames(options.matrix);
	t[options.matrix[1][0]] = options.matrix[0][0];

	var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			xs :t,
			columns : options.matrix,
			type: 'line',
			color: function (color, d) {
				return datacolors.getColor(d,names,options);
			}
		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},
		axis: {
			x: {
				// type: 'categorized',
				show : options.axis,
				label : options.xlabel,
				height : 100,
				tick: {
					fit: false,
					culling: {
                    max: 6 // the number of tick texts will be adjusted to less than this value
                }
            }
        },
        y:{
        	show : options.axis,
        	label: options.ylabel
        }
    },
    point : {
    	show: false
    },
};
if(options.chartOptions != null){
	settings = visGenerator.addOptions(settings,options.chartOptions);
}
var chart = c3.generate(settings);

return chart;
}
/**
* Plots a scatter plot comparing two values
*
* Data format:
* [
* [name, time1,time,2],
* [x,1,2],
* [y,3,4]
* ]	
*param{Array} matrix - array holding the table
*/
function scatter(options){
	var t = new Object();
	var title = new Object();
	var names = columnNames(options.matrix);
	t[options.matrix[1][0]]=options.matrix[0][0];
	title["label"] = options.matrix[1][0];

var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			xs: t,
			columns :options.matrix,
			type: 'scatter',
			color: function (color, d) {
				return datacolors.getColor(d,names,options);
			}

		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},
		axis: {
			x: {
				show : options.axis,
				label: options.xlabel,
				tick: {
					fit: false
				}
			},
			y: {
				show : options.axis,
				label: options.ylabel,
				tick: {
					fit: false
				},
			}
		},
		legend: {
			show: false
		},
		tooltip: {
			show : false
		},
		point: {
			r: function(d){return 4}
		}
		
	};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	var chart = c3.generate(settings);
	return chart;
}
/**
* Plots a scatter plot that turns into a linear regression chart
*
* Data format:
* [
* [name, time1,time,2],
* [x,1,2],
* [y,3,4]
* ]	
*param{Array} matrix - array holding the table
*/
function regressionline(options){
	optionHandler.pointer = options.id;
	var t = new Object();
	var title = new Object();
	var names = columnNames(options.matrix);
	var toggle = 0;
	t[options.matrix[1][0]]=options.matrix[0][0];
	var y = options.matrix[1][0];
	var x = options.matrix[0][0];
	title["label"] = options.matrix[1][0];
var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			xs: t,
			columns : options.matrix,
			type: 'scatter',
			color: function (color, d) {
				console.log(d);
				return datacolors.getColor(d,names,options);
			},
			onclick: function (d, i) { 
				console.log(toggle);
				var id = d.x;
				if(toggle==0){
					var data2 = matrixToPoints(options.matrix);

					console.log(data2);
					setChartText(y + " increases " + Math.round(increase) + " for each " +  x);
					chart.load({
						columns: 
						[
						[data2[1][0][0],data2[1][0][1],data2[1][0][data2[1][0].length-1]],
						[data2[1][1][0],data2[1][1][1],data2[1][1][data2[1][1].length-1]]
						]
						,
						type:'line'
					});
					toggle = 1;
				}else{
					removeChartText();
					var m = matrix;
					m[0].unshift(x);
					m[1].unshift(y);
					chart.load({
						columns: 
						m
						,
						type:'scatter'
					});
					toggle = 0;
				}

			},

		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},
		axis: {
			x: {
				show : options.axis,
				label: options.xlabel,
				tick : {
					fit : false,
					// count : 8,
					format: function (x) { return Math.floor(x); }
				}
			},
			y: {
				show : options.axis,
				label: options.ylabel
			}
		},
		legend: {
			show: false
		},
		tooltip: {
			show : false
		},
		point: {
			r: function(d){return 4}
		}
		
	};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	var chart = c3.generate(settings);


return chart;
}


/**
* Takes an array of values, and plots the distribution
*param{Array} array - array with numeric values
* Data convention:
* [name,value1, value2, ... ,value-n]
*/
function normalLine(array){
	var buckets = disk(array);
	var settings = {
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		interaction: { enabled:  options.interaction },
		data: {
			columns:[buckets[1]],
			type: 'bar'
		},
		bar: {
			width: {
				ratio: 0.8
			},
		},
		axis: {
			x: {
				show : pollchart.options.axis,
				type: 'category',
				categories : buckets[0],
				tick: {
					rotate: 75
				},
				height: 100
			},
			y: {
				show : pollchart.options.axis,
			}
		}
	};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	var chart = c3.generate(settings);
	return chart;
}

/**
* Plots composition in a piechart
*param{Array} array - array with numeric values in percent
*
* Data convention:
* [name,value1, value2, ... ,value-n]
*/

function pie(options){
	console.log(options);
	var m = options.matrix.slice(1,options.matrix.length);
	var names = columnNames(options.matrix);
	var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			columns: m,
			type : 'pie',
			color: function (color, d) {
				return datacolors.getColor(d,names,options);
			}
		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},
		pie :{
			label :{
				show : options.axis,
			}
		}
		
	};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	var chart = c3.generate(settings);
	return chart;
}
/**
* Plots composition in a piechart
*param{Array} array - array with numeric values in percent
*
* Data convention:
* [name,value1, value2, ... ,value-n]
*/

function donut(options){
	console.log(options);
	var m = options.matrix.slice(1,options.matrix.length);
	var names = columnNames(options.matrix);
	var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			columns: m,
			type : 'donut',
			color: function (color, d) {
				console.log(options.color);
				return datacolors.getColor(d,names,options);
			}
		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},
		pie :{
			label :{
				show : options.axis,
			}
		}
		
	};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	var chart = c3.generate(settings);
	return chart;
}
/**
* Plots a regression line of the relation av two datasets
*param{Array} array - array with numeric values in percent
* Data convention
* [[x, x1, x2,..,xn],[y,y1,y2,...,yn]]
*/
function regLine(options){
	optionHandler.pointer = options.id;
	var data = matrixToPoints(options.matrix);
	var settings = {
		interaction: { enabled:  options.interaction },
		bindto: options.container,
		data: {
			columns: [data[1][1]]
		}
		,
		axis: {
			x: {
				show : options.axis,
				label: options.xlabel,
				tick : {
					count : 8,
					format: function (x) { return Math.floor(x); }
				}
			},
			y: {
				show : options.axis,
				label: data[0][1][0],
			}
		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},
	};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	var chart = c3.generate(settings);
	return chart;
}

/**
* Plots stacked area chart
*/
function stackedArea(matrix){
	var obj = new Object();
	obj[matrix[0][0]] = '#ff0000';

	matrix.shift();
	var settings = {
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		interaction: { enabled:  options.interaction },
		data: {
			// x : header[0],
			columns:
			matrix
			,
			types: 'area-spline',
			/*colors: {
				0 : '#0000ff',
				'1-3' : '#FF0000',
				'4-6' : '#00FF00',
				'7-9' : '#0000FF'
			},*/
			// groups: [["0","1-3","4-6","7-9"]]
		},
		axis : {
			x: {
				show : pollchart.options.axis,
				type: 'categorized',
				height: 90,
				tick : {
					rotate: 75,
					fit : true,
					// culling: {
     //                max: 8 // the number of tick texts will be adjusted to less than this value
     //            }
 },

},
y : {
	show : pollchart.options.axis,
	label : header[0],
}
},

};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	chart = c3.generate(settings);
	return chart;
}


/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/
function stackedBar(options){
	// optionHandler.pointer = options.id;
	var toggle = 1;
	console.log(options.matrix);
	var r;
	var rot = options.matrix.length > 3; rotated : false ? rotated : true;
	// var rot = true;
	// if(rot){r = 70;}

	var names2 = columnNames(options.matrix);
	var names = names2.slice(1,names2.length);

	if(options.swap){
		r= rotateText(names,options.matrix[0]);
	}else{
		r= rotateText(options.matrix[0],names);
	}
	// var xMargin = xHeight(options);
	if(!options.tumb){
			options.legendMargin = xHeight(names,r);
	}
	// matrix.unshift(header);
	var settings = {
		bindto: options.container,
		interaction: { enabled: options.interaction },
		data: {
			x : options.matrix[0][0],
			columns : options.matrix,
			onclick: function (d, i) { 
				var id = d.x;
				if(toggle==0){
					chart.groups([
						names]);
					toggle=1;
				}else{
					chart.groups([
						[]
						]);
					toggle=0;
				}

			},
			type: 'bar',
			color: function (color, d) {
				return datacolors.getColor(d,names2,options);
			},
			groups :  [names],
		},
		axis: {
			rotated : rot,
			x: {
				label : options.xlabel,
				show : options.axis,
				height: options.legendMargin,
				type: 'categorized',
				tick: {
					rotate: 75
				},
			},
			y : {

				show : options.axis,
				label: options.ylabel,
			}
		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},
	};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}

	var chart = c3.generate(settings);
	// if(rot){
	// 	// $(options.container+" .c3-axis-x .tick text").css("text-anchor","start");
	// }
	return chart;
}

function bubble(options){
	optionHandler.pointer = options.id;
	var t = new Object();
	var title = new Object();
	t[options.matrix[1][0]]=options.matrix[0][0];
	title["label"] = options.matrix[1][0];

	var values = options.matrix.pop();
	var my = values.shift();
	var max = ss.max(values);
	max = max/100;

	var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			xs: t,
			columns : options.matrix,
			type: 'scatter',
			label: function(){return "Radie" },
			color: function (color, d) {
            // d will be 'id' when called for legends
            return datacolors.colors[0][0];
        }
    },
    axis: {
    	x: {
    		show : options.axis,
    		label: matrix[0][0],
    		tick: {
    			fit: false
    		}
    	},
    	y: {
    		show : options.axis,
    		label: matrix[1][0],
    	}
    },
    legend: {
    	show: false
    },
    tooltip: {
    	show : options.tooltip,
    	format: {
    		title: function (d) { return 'Radie'; },
    		name:  function () { return values[0] },
    		value: function (value, ratio, id,d) {

    			return values[getIndex(matrix[1],value) ];
    		}
    	},
    	contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
    		var $$ = this, config = $$.config,
    		titleFormat = config.tooltip_format_title || defaultTitleFormat,
    		nameFormat = config.tooltip_format_name || function (name) { return name; },
    		valueFormat = config.tooltip_format_value || defaultValueFormat,
    		text, i, title, value, name, bgcolor;
    		for (i = 0; i < d.length; i++) {
    			if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

    			if (! text) {
    				title = titleFormat ? titleFormat(d[i].x) : d[i].x;
    				text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" +  my + "</th></tr>" : "");
    			}

    			// name = nameFormat(d[i].name);
    			// console.log(name);
    			name = "value";
    			value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
              // bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
              bgcolor = datacolors.colors[0][0];
              text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
              text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
              text += "<td class='value'>" + value + "</td>";
              text += "</tr>";
          }
          return text + "</table>";
      },
  },
  point: {
  	r: function(d){ return values[d.index + 1] / max;}
  }

};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	// var sum = getArrayMax(values);
	var chart = c3.generate(settings);
return chart;
}

function slideBar(options){
	createSlider();
	var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			x : header[0],
			rows : [header,matrix[0]],
			type: 'bar',

		},
		tooltip: {
			show : pollchart.options.tooltip
		},
		legend : {
			show : pollchart.options.legend
		},
		axis: {
			x: {
				show : pollchart.options.axis,
				type: 'categorized'
			},
			y : {
				show : pollchart.options.axis,
			}
		}
	};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	var chart = c3.generate(settings);
	return chart;
}
function sliderDonut(options){
	// createSlider(options.container,options.id,4);
	var settings = {
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			x: options.matrix[0][0],
			columns : options.matrix,
			type: 'donut',

		},
		donut: {
			title: function(){return options.xlabel}
		},
		axis: {
			x: {
				type: 'categorized'
			}
		}
	};
	if(options.chartOptions != null){
		settings = visGenerator.addOptions(settings,options.chartOptions);
	}
	var chart = c3.generate(settings);
	return chart;
	
}
function heatmap(options){
	console.log("*******************HEATMAP***************************************" );

	var m = options.matrix;
	var head =  m[0].slice(1,m[0].length);
	console.log(m);
	m=m.slice(1,m.length);
	var dim_1 = columnNames(m);
	var textLength = 0;
	var dim_2 = head;
	var rowlength = dim_1.length;
	var columnlength = dim_2.length;
	var maxSize = rowlength > columnlength ? rowlength : columnlength;
	var array = matrixToRevArray(m);
	var w = $(options.container).width();
	
	var gridSize = Math.floor(w / (maxSize + 1));
	var padding = gridSize/maxSize;
	// if($("#charty1").height() > 1){
		var h = $(options.container).height();
	// }else{
		// var h =  w;
	// }
	
	// var h = 900;
	var shiftR = 10;
	var margin = { top: 5, right: 0, bottom: 0, left: 0 },
	width =  w- margin.left - margin.right,
	height = h - margin.top - margin.bottom,

	legendWidth = (gridSize/4);
	var centerPadding = (w-(textLength + gridSize * columnlength))/2;
          //antal färger

          var index = options.container.split("charty").slice(-1)[0];
          buckets = 8;
          options.classname="tumbheat";
          var svg = d3.select(options.container).append("svg")
          .attr("class","tumbheat")
          .attr("id","tumbheat" + index)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var maxNum = Math.round(d3.max(array,function(d){ return d; }));

          // var colors = colorbrewer.RdYlGn[buckets];
          // var colors = datacolors.colors[5];
          // var colorScale = d3.scale.quantile()
          // .domain([0, buckets - 1, maxNum])
          // .range(colors);

          var colors = [];

// the first color
var color1 = datacolors.colors[options.color][0];

// the second color
var color2 = datacolors.colors[options.color][2];

// the number of colors to generate
var n = 7;

// make an interpolater named rgb
rgb = d3.interpolateRgb(color1, color2);

// use the interpolater to make evenly spaced colors
for(var i = 0; i < n; i++) {
	colors.push(rgb(i/(n-1)));
}
var colorScale = d3.scale.quantile()
.domain([0, buckets - 1, maxNum])
.range(colors);


          //heatmap
          var count=0,count2=0;
          var heatMap = svg.selectAll(".dim2")
          .data(array)
          .enter().append("g")
           // .style("fill", colors[0])
           .attr("class", "dim2");

           var rec = heatMap.append("rect")
           // .attr("x", function(d) { count++; return ((count%columnlength - 1) * gridSize) + textLength*(shiftR)+gridSize; })
           // .attr("y", function(d) { count2++; return ( Math.ceil(count2/(columnlength))-1) * gridSize; })
           .attr("x", function(d) {return (d.row * gridSize + centerPadding); })
           .attr("y", function(d) { return d.col * gridSize; })
           .attr("rx", 4)
           .attr("ry", 4)
           .attr("class", "dim2 bordered")
           .attr("width", gridSize-padding)
           .attr("height", gridSize-padding)
           .attr("class", "square")
           rec.transition()
           .style("fill", function(d) {;return colorScale(d.value); });
           heatMap.append("title").text(function(d) {return d.value; });
       }

       var MAXWORDLENGHT = 7;

       function heatmap2(options,nHeight){
       	$(options.container).css("margin-left",0)
       	var m = options.matrix;
       	//store datanames in dim_2
       	var dim_2 = m[0].slice(1,m[0].length);
       	console.log(dim_2);
       	m=m.slice(1,m.length);
       	//store datanames in dim_1
       	var dim_1 = columnNames(m);

       	// Lenght of the longest word of the datanames
       	var longest = getArrayMax(dim_1);
       	var longest2 = getArrayMax(dim_2);

       	//Set length to maxlenght
       	if(longest > MAXWORDLENGHT){
       		longest = MAXWORDLENGHT;
       	}
       	if(longest2 > MAXWORDLENGHT){
       		longest2 = MAXWORDLENGHT;
       	}

       	var rowlength = dim_1.length;
       	var columnlength = dim_2.length;
       	var maxSize = rowlength > columnlength ? rowlength : columnlength;
       	var array = matrixToRevArray(copyMatrix(m));


       	var w = $(options.container).width();

       	var fontSize = $('.heatlabel').css('font-size');
       	console.log($('.heatlabel').css('font-size'));

/*       	fontSize = 12;
console.log(fontSize);*/
var index = options.id;
		// var h = $(options.container).parent().width() - ($(options.container).parent().width() - $(options.container).height())
		var h =nHeight;
		// var	h = $(options.container).parent().parent().height();
		var titleHight = getWordWidth2("T") * 3;
		var topWord = getArrayMaxElement(dim_2,0).trunc(MAXWORDLENGHT);
		var marginTop = getWordWidth2(topWord);
		var longestElement = getArrayMaxElement(dim_1,0).trunc(MAXWORDLENGHT)+"  %";
		var textLength = getWordWidth2(longestElement);
		// var gridSize = Math.floor((h-marginTop)/(maxSize+2));
		var gridSize = Math.floor((w-textLength)/(maxSize+2));
		var gridSize2 = Math.floor((h-marginTop-titleHight)/(maxSize+2));
		if(gridSize2<gridSize){
			gridSize = gridSize2;
		}
		var padding = gridSize/maxSize;

		var shiftR = 10;
		var margin = { top: 0, right: 0, bottom: 0, left: 0 },
		width =  w- margin.left - margin.right,
		height = h - margin.top - margin.bottom,

		legendWidth = (gridSize/1.5);
		var cc;


		if(!options.swap){
			cc = rowlength;
		}else{
			cc = columnlength;
		}


		// var centerPadding = (width-textLength - (gridSize * cc))/2;
	var centerPadding = 0;
	var index = options.container.split("charty").slice(-1)[0];
          //LEGEND RANGE
          var  buckets = getMatrixMax(options.matrix);
          var numberForm = textformat.numberShorten(buckets);
          var reduceNum = numberForm[0];
          var valueLabel = numberForm[1];
          console.log(numberForm);
          var svg = d3.select(options.container).append("svg")
          .attr("class","heat")
          .attr("id","tumbheat" + index)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var maxNum = Math.round(d3.max(array,function(d){ return d; }));

          var colors = [];

// the first color
var color1 = datacolors.colors[options.color][0];

// the second color
var color2 = datacolors.colors[options.color][2];

// the number of colors to generate
var n = 7;

// make an interpolater named rgb
rgb = d3.interpolateRgb(color1, color2);

// use the interpolater to make evenly spaced colors
for(var i = 0; i < n; i++) {
	colors.push(rgb(i/(n-1)));
}
var colorScale = d3.scale.quantile()
.domain([0, buckets - 1, maxNum])
.range(colors);

var question2Title = svg.append("text")
.attr("class", "heatquestiontitle")
.attr("x", centerPadding + textLength*2)
.attr("y", titleHight)         
.style("font-size", fontSize+"px")
.style("font-family","Lato")
.style("text-anchor","start")
.style("fill","#FF0000")
.text(options.ylabel)
.style("font-weight","bold");

var question1Title = svg.append("text")
.attr("class", "heatquestiontitle")
.style("font-size", fontSize+"px")
.style("fill","#FF0000")
.style("font-family","Lato")
.style("text-anchor","end")
.text(options.xlabel)
.style("font-weight","bold")
           .attr("transform", function(d,i) {    // transform all the text elements
  return "translate(" + // First translate
  (titleHight/2+ centerPadding) + ","+(marginTop)+") " + // Translation params same as your existing x & y 
    "rotate(-90)"            // THEN rotate them to give a nice slope
});

          //Header
          var dim1Labels = svg.selectAll(".dim1Label")
          .data(dim_1)
          .enter().append("text")
          .text(function (d) { 
          	// if(d.length>12){return d.substring(0,12)+"...";} 
          	// else {
          		if(d==null){
          			if(options.norm){
          				return 0 + " %"
          			}
          			return 0;
          		}
          		if(options.norm){
          			return d.trunc(MAXWORDLENGHT) + " %"
          		}
          		return d.trunc(MAXWORDLENGHT); })
          .attr("x", centerPadding + titleHight)
          .attr("y", function (d, i) { return i * gridSize + gridSize/2 + marginTop + titleHight;})
          .style("font-weight","bold")
          .style("font-size", fontSize+"px")
          .style("font-family","Lato")
          .style("text-anchor", "start")
          .attr("class","heatlabel");

     //Header
     var dim2Labels = svg.selectAll(".dim2Label")
     .data(dim_2)

     .enter().append("text")

                // .text(function(d) { return d; })
                // .attr("x", function(d, i) { return centerPadding; })

                // .attr("y", 0)
                // .style("text-anchor", "middle")
                // .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class","heatlabel")
                // .attr("dy", ".71em")
                .text(function(d) {

                	if(d==null){
                		if(options.norm2){
                			return 0 + " %";
                		}
                		return 0;
                	}

                	if(options.norm2){
                		return d + " %";
                	}
                	return d.trunc(MAXWORDLENGHT);})
                .style("font-weight","bold")
                .style("font-family","Lato")
                .style("font-size", fontSize+"px")
                .attr("text-anchor","center")
				.attr("transform", function(d,i) {    // transform all the text elements
  return "translate(" + // First translate
  ((i * gridSize) + textLength+gridSize/2 + centerPadding+ titleHight) + ","+(marginTop+titleHight)+") " + // Translation params same as your existing x & y 
    "rotate(-45)"            // THEN rotate them to give a nice slope
});
          //heatmap
          var count=0,count2=0;
          var heatMap = svg.selectAll(".dim2")
          .data(array)
          .enter().append("g")
           // .style("fill", colors[0])
           .attr("class", "dim2");
           var rec = heatMap.append("rect")
           .attr("x", function(d) {return (d.row * gridSize) + textLength + centerPadding+ titleHight; })
           .attr("y", function(d) { return d.col * gridSize + marginTop+titleHight; })
           .attr("rx", 4)
           .attr("ry", 4)
           .attr("class", "dim2 bordered")
           .attr("width", gridSize-padding)
           .attr("height", gridSize-padding)
           .attr("class", "square")
           rec.transition()
           .style("fill", function(d) {
           	if(d.value==null){
           		return colorScale(d.value);
           	}
           	return colorScale(d.value); });
           heatMap.append("title").text(function(d) {return d.value; });

           var count=0,count2=0;
           heatMap.append("text")

           .text(function(d) {
           	if(d.value==null){
           		return (d.value/reduceNum).toFixed(1);
           	}
           	if(reduceNum!=1){ return (d.value/reduceNum).toFixed(1);}
           	else{
           		return d.value;
           	} })
           .attr("x", function(d) {return (d.row * gridSize) + textLength + gridSize/2 + centerPadding+ titleHight;  })
           .attr("y", function(d) { ; return d.col * gridSize + marginTop + gridSize/2 + titleHight; })
           .attr("text-anchor","middle")
           .style("font-size", gridSize/3+"px")
           .style("font-family","Lato")
          // .style("font-family", "Calibri")
          .attr("class", "rectext")

          .style("stroke-width","0px")
          .style("text-shadow","none");

          var numberlabel = svg.append("text")
          .attr("class", "heatnumberform")
          .attr("x", 0 + centerPadding+ titleHight)
          .attr("y", (rowlength) * (gridSize) + legendWidth + marginTop +titleHight )         
          .style("font-size", fontSize+"px")
          .style("font-family","Lato")
          .text(valueLabel)
          .style("font-weight","bold");

          var ledc=0;
          var legend = svg.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), function(d) {return d; })
          .enter().append("g")
          .attr("class", "legend");
          legend.append("rect")
          .attr("x", function(d, i) { return  (i%4 * legendWidth + textLength)+ centerPadding+ titleHight ; })
          .attr("y", function(d, i) {k=1; if(i>3){k=2} return (rowlength) * (gridSize) + k * legendWidth + marginTop + legendWidth + titleHight; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", legendWidth*0.8)
          .attr("height", legendWidth*0.8)
          .style("fill", function(d, i) { return colors[i]; })
          .attr("class", "square");
          
          legend.append("text")
          .attr("class", "heatlegend")
          .text(function(d) { return  Math.round(d )+"+"; })
          .attr("x", function(d, i) { return  (i%4 * legendWidth + textLength + legendWidth/2)+ centerPadding+ titleHight ; })
          .attr("y", function(d, i) {k=1; if(i>3){k=2} return (rowlength) * (gridSize) + k * legendWidth+ marginTop+ legendWidth/2 + legendWidth + titleHight; })
          .attr("text-anchor","middle")
          .attr("class", "heatlegend")
          .style("font-family","Lato")
          .style("font-size", (legendWidth/3)+"px");
       /*     .attr("x", function(d, i) { return gridSize * 11 + 25; })
            .attr("y", function(d, i) { return (i * legendWidth + 20); })
            */
            var title = svg.append("text")
            .attr("class", "legendtitle")
            .attr("x", 0 + centerPadding+ titleHight)
            .attr("y", rowlength * (gridSize) + marginTop + legendWidth *2 + legendWidth +titleHight)         
            .style("font-size", fontSize+"px")
            .style("font-family","Lato")
            .text("Legend")
            .style("font-weight","bold");


        }