var tables  ={
	//[con,cat]
	questions : [
	// 	Cat    0      1     2
	/*Con 0*/[null,[1,1],[1,2]],
	/*Con 1*/[[1,0],[2,1],[2,2]],
	/*Con 2*/[[2,0],[3,1],[3,2]],
	/*Con 3*/[[3,0]]
	],

	charts    :[
	[[histogram],[pie,bar/*,bar2*/],[stackedBar,heatmap,lineCat,bar/*,bar2*/]],
	[[scatter,line,regressionline],[lineCat,stackedBar,bar/*,bar2*/,pie],[bubble]],
	[[bubble]]
	]
	,
	charts2    :[
	[[histogram],[pie,bar/*,bar2*/],[stackedBar,heatmap2,lineCat,bar/*,bar2*/]],
	[[scatter,line,regressionline],[lineCat,stackedBar,bar/*,bar2*/,pie],[bubble]],
	[[bubble]]
	]
	,
};

function getvistypes(cat,con,single){
	var r = tables.questions[con][cat];
	if(single){
		return getvistable2(r[0],r[1]);
	}else{
		return getvistable(r[0],r[1]);
	}
	
}
function getvistable(con,cat){
	console.log(con +" - " + cat);
	return tables.charts[con-1][cat];
}
function getvistable2(con,cat){
	console.log(con +" - " + cat);
	return tables.charts2[con-1][cat];
}
/*
* Cointains color scheme for the and function to get a color
*/
var datacolors = {
	colors : [
	['#02A79C','#88CBC4','#1F4557','#8FC043','#D2E090','#5A6C40','#EF921A','#F1DB71'],
	['#8FC043','#D2E090','#5A6C40','#F2F7D8','#EF921A','#F1DB71','#901F2F','#FFF608'],
	['#EF921A','#F1DB71','#901F2F','#FFF608','#D12A09','#6A2383','#9360A4','#5F5858'],
	['#D12A09','#6A2383','#9360A4','#5F5858','#02A79C','#88CBC4','#1F4557','#8FC043'],
	],
	//Background color of tiles
	tileBackground :  '#FFF6c8',
	highlightColor : "#EE474D",
	curretGroup : 0,
	count : 0,
	getColor : function(group,names,isRow){
		var currColor = optionHandler.array[optionHandler.pointer].color;
		console.log(" v-----------------NAMES---------------------v");
		console.log(names);
		console.log(" v----------------GROUPS---------------------v");
		console.log(group);
		index = 0;
		datacolors.index = (datacolors.index + 1) % (datacolors.colors[0].length);
		if($.inArray(group,names) != -1){
			return datacolors.colors[currColor][getIndex2(names,group)];
		}else {
			//if users choice
			if(optionHandler.array[optionHandler.pointer].answer != null){
				console.log(optionHandler.array[optionHandler.pointer].answer);
				if(group.id==optionHandler.array[optionHandler.pointer].answer || group == optionHandler.array[optionHandler.pointer].answer){
				//Change legend color
				// $(".c3-legend-item-"+optionHandler.array[optionHandler.pointer].answer +" .c3-legend-item-tile" ).css("fill",this.highlightColor);

				// var answer = optionHandler.array[optionHandler.pointer].answer.substring(0,optionHandler.array[optionHandler.pointer].answer.length-1);
				var answer = stripPunctuationAndHyphenate(optionHandler.array[optionHandler.pointer].answer);
				console.log(answer);
				$(".c3-legend-item-" +answer+"- .c3-legend-item-tile").css("fill",this.highlightColor)
				return this.highlightColor;
			}
		}
			// if(index==2){
			// 	datacolors.count++;
			// 	if(datacolors.count.length == count){
			// 		datacolors.count=0;
			// 	}
			// }
			// if(group.id == "frequency" || group.id == "mean" || isRow){
			// 	if(datacolors.colors[pollchart.options.colorscheme][group.index] == null){
			// 		return datacolors.colors[currColor][getIndex2(names,group.id)];
			// 	}
			// 	return datacolors.colors[currColor][group.index];
			// 			// console.log(datacolors.colors[pollchart.options.colorscheme][group.index]);
			// 			// return "#FF0000";
			// 		}else{
				console.log(getIndex2(names,group.id));
				return datacolors.colors[currColor][getIndex2(names,group.id)];

					// }
				}

			}
		}

function stripPunctuationAndHyphenate(string) {
return string.replace(/[\.,\\/#!$%\^&\*;:{}=_`~()]/g,"").replace(/\s{2,}/g,"-");
}

var  eventHandler = function(){
	
	$(".norm "+"#charty1").click(
		function(){
			 alert('button clicked');
		});
}
/**
*	flashpoll handles fetching and parsing data from flashpoll
*/
var flashpoll = {
	visualizeSet : function (structure,data,frequency,questions,options){
		//functions + questions
		var visualizationTypes = flashpoll.calculateVisualizations(structure,data,questions,false);
		// pollchart.nrOfCharts = 0;
		for (var i = 0; i < visualizationTypes.length; i++) {
			if(visualizationTypes[i].ids.length==1){
				var matrix = flashpoll.getSingeMatrix(structure,frequency,visualizationTypes[i].ids[0]);
				// console.log(matrix);
				if(matrix[1][0]!=null){
					for (var u = 0; u < visualizationTypes[i].types.length; u++) {
						addInfo();
						var rnd = Math.floor(Math.random()*4);
						pollchart.options.colorscheme = rnd;
						var variable = {};
						for (var key in pollchart.options) {
							variable[key]  = pollchart.options[key];
						}
						pollchart.optionChart.push(variable);
						pollchart.chartVis.push(functionName(visualizationTypes[i].types[u]));
						pollchart.currentCharts[pollchart.chart[pollchart.nrOfCharts-1]] = {chart : [i,u], data : data, question : questions};
						var cont = "#"+pollchart.chart[pollchart.nrOfCharts-1];	
						var op = options;
						op.matrix = matrix;
						op.container = cont;
						visualizationTypes[i].types[u](op);
					};
				}
			}
			else{
				for (var u = 0; u < visualizationTypes[i].types.length; u++) {
					var matrix=flashpoll.getDoubleMatrix(structure,data,visualizationTypes[i].ids);
					if(matrix==null){
						continue;
					}
					addInfo();
					var rnd = Math.floor(Math.random()*4);
					pollchart.options.colorscheme = rnd;
					var variable = {};
					for (var key in pollchart.options) {
						variable[key]  = pollchart.options[key];
					}
					pollchart.optionChart.push(variable);
					pollchart.chartVis.push( functionName(visualizationTypes[i].types[u]));
				
					pollchart.currentCharts[pollchart.chart[pollchart.nrOfCharts-1]] = {chart : [i,u], data : data, question : questions};
						var cont = "#"+pollchart.chart[pollchart.nrOfCharts-1];	
						var op = options;
						op.matrix = matrix;
						op.container = cont;
					visualizationTypes[i].types[u](op);
					// addInfo();					
					// pollchart.currentCharts[pollchart.chart[pollchart.nrOfCharts-1]] = {chart : [i,u,], data : data, question : question};
					// chartDataModel(visualizationTypes[i].types[u],matrix);
				};
			}

		}
			console.log(pollchart.chartVis);
		// console.log(pollchart.optionChart);
		new Masonry(container, { "columnWidth": ".tumbchart", "itemSelector": ".tumbchart", "gutter": ".gutter-sizer" })
	},
	/*
	*Visualize one graph from a dataset
*param{json} data - jsonfile with the polldata
*param{array} question - array containing the positions of the qustions in the poll
*param{int} nr - nr of what chart to use
*/
visualizeChart : function(structure,data,frequency,question,chart){
	var matrix;
	// createTable();
	pollchart.nrOfCharts = 0;
	var dt = "frequency";
	if(question.length==1){
		matrix =  flashpoll.getSingleMatrix(structure,data,question);
		addInfo2(data.name,structure.title);
	}
	else{
			var matrix=flashpoll.getDoubleMatrix(structure,data,question);
					if(matrix==null){
						return;
					}
			var subtitle = "";
			for(i=0; i<question.length; i++){
				subtitle += "-";
				subtitle += structure.questions[question[i]].questionText;
				subtitle += "<br/>"
			}
			addInfo2(data.name,subtitle);
		}
		var cont = "#"+pollchart.chart[pollchart.nrOfCharts-1];	
						var op = defaultOptions;
						op.matrix = matrix;
						op.container = cont;
						console.log(chart);
						console.log(chartNames);
		chartNames[chart](op);
	},

	calculateVisualizations : function(structure,data,q,single){
		var array = structure.questions;
		console.log(structure.questions);
		var combinations =[];
		for (var i = 0; i < q.length; i++) {
			if(array[q[i]].questionType=="FREETEXT"){
				continue;
			}
			combinations.push(
			{
				ids:[q[i]],
				types: getListOfCharts([array[q[i]].questionType],single)
			}
			);

			for (var j = i+1; j < q.length; j++) {
				if(array[q[i]].questionType=="FREETEXT"){
					continue;
				}
				combinations.push(
				{
					ids:[q[i],q[j]],
					types: getListOfCharts([array[q[i]].questionType,array[q[j]].questionType],single),

				});
			}
		}
		return combinations;
	},
	getSingeMatrix : function(structure,frequency,id){
		var matrix;
		for (var i = 0; i < frequency.pollResQuestions.length; i++) {
			if(frequency.pollResQuestions[i].questionOrderId == id){
				structure.questions.forEach(function(d){
					if(id==d.orderId){
						matrix = flashpoll.generateSingleMatrix(d,frequency.pollResQuestions[i].pollResultAnswers);
						console.log(matrix);
					}
				});

			}
		};
		return matrix;
	},
	generateSingleMatrix : function(answers,data){
		var matrix = [];
		for (var i = 0; i < answers.answers.length; i++) {
			matrix.push([answers.answers[i].answerText,data[answers.answers[i].orderId].answerScore]);
		};
		matrix.unshift(["Answer","Score"]);
		return matrix;
	},
	getDoubleMatrix : function(structure,data,ids){
		var rows,columns;
		var header = [];
		header.push(structure.title);
		var side = [];
		for (var i = 0; i < structure.questions.length; i++) {

			if(structure.questions[i].orderId==ids[0]){
				console.log(structure.questions[i]);
				rows = structure.questions[i].answers.length;
				for (var y = 0; y < structure.questions[i].answers.length; y++) {
					header.push(structure.questions[i].answers[y].answerText);
				};
			}
			if(structure.questions[i].orderId==ids[1]){
				columns = structure.questions[i].answers.length;
				for (var y = 0; y < structure.questions[i].answers.length; y++) {
					side.push(structure.questions[i].answers[y].answerText);
				};
			}
		};
		var matrix = buildEmptyMatrix(rows,columns);
		//For each user
		data.forEach(function(d){
			//For each question the user have answered
			for (var i = 0; i < d.pollResQuestions.length; i++) {
				//If the question is the first one in the searchlist
				if(d.pollResQuestions[i].questionOrderId==ids[0]){
					console.log(d);
					for (var j = 0; j< d.pollResQuestions[i].pollResultAnswers.length; j++) {
						var answerOrder = d.pollResQuestions[i].pollResultAnswers[j].answerOrderId;
						var score = d.pollResQuestions[i].pollResultAnswers[j].answerScore;
						
						for (var u = 0; u < columns; u++){
							matrix[answerOrder][u] = score;
						};
					};
				};
				if(d.pollResQuestions[i].questionOrderId==ids[1]){
					for (var j = 0; j< d.pollResQuestions[j].pollResultAnswers.length; j++) {
							var answerOrder = d.pollResQuestions[i].pollResultAnswers[j].answerOrderId;
						var score = d.pollResQuestions[i].pollResultAnswers[j].answerScore;
						for (var u = 0; u < matrix[0].length; u++){
							matrix[u][answerOrder] = matrix[u][answerOrder] * score;
						};
					}

				};
			}
		});
	addSideNames(matrix,side);
	matrix.unshift(header);
	return matrix;
	}
}
/**
* Returns the position of the value in the array
*param{Array} array - array to be searched
*param{var} value - value of the object whoms position is searched
*/
function getIndex(array, value){
	for(var i = 1; i < array.length; i++){
		if(value == array[i]){	
			return i;
		}
	}
	return null;
}
/**
* Returns the position of the value in the array
*param{Array} array - array to be searched
*param{var} value - value of the object whoms position is searched
*/
function getIndex2(array, value){
	for(var i = 1; i < array.length; i++){
		if(value == array[i]){	
			return i-1;
		}
	}
	return null;
}
/**
* Gets the headers of a matrix
*param{Array} array - array to be searched
*param{var} value - value of the object whoms position is searchedmas
*/
function columnNames(matrix){
	var ret= []; 
	
	for(var i = 0; i<matrix.length;i++){ret.push(matrix[i][0]);} 
		return ret;
}
function getSumMatrix(matrix){
	var sum=0;
	for(var i = 0; i<matrix.length; i++){
		sum += getSumArray(matrix[i]);
	}
	return sum;
}
function getSumArray(array,offset){
	var sum = 0 ;

	for(var j= offset; j<array.length; j++){
		sum += parseInt(array[j]);
	}
	return sum;
}

function matrixToArray(m){
	var array=[];
	for (var i = 0; i < m.length; i++) {
		for (var j = 1; j < m[i].length; j++) 
			array[(i*m[0].length)+j] = m[i][j];
	};
};
function getArrayMax(a,offset){
	var max = 0;
	for (var i = 1; i < a.length; i++) {
		if(max<a[i].length){
			max=a[i].length;
		}
	}
	return max;
}
function getRowMax(matrix,index,offset){
	var max = 0;
	for (var i = offset; i < matrix.length; i++) {
		if(max<matrix[i][index].length){
			max=matrix[i][index].length;
		}
	}
	return max;
}
/**
*
*/ 
function mergeQ(answers,meta){
	var returnvalue = addMetaToMatrix(buildDataMatrix(answers),meta);
	bar(returnvalue);
}
function buildDataMatrix(answers){
	var ret =[];
	answers.pollResultAnswers.forEach(function(d){
		ret.push([d.answerScore]);
	});
	return ret;
}

function addMetaToMatrix(ret,meta){
	var title = meta.questionText;
	addInfo(title,pollchart.nrOfCharts + 1);
	meta.answers.forEach(function(d){
		ret[d.orderId].unshift(d.answerText);
	});

	header  = ([title,"frequency"]);
	return ret;
}

function functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

var maggio = {
	version : "1.0"
};

var pollchart = {
/**
* Reference to matrix and chartobj
*/
data : [],
/**
*Chart container ids
*/
chart : [],
/**
*Base chart name
*/
chartID : "charty",
chartVis : [],
/**
*Nummer of charts in the visualization
*/
nrOfCharts : 0,
/**
* Default chart options
*/
options : {
	tooltip : true,
	legend : true,
	axis : true,
	colorscheme : 0,
},
/**
*
*/
currentCharts : {},
optionChart : [],

addOption : function(index,option,value){
	pollchart.optionChart[index][option]=value;
}
}

/**
* tables for choosing visualizations
*/

//Flashpoll var
var polldata = {
	questions :[],
}
var questionTypes = [
{id:"FREETEXT",nr:0},
{id:"ORDER",nr:1},
{id:"RADIO", nr:2},
{id:"CHECKBOX",nr:3}
];
var flashpolluserdata;

var matrixArray = [];
/**
* Array holding all the function for different charttypes
*/
var chartFunctions = [bar,line,scatter,regressionline,regressionline,normalLine,pie,stackedArea,stackedBar,bubble,slideBar,slidePie,line,heatmap,histogram];
var chartNames = {
	"bar" : bar,
	"line" : line,
	"scatter" : scatter,
	"regressionline" : regressionline,
	"pie" : pie,
	"stackedbar"  : stackedBar,
	"bubble" : bubble,
	"heatmap" : heatmap2,
	"slidebar" : slideBar,
	"slidepie" : slidePie
}
/**
*
*/
var chartGroups = {'Comparision' : 0,'Distrubution': 0,'Composition': 0,'Relation': 0};
/**
* Raw data
*/
var data;

/**
* Header of data
*/
var header=[];
/**
* id of chart container
*/
var container;

var size;

/**
* Varible holding labels for linearregssionfunc
*/
var label = new Array();

							/**
*Implement this function i a html page to visulize all options a set of questions
*have to offer. The function
*param{json} data - jsonfile with the polldata
*param{array} visualizationTypes - array containing the questiontypes to visualize
*/
maggio.visualizeSet = function(url,cnt,question,options,callback){
	console.log(flashpoll);
	d3.json(url, function(data) {
		container = cnt;
		var opt = optionHandler.addOptions(options);
		opine.init(data,question,opt,callback);
	});
}
maggio.visualClick = function(id,url){
	var dia = "<div id='dia'></div>";
	var test = pollchart.currentCharts[id +""];
	var q = arrayToString(test.question);
	var c = arrayToString(test.chart);
	var lastChar = id.split(pollchart.chartID).slice(-1)[0];
	console.log(pollchart.optionChart);
	var string = "single.html?url="+url +"&chart="+c+"&id="+q+"&color="+pollchart.optionChart[parseInt(lastChar)-1].colorscheme;
	console.log(string);
	window.location.href = string;


}
maggio.visualizeOne = function(url,cnt,question,nr,color){
	d3.json(url, function(data) {
	
		pollchart.options.colorscheme = parseInt(color);

		container = cnt;
		opine.visualizeOne(data,question,nr,color);
	});
}
/**
*
*/
maggio.visualizeChart = function(url,cnt,question,chart,answer){
	d3.json(url, function(data) {
		container = cnt;
		opine.visualizeChart(data,question,chart,0,answer);
	});
}
maggio.visualizeCharty = function(url,cnt,question,chart){
		d3.json(url, function(data) {
		opine.visualizeCharty(data,question,chart,cnt);
	});
}
/**
* Visulizes a flashpollset
*/
maggio.flashpollVisualizeSet = function(url,chart,cnt,questions,options){
	var opt = optionHandler.addOptions(options);
	container=cnt;	
	d3.json(url+".json", function(structure) {
		d3.json(url+"results.json", function(data) {
			d3.json(url+"result.json", function(frequency) {
				flashpoll.visualizeSet(structure,data,frequency,questions,opt);
			});
		});
	});
}
maggio.flashClick = function(id,url){
	var test = pollchart.currentCharts[id +""];
	console.log(id);
	var q = arrayToString(test.question);
	var lastChar = id.split(pollchart.chartID).slice(-1)[0];
	var c = pollchart.chartVis[parseInt(lastChar)-1];
	var string = "flashClick.html?url="+url +"&chart="+c+"&id="+q+"&color="+pollchart.optionChart[parseInt(lastChar)-1].colorscheme;
	console.log(string);
	window.location.href = string;
}
maggio.flashChart = function(url,cnt,question,chart,color){
	container=cnt;	
	var typeArray=[];
	var count=0;
	d3.json(url+".json", function(structure) {
		d3.json(url+"results.json", function(data) {
			d3.json(url+"result.json", function(frequency) {
				flashpoll.visualizeChart(structure,data,frequency,question,chart);
			});
		});
	});
}



function matrixToRevArray(matrix){
	var ret = [];
	for (var i = 0; i < matrix.length; i++) {
				// ret.push(matrix[i][matrix[i].length-1]);
		for (var j = 1; j <matrix[i].length; j++) {
			// ret.push(matrix[i][j]);
			ret.push({col:i,row:j-1, value: matrix[i][j]})
		};

		console.log(ret);
	};
	return ret;
}
function arrayToString(array){
	var res = "";
	for (var i = 0; i < array.length; i++) {
		if(i>0){
			res += "+" + array[i];
		}else{
			res += ""+array[i];
		}

	};
	return res;
}
	/**
* Makes histogram of data **
*param{Array} matrix - array holding the table
*/
function disk(data){
	console.log(data);
	var header = [];
	var bucketsize =5;
	var head = data.splice(0,1);
	var buckets = new Array(bucketsize);
	var min = Math.min.apply(Math, data),
	max = Math.max.apply(Math, data);
	var diff = max - min;
	var step = diff/bucketsize;
	for(var i = 0; i <= bucketsize; i++){
		buckets[i]=0;
		var minm =  (step*i).toString();
		var maxm =  (step*(i+1)).toString();
		header[i] = minm.substring(0,4) + "-" +maxm.substring(0,4);
		for(var j = 0; j < data.length; j++){
			if(step*i<data[j] && step*(i+1) > data[j]){
				buckets[i]++;
			}
		}
	}
		buckets.unshift("Freqency")
	// buckets.unshift(head[0])

	var ret = [];
	ret.push(header);
	ret.push(buckets);
	return ret;
}
/**
* Transform matrix into datapoints
* [x-array,y-array]
* into
* [[x1,y1],[x2,y2],...,[xn,yx]]
*
* To perform a linear regression.
*
* returns lables + linearRegression in an array
*/
function matrixToPoints(matrix){

	label.push(matrix[0].splice(0,1));
	label.push(matrix[1].splice(0,1));
	var data= new Array();
	var max = 0;
	for(var j = 0; j<2; j++){
		for(var i = 0; i<matrix[0].length; i++){
			if(j==0){
				data[i]=new Array();
			}
			data[i].push(Math.round(matrix[j][i]));
			
		}
		if(max < ss.max(matrix[0])){
			max = ss.max(matrix[0]);
		}
	}
	return [label,linearRegression(data, max)];
}
/**
*
*/
function getAverage(matrix){
	var mat,temp;
	mat=[];
	for(var j = 0; j<matrix.length; j++){
		temp=[];
		for(var i = 1; i<matrix[0].length; i++){
			temp.push(matrix[j][i]*(1));
		}
		mat[j]=temp;
		mat[j].unshift(matrix[j][0])
	}
	return matrix;
}
/**
* Stepvice stack columns
* [[A,B,C],[D,E,F]]
* to
* [[A,B,C],[A+D,B+E,C+F]]
* This is used for dispaying the distribution over time
*
*/
function normalizeArea(matrix){
	for(var i = 0; i<matrix.length; i++){
		for(var j = 1; j<matrix[i].length; j++){
			if(i != 0){

				matrix[i][j] += matrix[i-1][j];
			}
		}
	}
	return matrix;
}

// function normalizeMatrix(matrix){
// 	var sum = getSumMatrix(matrix);
// 	for(var i = 0; i<matrix.length; i++){
// 		for(var j= 0; j<matrix[i].length; j++){
// 			matrix[i][j] = (matrix[i][j]/sum).toFixed(2);
// 		}
// 	}
// 	return matrix;
// }
/**
* Adds a chart to the array of charts and returns the position of the chart
*/
function addChart(chart){
	matrixArray.push(chart);
	return matrixArray.length-1;
}

/**
* Normalize a datamatrix without a top header as first row
* First coloumn is text
*/
function normalize (matrix,offset){
	var ratio =0;
	var temp;
	var result = [];
	for (var i = offset; i < matrix.length; i++) {
		for (var j = 1; j < matrix[i].length; j++) {
			temp = matrix[i][j];
			if(temp > ratio){
				ratio = temp;
			}
		};
	};
	ratio = ratio/100;
	result.push(matrix[0]);
	for (var i = offset; i < matrix.length; i++) {
		result[i] = new Array();
		result[i].push(matrix[i][0]);
		for (var j = 1; j < matrix[i].length; j++) {
			result[i][j] = Math.round(matrix[i][j]/ratio);
		};
	};
	console.log(result);
	return result;
}
/**
* Normalize a datamatrix without a top header as first row
* First coloumn is text
*/
/*function normalizeByColumn(matrix){
	var result = [];
	result.push(matrix[0]);
	for (var i = 1; i < matrix.length; i++) {
		var temp=[];
		for (var j = 1; j < Things.length; j++) {
			matrix[i][j]
		};
		result.push(normalizeRow(matrix[i]));
	};
	return result;
}*/
/**
* Normalize a datamatrix without a top header as first row
* First coloumn is text
*/
function normalizeByRow (matrix){
	var result = [];
	result.push(matrix[0]);
	for (var i = 1; i < matrix.length; i++) {
		result.push(normalizeRow(matrix[i]));
	};
	return result;
}
function normalizeRow(array){

	var max = getArrayMax(array.slice(1,array.length),0);
	var sum = getSumArray(array,1);
	for (var i = 1; i < array.length; i++) {
		var value = parseInt(array[i]);
		array[i] = Math.round(value/sum*100);
	};
	return array;
}
function averageByRow(matrix){
	for (var i = 0; i < matrix.length; i++) {
			// matrix[i] = matrix[i][]
		};
	}
	/**
* adds the an array at the first row of the matrix
*/
function addTopHeadToMatrix(names){
	var a = [];
	a.push("Title");
	names.forEach(function(d){
		a.push(d.answerText);
	});
	return a;
}
function addToSideHeadMatrix(names,matrix){
	for (var i = 0; i < names.length; i++) {
		matrix[i].unshift(names[i].answerText);
	};
	return matrix;
}
function buildEmptyMatrix(rows,columns){
	var m = [];
	for (var i = 0; i < rows; i++) {
		m[i] = new Array();
		for (var j = 0; j < columns; j++) {
			m[i].push(0);
		};
	};

	return m;
}
	 function addSideNames(matrix,names){
					for (var i = 0; i < matrix.length; i++) {
						matrix[i].unshift(names[i]);
					};
					return matrix;
				};
			
	function getListOfCharts(q,single){
					var val;
					var categorical = 0;
					var continuous = 0;
					console.log(q);
					for (var i = 0; i < q.length; i++) {
						val = opine.dataTypes[q[i]];
						if(val == "nominal" ){
							categorical++
						}else if(val=="ratio"){
							continuous++;
						}
					};
					return getvistypes(categorical,continuous,single);
				};

function swapCategorical(matrix){
	var retMatrix=[];
	for (var i = 0; i < matrix[0].length; i++) {
		var temp = [];
		for (var j = 0; j < matrix.length; j++) {
				temp.push(matrix[j][i]);
		};
					retMatrix.push(temp);
	};
	return retMatrix;
}
function copyMatrix(matrix){
	var newArray = [];

for (var i = 0; i < matrix.length; i++){
    newArray[i] = matrix[i].slice();
}
return newArray;
}
function createSlider(){
	var slider = "<div><input id='sliderb' type='range' min='1' max='"+ matrix.length + "' value='1'/></div>";
	var label = "<label id='sliderLabel' for='male'>"+ "Current plot: " + getMytitle() + "</label>";
	$('#slideholder').append(label);
	$('#slideholder').append(slider);
	$("#slideholder").trigger("create");
	$("#sliderb").on("slidestop", function(e){
		setBarSet($("#sliderb").val(),matrix);
	});
}
/**
* adds a container for the next chart
*/
function addInfo(qustions){
	pollchart.nrOfCharts++;
	pollchart.chart.push(pollchart.chartID+pollchart.nrOfCharts);
	// var info = "<div><h2>"+title+"</h2><p id='maggioInfo'>"+info+"</p></div>";
	// $(container).append(info);
	// if(container == "#char"){
	// 	$(container).append("<div id='charty' class='tumbchart' style='height : 600px'></div>");
	// }else{
	// $(container).append("<div class='tumbchart' id='"+pollchart.chart[pollchart.nrOfCharts-1]+"'></div>");

	var id = "tumb"+(pollchart.nrOfCharts-1);
		console.log(id);
		$(container).append("<div class='item' id='"+id+"'></div>");
		$("#"+id).append("<div class='tumbchart' id='"+pollchart.chart[pollchart.nrOfCharts-1]+"'></div>");
		$("#" + pollchart.chart[pollchart.nrOfCharts-1]).height($("#"+id).height());
		console.log($("#" + pollchart.chart[pollchart.nrOfCharts-1]));
		for (var i = 0; i < qustions.length; i++) {
			$("#"+pollchart.chart[pollchart.nrOfCharts-1]).addClass("question-"+qustions[i]);
		};


	// }
}

function addInfo2(title,info){
	pollchart.nrOfCharts++;
	pollchart.chart.push(pollchart.chartID+pollchart.nrOfCharts);
	var info = "<div><h2>"+title+"</h2><p id='maggioInfo'>"+info+"</p></div>";
	$(container).append(info);
	if(container == "#char"){
		$(container).append("<div id='charty' class='tumbchart' style='height : 600px; width : 100px'></div>");
	}else{
		$(container).append("<div class='tumbchart' id='"+pollchart.chart[pollchart.nrOfCharts-1]+"' style='height : 600px; width : 100%'></div>");

	}
}
var tableId = "#tableId";
var tablerow;
var cells = [];
function addSqaure(){
	pollchart.nrOfCharts++;
	pollchart.chart.push(pollchart.chartID+pollchart.nrOfCharts);
	if(pollchart%4 == 0){
		$(tableId).append('<tr></tr>');
	}
	$(tableId).append("<div id='"+pollchart.chart[pollchart.nrOfCharts-1]+"'></div>");
}

function createTable(){
	var myTableDiv = document.getElementById(container);
	var table = document.createElement('TABLE');
	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);


    //TABLE ROWS
    for (i = 0; i < 4; i++) {
    	var tr = document.createElement('TR');
    	for (j = 0; j < 3; j++) {
    		var td = document.createElement('TD')
            // td.appendChild(document.createTextNode("<div id='"+pollchart.chart[pollchart.nrOfCharts-1]+"' background-color='"+pollchart.backgroundColors[(i+j)%pollchart.backgroundColors.length]+"''></div>"));
            td.appendChild(document.createTextNode(i));           
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    }  
    myTableDiv.appendChild(table)

}

function setChartText(text){
	var w = window.innerWidth/2;

	d3.select(container + ' svg').append("text")
	.attr("x", w)
	.attr("y", "55")
	.attr("dy", "-.7em")
	.style("text-anchor", "middle")
	.attr("stroke","#101010")
	.attr("font-size", "10px")
	.attr("font-family", "sans-serif")
	.attr("fill", "Black")
	.text(text);
}
function removeChartText(element){
	console.log("removing...");
	d3.select(element).remove();
}

var set = 0;
function setBarSet(val,matrix){
	set= val-1;
	loadData(matrix);
}
function unload(){
	chart.unload({
		ids: cat,
	});
}
function loadData(matrix){
	changeLabel('#sliderLabel',getMytitle());
	chart.load({
		rows: 
		[header,matrix[set]],

	});
}
function changeLabel(label,value){
	$(label).text("Current plot: " +value);
}
function getMytitle(){
	return matrix[set][0];
}

/**
* Object holding methods handling data from Opine-r
*/
var opine = {
/**
*Data types for questions
*/
dataTypes : {"pick_n":"nominal", "slider" : "ratio","RADIO":"nominal","ORDER":"nominal","CHECKBOX":"nominal"},
/**
*Visualize one graph from a dataset
*param{json} data - jsonfile with the polldata
*param{array} question - array containing the positions of the qustions in the poll
*param{int} nr - nr of what chart to use
*/
initOne : function(data,question,chart){
	
	if(question.length==1){
		var matrix = opine.getSingeMatrix(data,question[0]);
		if(matrix[1][0]!=null){
			addInfo2(data.name,data.question_list[question[0]].body);
			chart(matrix);
		}
	}else{
		var matrix=opine.getDoubleMatrix(data,question);
		addInfo2("matrix[0][0],data.question_list[question[0]].body "+ "<br>"+ "data.question_list[question[1]].body");
		chart(matrix);
	}
},
/**
*Visualizes all posible graphs from a set of questions from a poll
*and render the visualizations in a grid
*param{json} data - jsonfile with the polldata
*param{array} question - array containing the positions of the qustions in the poll
*/
init : function(data,question,options,callback){

	var performance = new Timetool();
	
	var matrixMemory = buildEmptyMatrix(data.question_list.length,data.question_list.length);
	console.log("MATRIX MEMORY");
	console.log(matrixMemory);
	optionHandler.isMobile();

	var visualizationTypes = opine.calculateVisualizations(opine.reduceQuestionArray(data,question),data,false);
	console.log(visualizationTypes);
	for (var i = 0; i < visualizationTypes.length; i++) {
		if(visualizationTypes[i].ids.length==1){
			var matrix;
			
			// if(matrixMemory[parseInt(visualizationTypes[i].ids[0]][0]!=0){
				// matrix =matrixMemory[question[0]][0];
			// }else{
				matrix = opine.getSingeMatrix(data,parseInt(visualizationTypes[i].ids[0]));
				// matrixMemory[parseInt(visualizationTypes[i].ids[0]][0];
			// }
//			// }
			// if(matrix[1][0]!=null){
				for (var u = 0; u < visualizationTypes[i].types.length; u++) {
					addInfo([visualizationTypes[i].ids[0]]);
					var rnd = Math.floor(Math.random()*4);
					var variable = {};
					for (var key in pollchart.options) {
						variable[key]  = pollchart.options[key];
					}
					pollchart.optionChart.push(variable);
					pollchart.currentCharts[pollchart.chart[pollchart.nrOfCharts-1]] = {chart : [i,u,], data : data, question : question};
					optionHandler.addChart("#"+pollchart.chart[pollchart.nrOfCharts-1]);
					optionHandler.updateOption(optionHandler.size-1,"matrix", matrix.slice(0));
					optionHandler.updateOption(optionHandler.size-1,"orgmatrix",matrix.slice(0));
					optionHandler.updateOption(optionHandler.size-1,"chart",visualizationTypes[i].types[u]);
					optionHandler.updateOption(optionHandler.size-1,"color",rnd);
					optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1);
					optionHandler.updateOption(optionHandler.size-1,"ylabel", visualizationTypes[i].ylabel);
					optionHandler.updateOption(optionHandler.size-1,"xlabel", visualizationTypes[i].xlabel);
					optionHandler.array[optionHandler.size-1].questions.push(data.question_list[visualizationTypes[i].ids[0]].type.name);
					optionHandler.updateOption(optionHandler.size-1,"title", data.question_list[visualizationTypes[i].ids[0]].body);
					optionHandler.updateOption(optionHandler.size-1,"info", "Frequency of response");
					console.log(optionHandler.array[optionHandler.size-1].xlabel);
					var chart = visualizationTypes[i].types[u](optionHandler.getOption(optionHandler.size-1));
					console.log(chart);
					optionHandler.updateOption(optionHandler.size-1,"c3",chart);
					
				};
			// }
		}
		else{
			for (var u = 0; u < visualizationTypes[i].types.length; u++) {
				var matrix;

				if(matrixMemory[question[0]][question[0]]!=0){
					matrix =matrixMemory[question[0]][question[1]];
				}else{
					matrix=opine.getDoubleMatrix(data,visualizationTypes[i].ids);
				}
				if(matrix==null){
					continue;
				}
				addInfo(visualizationTypes[i].ids);
				var rnd = Math.floor(Math.random()*4);
								optionHandler.addChart("#"+pollchart.chart[pollchart.nrOfCharts-1]);
			/*	pollchart.options.colorscheme = rnd;
				var variable = {};
				for (var key in pollchart.options) {
					variable[key]  = pollchart.options[key];
				}*/

					console.log("QUESTION    " + data.question_list[visualizationTypes[i].ids[0]].type.name);
		if(data.question_list[visualizationTypes[i].ids[0]].type.name == "pick_n" && data.question_list[visualizationTypes[i].ids[1]].type.name == "pick_n" ){
			console.log("ChiSquareTest");
			var val = chiSquareTest(copyMatrix(matrix));
			if(val == true){
					optionHandler.updateOption(optionHandler.size-1,"independence","ChiSquareTest: No relation between questions");
			}else{
					optionHandler.updateOption(optionHandler.size-1,"independence","ChiSquareTest: Found relation between questions");
			}
		}
		else if(data.question_list[visualizationTypes[i].ids[0]].type.name == "slider" && data.question_list[visualizationTypes[i].ids[1]].type.name == "slider" ){
			console.log("Pearson correlation");
			var prefs = new Object();
			console.log(matrix);
			prefs.p1 = matrix[0].slice(1);
			prefs.p2 = matrix[1].slice(1);
			var pearRes = pearsonCorrelation(prefs, "p1","p2");
			optionHandler.updateOption(optionHandler.size-1,"independence","Pearson correlation: " + pearRes);
		}

				// pollchart.optionChart.push(variable);
				// pollchart.currentCharts[pollchart.chart[pollchart.nrOfCharts-1]] = {chart : [i,u,], data : data, question : question};

				optionHandler.updateOption(optionHandler.size-1,"matrix",copyMatrix(matrix));
				optionHandler.updateOption(optionHandler.size-1,"orgmatrix",copyMatrix(matrix));
				optionHandler.updateOption(optionHandler.size-1,"chart",visualizationTypes[i].types[u]);
				optionHandler.updateOption(optionHandler.size-1,"color",rnd);
				optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1);
				optionHandler.updateOption(optionHandler.size-1,"ylabel", visualizationTypes[i].ylabel);
				optionHandler.updateOption(optionHandler.size-1,"xlabel", visualizationTypes[i].xlabel);

				optionHandler.updateOption(optionHandler.size-1,"title", "Question combination");
				optionHandler.updateOption(optionHandler.size-1,"info", 
					"Question 1 " + data.question_list[visualizationTypes[i].ids[0]].body 
					+ "<br>" + 
					"Question 2 " + data.question_list[visualizationTypes[i].ids[1]].body
					);
				optionHandler.array[optionHandler.size-1].questions.push(data.question_list[visualizationTypes[i].ids[0]].type.name);
				optionHandler.array[optionHandler.size-1].questions.push(data.question_list[visualizationTypes[i].ids[1]].type.name);

				var chart = visualizationTypes[i].types[u](optionHandler.getOption(optionHandler.size-1));
				optionHandler.updateOption(optionHandler.size-1,"c3",chart);

			};
		}

	}
	console.log(matrixMemory);
	console.log(performance.stopTimer());
	new Masonry(container, { "columnWidth": ".item", "itemSelector": ".item", "gutter": ".gutter-sizer" })
		callback();
	},
/**
*Visualize one graph from a dataset
*param{json} data - jsonfile with the polldata
*param{array} question - array containing the positions of the qustions in the poll
*param{int} nr - nr of what chart to use
*/
visualizeOne : function(data,question,nr,color){
	optionHandler.isMobile();
	//functions + questions
	var visualizationTypes = opine.calculateVisualizations(question,data,true);
	console.log(visualizationTypes[nr[0]].ylabel);
	// createTable();
	pollchart.nrOfCharts = 0;
	if(visualizationTypes[nr[0]].ids.length==1){
		var matrix = opine.getSingeMatrix(data,visualizationTypes[nr[0]].ids[0]);
		if(matrix[1][0]!=null){
			addInfo2(data.name,data.question_list[visualizationTypes[nr[0]].ids[0]].body);
			optionHandler.addChart("#"+pollchart.chart[pollchart.nrOfCharts-1]);
			optionHandler.updateOption(optionHandler.size-1,"matrix",matrix);
			optionHandler.updateOption(optionHandler.size-1,"orgmatrix",matrix.slice(0));
			optionHandler.updateOption(optionHandler.size-1,"chart",visualizationTypes[nr[0]].types[nr[1]]);
			optionHandler.updateOption(optionHandler.size-1,"color",color);
			optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1);
			optionHandler.updateOption(optionHandler.size-1,"ylabel", visualizationTypes[nr[0]].ylabel);
			optionHandler.updateOption(optionHandler.size-1,"xlabel", visualizationTypes[nr[0]].xlabel);
			var chart = visualizationTypes[nr[0]].types[nr[1]](optionHandler.getOption(optionHandler.size-1));
			optionHandler.updateOption(optionHandler.size-1,"c3",chart);

		}
	}
	else{
		var matrix=opine.getDoubleMatrix(data,visualizationTypes[nr[0]].ids);


		addInfo2(matrix[0][0],data.question_list[visualizationTypes[nr[0]].ids[0]].type.name + "<br>"+ data.question_list[visualizationTypes[nr[0]].ids[1]].body);
		optionHandler.addChart("#"+pollchart.chart[pollchart.nrOfCharts-1]);
		optionHandler.updateOption(optionHandler.size-1,"matrix",matrix);
		optionHandler.updateOption(optionHandler.size-1,"orgmatrix",matrix.slice(0));
		optionHandler.updateOption(optionHandler.size-1,"chart",visualizationTypes[nr[0]].types[nr[1]]);
		optionHandler.updateOption(optionHandler.size-1,"color",color)
		optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1)
		optionHandler.updateOption(optionHandler.size-1,"ylabel", visualizationTypes[nr[0]].ylabels);
		optionHandler.updateOption(optionHandler.size-1,"xlabel", visualizationTypes[nr[0]].xlabels);
		var chart = visualizationTypes[nr[0]].types[nr[1]](optionHandler.getOption(optionHandler.size-1));	
		optionHandler.updateOption(optionHandler.size-1,"c3",chart);		
		console.log(optionHandler);
	}

},

		/**
*Visualize one graph from a dataset
*param{json} data - jsonfile with the polldata
*param{array} question - array containing the positions of the qustions in the poll
*param{int} nr - nr of what chart to use
*/
visualizeChart : function(data,question,chart,color,answer){
	optionHandler.isMobile();
	var matrix;
	// createTable();
	pollchart.nrOfCharts = 0;
	if(color==null){
		var color = Math.floor(Math.random()*4);
	}
	if(question.length==1){
		matrix = opine.getSingeMatrix(data,question);
		addInfo2(data.name,data.question_list[question[0]].body);
	}
	else{
			// pollchart.nrOfCharts ++;
			matrix=opine.getDoubleMatrix(data,question);
			var subtitle = "";
			for(i=0; i<question.length; i++){
				subtitle += "-";
				subtitle += data.question_list[question[i]].body;
				subtitle += "<br/>"
			}
			addInfo2(data.name,subtitle);
		}
		optionHandler.addChart(container);
		optionHandler.updateOption(optionHandler.size-1,"matrix",matrix);
		optionHandler.updateOption(optionHandler.size-1,"chart",chartNames[chart]);
		optionHandler.updateOption(optionHandler.size-1,"color",color)
		optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1)
		optionHandler.updateOption(optionHandler.size-1,"answer",answer)
		optionHandler.pointer = optionHandler.size-1;
		var chart = chartNames[chart](optionHandler.getOption(optionHandler.size-1));
		optionHandler.updateOption(optionHandler.size-1,"c3",chart);
	},
	visualizeCharty : function(data,question,chart,contain){
		var matrix;
	// pollchart.nrOfCharts = 0;
	var cont = "#"+pollchart.chart[pollchart.nrOfCharts-1];	
	// var dt = "frequency";
	if(question.length==1){
		matrix = opine.getSingeMatrix(data,question);
		addInfo(data.name,data.question_list[question[0]].body);
	}
	else{
			// pollchart.nrOfCharts ++;
			matrix=opine.getDoubleMatrix(data,question);
			var subtitle = "";
			for(i=0; i<question.length; i++){
				subtitle += "-";
				subtitle += data.question_list[question[i]].body;
				subtitle += "<br/>"
			}
			addInfo(data.name,subtitle);
		}
		chartNames[chart](matrix,contain);
	},
		/**
*Function that finds all possiables visualizations from a
* set of questions
*param{json} data - jsonfile with the polldata
*param{q} q - array containing the positions of the qustions in the poll
*/
calculateVisualizations : function(q,data,single){
	var array = data.question_list;
	var combinations =[];
	for (var i = 0; i < q.length; i++) {
		combinations.push(
		{
			ids:[q[i]],
			types: getListOfCharts([array[q[i]].type.name],single),
			ylabel : "Frequency",
			xlabel : "Categories"
		});


		for (var j = i+1; j < q.length; j++) {
			if((array[q[i]].type.name=="slider" && array[q[j]].type.name=="pick_n") || (array[q[j]].type.name=="slider" && array[q[i]].type.name=="pick_n")){
				combinations.push(
				{
					ids:[q[i],q[j]],
					types: getListOfCharts([array[q[i]].type.name,array[q[j]].type.name],single),
					ylabel : "Mean",
					xlabel : "Categories"

				});
			}else{
				combinations.push(
				{
					ids:[q[i],q[j]],
					types: getListOfCharts([array[q[i]].type.name,array[q[j]].type.name],single),
					ylabel : array[q[j]].body,
					xlabel : array[q[i]].body

				});
			}

			if(array[q[i]].type.name=="slider" && array[q[j]].type.name=="slider"){
				for (var u = j+1; u < q.length; u++) {
					combinations.push(
					{
						ids:[q[i],q[j],q[u]],
						types: getListOfCharts([array[q[i]].type.name,array[q[j]].type.name,array[q[u]].type.name],single),
						ylabel : array[q[j]].body,
						xlabel : array[q[i]].body
					});
				}
			}
		}
	}
	return combinations;
},
		/**
*This method selects the appropiate transformationfunction for the datatype
*param{json} data - jsonfile with the polldata
*param{array} visualizationTypes - array containing the questiontypes to visualize
*/
getSingeMatrix : function(data,visualizationTypes){
	var index = visualizationTypes;
	var type = data.question_list[index].type.name;
	var matrix = [];
	if(data.question_list[index].type.response_list.length==0){
		return;
	}
	if(type =="pick_n"){
		matrix = opine.singleCategorical(data,index);
	}else if(type =="slider"){
		matrix =  opine.singleContinuous(data,index);
	}
	return matrix;
},
				/**
*Transforms the requested jsondata into a matrix
*This method is used for a single questions of categorical type
*param{json} data - jsonfile with the polldata
*param{array} visualizationTypes - array containing the questiontypes to visualize
*/
singleCategorical : function(data,index){
	var matrix = [];
	data.question_list[index].type.response_list.forEach(function(d){
		if(d.answers!=null){
			matrix.push([d.body,d.answers.length]);
		}else{
			matrix.push([d.body,0]);
		}

	});
	matrix.unshift(["title","frequency"]);
	return matrix;
},
				/**
*Transforms the requested jsondata into a matrix
*This method is used for a single questions of continuous type
*param{json} data - jsonfile with the polldata
*param{int} index - index of the question
*/
singleContinuous : function(data,index){
	var matrix = [];
	data.question_list[index].type.response_list[0].answers.forEach(function(d){
			matrix.push(parseInt(d.value));
	});
	matrix.unshift(data.question_list[index].body);
	return matrix;
},
/**
* This function is used for combination of two or more questions
* defines the number of categorical and countinuous data and launches the appropiate method
* for generating the matrix
*param{json} data - jsonfile with the polldata
*param{array} ids - array containing index of the relevant questions
*/
getDoubleMatrix : function(data,ids){
	var matrix;
	var cat = 0, con = 0;
	for (var i = 0; i < ids.length; i++) {
		var index = ids[i];
		var type = data.question_list[index].type.name;
		if(type=="pick_n"){
			cat++;
		}else{
			con++;
		}
	};
	if(cat==2){
		matrix = opine.getDoubleCategorical(data,ids);
	}else if(con==2 && cat ==0){
		matrix = opine.getContinuous2(data,ids);
	}else if(con==1 && cat == 1){
		matrix = opine.getMixedMatrix(data,ids);
	}else if(con==2 && cat == 1){
		matrix = opine.getMixedMatrix(data,ids);
	}
	return matrix;
},
getSimpleDouble: function(data,visualizationTypes){
	//Empty result matrix
	var matrix =[];

		//Name of first question
		matrix.push([data.question_list[visualizationTypes[0]].body]);	
		//Name of second question
		matrix.push([data.question_list[visualizationTypes[1]].body]);	

		//Iteration thorugh all questions
		data.question_list[visualizationTypes[0]].type.response_list[0].answers.forEach(function(d){
			matrix[0].push(d.value);
			data.question_list[visualizationTypes[1]].type.response_list[0].answers.forEach(function(k){
				if(d.user.username != null){
					if(d.user.username == k.user.username){
						matrix[1].push(k.value);
					}
				}else if(d.user.token != null)
				{
					if(d.user.username == k.user.username){
						matrix[1].push(k.value);
					}
				}
				
			});
		});
	// };
	return matrix;
},
/**
*pushes continous data into into a matrix
*param{json} data - jsonfile with the polldata
*param{array} visualizationTypes - array containing the questiontypes to visualize
*/
getContinuous2 : function(data,visualizationTypes){
	var matrix =[];
	// for (var i = 0; i < visualizationTypes.length; i++) {
		//Paste title
		matrix.push([data.question_list[visualizationTypes[0]].body]);	
		matrix.push([data.question_list[visualizationTypes[1]].body]);	
		//Insert all answers
		data.question_list[visualizationTypes[0]].type.response_list[0].answers.forEach(function(d){
			matrix[0].push(d.value);
			data.question_list[visualizationTypes[1]].type.response_list[0].answers.forEach(function(k){
				if(d.user.username != null){
					if(d.user.username == k.user.username){
						matrix[1].push(k.value);
					}
				}else if(d.user.token != null)
				{
					if(d.user.username == k.user.username){
						matrix[1].push(k.value);
					}
				}
				
			});
		});
	// };
	return matrix;
},
/**
*Transforms the requested jsondata into a matrix
*This method is used for a combination of two categorical questions
*param{json} data - jsonfile with the polldata
*param{array} visualizationTypes - array containing the questiontypes to visualize
*/
getDoubleCategorical : function(data,visualizationTypes){
	var matrix;
	var first = true;
	var names = [];
	var h = [];
	//Loops through each question
	for (var j = 0; j < data.question_list.length; j++) {
				//if question 1 of 2
				if(visualizationTypes[0] == j){
					var ac = 0;

					//Loops through each response
					data.question_list[j].type.response_list.forEach(function(d){
						names.push(d.body);
						//for each user	
						if(d.answers!=null){
							d.answers.forEach(function(c){
								for (var k = 0; k < data.question_list.length; k++) {
							//if question 2 of 2
							if(visualizationTypes[1] == k){

								var pc = 0 ;
								//Loops through each response
								data.question_list[k].type.response_list.forEach(function(l){
									if(h.length < data.question_list[k].type.response_list.length){
										h.push(l.body);
									}
									

									if(first){

										matrix = buildEmptyMatrix(data.question_list[j].type.response_list.length,data.question_list[k].type.response_list.length);
										first = false;
									}
									if(l.answers != null){
								//for each user	
								l.answers.forEach(function(p){
									if(c.user.username != null){
										if(c.user.username == p.user.username){
											matrix[ac][pc]++;
										}
									}else if(c.user.token != null){
										if(c.user.token == p.user.token){
											matrix[ac][pc]++;
										}
									}

								});	
							}
							pc++;
						});
								break;
							}

						};

						
					});	
}else{

}
ac++;

});
break;
}

};
matrix = addSideNames(matrix,names);
h.unshift(data.name);
matrix.unshift(h);
return matrix;
},
				/**
*Transforms the requested jsondata into a matrix
*this method is used for a combination of a categorical varible and a continous varible
*param{json} data - jsonfile with the polldata
*param{array} visualizationTypes - array containing the questiontypes to visualize
*/
getMixedMatrix : function(data,visualizationTypes){
	var matrix = [];
	var categorical,continuous;
	var names = [];
	for (var i = 0; i < visualizationTypes.length; i++) {
		if(data.question_list[visualizationTypes[i]].type.name == "pick_n"){
			categorical=visualizationTypes[i];
		}
		if(data.question_list[visualizationTypes[i]].type.name == "slider"){
			continuous=visualizationTypes[i];
		}
	};

	var position=0;
					//Loops through each response
					data.question_list[categorical].type.response_list.forEach(function(d){
						var temp = [];
						matrix.push([d.body]);

						//if response exist
						if(d.answers!=null){
								//for each user	
								d.answers.forEach(function(c){
									if(c.user.username != null){
										var currentUser =c.user.username;
									}else if(c.user.token != null){
										var currentUser =c.user.token;
									}

								//Loops through each continuous response
								data.question_list[continuous].type.response_list[0].answers.forEach(function(l){
									if(c.user.username != null){
										if(currentUser == l.user.username){
											temp.push(parseInt(l.value));
										}
									}else if(c.user.token != null){
										if(currentUser == l.user.token){
											temp.push(parseInt(l.value));
										}
									}


								});
							});
							}
							matrix[position].push(Math.round(ss.mean(temp)));
							position++;
						});	
					matrix.unshift(["Answer","Mean"]);
					return matrix;
				},
				getQuestionList : function(data){
					data.question_list.forEach(function(d){

					});
				},
				getTransformations : function(questions,data){
					if(data.question_list[questions[0]].type.name == "pick_n" 
						&& data.question_list[questions[1]].type.name == "pick_n"){
						return ["norm", "swap"];
				}
				else if(data.question_list[questions[0]].type.name == "slider" 
					&& data.question_list[questions[0]].type.name == "slider"){
					return ["", ""];
			}
		},
				reduceQuestionArray : function(data,array){
				var questions = [];
				for (var i = 0; i < array.length; i++) {
					if(data.question_list[array[i]].type.name != "not_a_question" ){
								questions.push(array[i]);
					}
				};
				return questions;
				}
	}
/**
* optionHandler holds all the charts data and functions for
* updating and adding options
*/
var optionHandler = {
array : [],
size : 0,
pointer: 0,
addChart : function(container){
	var c = JSON.parse(JSON.stringify(defaultOptions));
	// var c = defaultOptions;
	c.container = container;
	optionHandler.size++;
	optionHandler.array.push(c);
	return optionHandler.array[optionHandler.array.length-1];
},
updateOption:function(index, opt, value ){
	optionHandler.array[index][opt] = value;
},
addOptions : function(options){
	var k = defaultOptions;
	for(key in options){
		k[key] = options[key];
	}
	return k;
},
isMobile : function(){
	if(window.innerWidth<400){
		defaultOptions.mobile=true;
		defaultOptions.legendOffset = 40;
	}
},
getOption : function(index){
	return optionHandler.array[index];
}
}
/**
* if no option is specified default options are used
*/
var defaultOptions = {
	c3 : null,
	classname : null,
	chart : null,
	id: null,
	container: null,
	orgmatrix : null,
	matrix: null,
	tooltip : true,
	legend : true,
	axis : true,
	colorscheme : 0,
	ylabel: null,
	xlabel: null,
	mobile:false,
	legendOffset : 80,
	visualization: null,
	color:0,
	interaction : false,
	answer : null,
	questions : [],
	title:  "no title",
	info : "no info about the visualization",
	norm : false,
	correlation : null,
	independence: null,
	size: {
       	 width: "50vw",
         height: "50vw"
    },
}
/**
* ################################ STATISTICAL METHODS ##################################################################
*/
var increase;
/**
* Performs linear regression
* returns array with points in the linear line
*/
function linearRegression(data, max){
	var linear_regression_line = ss.linear_regression()
	.data(data).line();
	increase = (linear_regression_line(1) -linear_regression_line(0)).toFixed(1);
	var d = new Array();
	var h = new Array();
	h.push(label[0][0]);
	d.push(label[1][0]);
	for(var i = 0; i<=max; i++){
		d.push(Math.round(linear_regression_line(i)));
		h.push(i);
	}
	return [h,d]
}
/**
* Calculates the p value from chi sqaure and degree of freedom
*/
function ChiSq(x,n) {
	if(n==1 & x>1000) {return 0}
		if(x>1000 | n>1000) {
			var q=ChiSq((x-n)*(x-n)/(2*n),1)/2
			if(x>n) {return q} {return 1-q}
		}
	var p=Math.exp(-0.5*x); if((n%2)==1) { p=p*Math.sqrt(2*x/3.14) }
	var k=n; while(k>=2) { p=p*x/k; k=k-2 }
	var t=p; var a=n; while(t>0.0000000001*p) { a=a+2; t=t*x/a; p=p+t }
	return 1-p
}

function chiSquareTest(matrix){
	var sValue = 0.05;
	var test = addTotal(matrix);
	var chimatrix = [];
	var chiSquare = 0;
	var df;
	var pvalue;
	for (var i = 1; i < test.length-1; i++) {
		var temp=[];
		for (var j = 1; j < test[i].length-1; j++) {
			var obj = new Object();
			obj["frequency"] = test[i][j];
			obj["E"] = calcExp( test[i][test[i].length-1] , test[test.length-1][j] , test[test.length-1][test[i].length-1]);
			obj["chi"] = calcChiPart(obj.E,obj.frequency);
			chiSquare += obj.chi;
			temp.push(obj);
		};
		chimatrix.push(temp);
	};
	df = (test.length-3) * (test[1].length-3);
	pvalue = ChiSq(chiSquare,df);
	// return pvalue
	return pvalue > sValue ? true : false;
}

function calcExp(rowtot, coltot, sampsize){
	return (rowtot*coltot)/sampsize;
}
function calcChiPart(expected,accual){
	return (Math.pow(accual-expected,2))/expected;
}
function addTotal(matrix){
	var m = [];
	m.unshift(matrix[0]);
	matrix.shift();
	m[0].push("total");
	var bottom = [];
	bottom.push("total");
	for (var i = 0; i < matrix.length; i++) {
		var tot=0;
		var temp = [];

		for (var j = 0; j < matrix[i].length; j++) {
			var obj = new Object();
			obj['frequency'] = matrix[i][j];
			temp.push(matrix[i][j]);
			if(j>0){
				tot += matrix[i][j];
				if(i==0){
					bottom.push(matrix[i][j])
				}else{
					bottom[j] += matrix[i][j];
				}
			}
		};
		temp.push(tot);
		m.push(temp);
		
	};
	var absTotal =0;
	for (var i = 1; i < m.length; i++) {
		absTotal += m[i][m[i].length-1];
	};
	bottom.push(absTotal);
	m.push(bottom);
	return m;
}
/** @constructor */
Timetool = function(){
	var startTime = performance.now();
	var endTime;
	this.stopTimer = function(){
		var now = performance.now();
		endTime = now - startTime;
		return endTime;
	}
}
var transformer = {

	deleteChart : function(id){

	},
	deleteContainer : function(id){

	},
	redraw : function(index,options){
		optionHandler.array[index].chart(optionHandler.array[index]);
	},
	addChartInfo : function(id){
		
		var index = id.split("tumb").slice(-1)[0];
		console.log(id);

		if(optionHandler.array[index].classname == "tumbheat"){

			d3.select("#tumbheat" + index).remove();
			console.log("tumbheat" + optionHandler.array[index].container);
			
/*
			var norm= $('<input type="button" value="normalize q1" id="btnnorm'+index+'" class="norm"/>');
			$("#tumb" + index).prepend(norm);

			var swap= transformer.getSwapButton(index);
			$("#tumb" + index).prepend(swap);*/

					transformer.setTransButtons(optionHandler.array[index],index);

			if(optionHandler.array[index].independence!=null){
				$("#tumb" + index).prepend("<p id='relation"+index+"' class='relation'>"+optionHandler.array[index].independence+"</p>");
			}

			$("#tumb" + index).prepend("<p id='title"+index+"' class='infoText'>"+optionHandler.array[index].info+"</p>");
			$("#tumb" + index).prepend("<h2 id='info"+index+"'	class='titleText'>"+optionHandler.array[index].title+"</h2>");
			var newHeight = $("#tumb" + index).height() -  $(".titleText").height() -  $(".infoText").height()*4 - $(".swap").height();
			console.log(newHeight);
			var ind = parseInt(index)+1;
			console.log(ind);
			$("#charty" + ind ).css('height',newHeight);
			$("#charty" + ind ).css('max-height','none');
			heatmap2(optionHandler.array[index]);
			return;
		}
		transformer.setTransButtons(optionHandler.array[index],index);
		if(optionHandler.array[index].independence!=null){
			$("#tumb" + index).prepend("<p id='relation"+index+"' class='relation'>"+optionHandler.array[index].independence+"</p>");
		}
		
		$("#tumb" + index).prepend("<p id='title"+index+"' class='titleText'>"+optionHandler.array[index].info+"</p>");
		$("#tumb" + index).prepend("<h2 id='info"+index+"'	class='infoText'>"+optionHandler.array[index].title+"</h2>");

		// $(id).css('height',"" + $("#tumb" + index).height() -  $(".title").height() -  $(".info").height() - $(".swap").height());
		var newHeight = $("#tumb" + index).height() -  $(".titleText").height() -  $(".infoText").height()*2 - $(".swap").height();
		console.log(newHeight);
		var ind = parseInt(index)+1;
		console.log(ind);
		$("#charty" + ind ).css('height',newHeight);
		$("#charty" + ind ).css('width',$(id).width());
		$("#charty" + ind ).css('max-height','none');
		// $(id).height($("#tumb" + index).height() -  $(".title").height() -  $(".info").height() - $(".swap").height());
		optionHandler.array[index].legend=true;
		optionHandler.array[index].tooltip = true;
		optionHandler.array[index].axis = true;
		optionHandler.array[index].interaction = true;
// optionHandler.array[index].container = id;
		// transformer.setTransButtons(optionHandler.array[index],index);
		
		// $(id).height($("#tumb" + index).height - $(".titleText").height() - $(".infoText").height() - - $(".infoText").height());
		

		var chart = optionHandler.array[index].chart(optionHandler.array[index]);
		optionHandler.array[index].c3 = chart;

		

	},
	removeInfo : function(id){
		/*$(".infoText").remove();
		$(".titleText").remove();
		$(".swap").remove();
		$(".norm").remove();*/
		console.log(id);
		$(id+' :not(.tumbchart):not(.tumbchart *)').remove();

		var index = id.split("tumb").slice(-1)[0];

		var ind = parseInt(index) + 1;
		console.log(ind);
		console.log("chart height: " + $("#charty"+ ind).height());
		$("#charty" + ind ).css('max-height','none');
		$("#charty" +ind).css("height",$(id).width());
		$("#charty" +ind).css("width",$(id).width());
		console.log("chart height after : " + $("#charty" + ind ).height());
		if(optionHandler.array[index].classname == "tumbheat"){
			d3.select("#tumbheat" + index).remove();
			console.log("tumbheat" + optionHandler.array[index].container);
			heatmap(optionHandler.array[index]);
			return;
		}
		optionHandler.array[index].legend=false;
		optionHandler.array[index].tooltip = false;
		optionHandler.array[index].axis = false;
		optionHandler.array[index].interaction = false;
		optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
		var chart = optionHandler.array[index].chart(optionHandler.array[index]);
		optionHandler.array[index].c3 = chart;
	},
	resize : function(id){
		var index = id.split("tumb").slice(-1)[0]-1;
		optionHandler.array[index].c3.resize({height:$(id).height(), width:$(id).width()})
	},
	normalizeRows : function(id){
		console.log(id);
		var index = id.split("charty").slice(-1)[0]-1;
		if(optionHandler.array[index].c3!=null){
						// optionHandler.array[index].c3.unload();
						// optionHandler.array[index].c3.load({columns : copyMatrix(normalizeByRow(optionHandler.array[index].matrix)}));
						if(optionHandler.array[index].norm == false){
							optionHandler.array[index].matrix = copyMatrix(normalizeByRow(optionHandler.array[index].matrix));
							optionHandler.array[index].norm = true;
						}else if(optionHandler.array[index].norm = true){
							optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
							optionHandler.array[index].norm = false;
						}
						var chart = optionHandler.array[index].chart(optionHandler.array[index]);
						optionHandler.array[index].c3 = chart;
					}else{
						$(id + " svg").remove();
						if(optionHandler.array[index].norm == false){
							optionHandler.array[index].matrix = copyMatrix(normalizeByRow(optionHandler.array[index].matrix));
							optionHandler.array[index].norm = true;
						}else if(optionHandler.array[index].norm = true){
							optionHandler.array[index].matrix = copyMatrix(optionHandler.array[index].orgmatrix);
							optionHandler.array[index].norm = false;
						}
						heatmap2(optionHandler.array[index]);
					}
				},
				normalizeMatrix : function(id){
					var index = id.split("btnnormM").slice(-1)[0]-1;
					if(optionHandler.array[index].c3!=null){
						optionHandler.array[index].c3.unload();
						optionHandler.array[index].c3.load({columns : normalize(optionHandler.array[index].matrix,1)});
					}

				},
				swapcategories : function(id){
					var index = id.split("charty").slice(-1)[0]-1;
					if(optionHandler.array[index].c3!=null){
						// optionHandler.array[index].c3.unload();
						// optionHandler.array[index].c3.load({columns : normalizeByRow(optionHandler.array[index].matrix)});
						optionHandler.array[index].matrix = swapCategorical(optionHandler.array[index].matrix);
						var chart = optionHandler.array[index].chart(optionHandler.array[index]);
						optionHandler.array[index].c3 = chart;
					}else{
						$(id + " svg").remove();
						optionHandler.array[index].matrix = swapCategorical(optionHandler.array[index].matrix);
						heatmap2(optionHandler.array[index]);
					}

				},
				setTransButtons : function(options,index){
					console.log(options);
					if(options.questions.length == 1){
						console.log("ONE QUESTION");
						if(functionName(options.chart)=="bar" || functionName(options.chart)=="histogram" ){
							// var swap= transformer.getSwapButton(index);
							// $("#tumb" + index).prepend(swap);
								transformer.appendSwapButton(index);
					// $(swap).insertBefore($("#charty" + (options.id + 1)));
				}
				return;
			}
			else if(options.questions.length == 2){
				console.log("TWO QUESTIONS");
				var q1 = options.questions[0];
				var q2 = options.questions[1];
				console.log(q1 + "---" + q2);
			// One is slider one is pick_n
			if(q1 != q2){
				// var swap= getSwapButton(index);
				// $("#tumb" + index).append(swap);
					transformer.appendSwapButton(index);

			}else if(q1 == "pick_n" && q2 == "pick_n"){
				console.log("TO PICK N");
				var isNormalized = "Normalize first";
				// var norm= $('<input type="button" value="'+ isNormalized +'" id="btnnorm'+index+'" class="norm"/>');
				// $(norm).insertBefore($("#charty" + (options.id + 1)));
				// $("#tumb" + index).prepend(norm);
				transformer.appendNormButton(index);

				// var swap= $('<input type="button" value="swap" id="btnswap'+index+'" class="swap"/>');
				// $(swap).insertBefore($("#charty"+ (options.id + 1)));
					// $("#tumb" + index).prepend(swap);
				transformer.appendSwapButton(index);
				}
			}

		},
		getSwapButton : function(index){
			return	$('<input type="button" value="swap" id="btnswap'+index+'" class="swap" />');
		},
		getNormButton : function(index){
				return 	$('<input type="button" value="'+ "isNormalized" +'" id="btnnorm'+index+'" class="norm"/>');
		},
		appendSwapButton : function(index){
			var swap = transformer.getSwapButton(index);
			$("#tumb" + index).prepend(swap);
			$("#btnswap"+index).on('click', function(event) {
				   console.log(event);
				console.log("****SWAP***");
				var i = event.currentTarget.id.split("btnswap").slice(-1)[0];
				// $("#btnswap"+index).prop("value" ,"unnormalize first");
				i++;
				transformer.swapcategories("#charty" + i);
			});
		},
		appendNormButton : function(index){
			var norm = transformer.getNormButton(index);
			$("#tumb" + index).prepend(norm);
			$("#btnnorm" + index).on('click',function(event) {
      console.log("****norm*****");
      var i = event.currentTarget.id.split("btnnorm").slice(-1)[0];
      console.log(event);
      i++;
      transformer.normalizeRows("#charty" + i);
    });
		}
	}
function rotateText(names,options){
		var max = getArrayMax(names);
		if(max > 5 || names.length > 4){
			return 70;
		}else{
			return 0;
		}
}
function xHeight(options){
	return $(options.container).height() * 0.25;
}
function lineAndBar(options){
	var chart = c3.generate({
		bindto: "#chart1",
		data : {
			columns : options,
			type : 'bar'
		}
	});
}
/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/
function bar(options){
	optionHandler.pointer = options.id;
	var m = options.matrix;
	if(m[0].length>4){r = 70;}
	var names = columnNames(m);
	var r = rotateText(names, options);
	var rot = m.length > 4; rotated : false ? rotated : true;

	var xMargin = xHeight(options);
	var c = 0;
	var chart = c3.generate({
		bindto: options.container,
		interaction: { enabled:  options.interaction},
		data: {
			x : m[0][0],
			columns : m,
			type: 'bar',
			color: function (color, d) {
				return datacolors.getColor(d,names,options.color);
			},
			section : {enabled : false}
		},
		bar: {
			width : 100,
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
    		show : options.axis,
    		height : xMargin,
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


});
	if(rot){
		$(options.container+" .c3-axis-x .tick text").remove();
		// $("#charty2 .c3-axis-x .tick text").remove();
	}
	return chart;
	// pollchart.data.push({chart : chart, matrix : matrix});
}
/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/
function bar2(matrix){
	var m = matrix;
	var names = matrix[0];
	var rot = matrix.length > 8; rotated : false ? rotated : true;
	var c = 0;

	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		interaction: { enabled:  options.interaction },
		data: {

			x : m[0][0],
			rows : m,
			type: 'bar',
			color: function (color, d) {
				console.log(d);
				return datacolors.getColor(d,names,true);
			}
		},
		bar: {
			width : 100,
			width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
    },

    tooltip: {
    	show : pollchart.options.tooltip
    },
    legend : {
    	show : false
    },
    axis: {
    	rotated : rot,

    	x: {
    		show : pollchart.options.axis,
    		height : 85,
    		type: 'categorized',
    		tick: {
    			// rotate : 0
				// 	rotate: function(){
				// 		if(matrix.length>3){return 70;}
				// 		else {return 1;}},
			},
		},
		y : {
			show : pollchart.options.axis,
			label : matrix[0][1]
		},

		width: {
			ratio: 100
		},
	},
	scroll : {enabled : true},
	zoom : {enabled : false},


});
	pollchart.data.push({chart : chart, matrix : matrix});
}
function bardouble(matrix,ylabel){
	var m = matrix;
	var barmax = getRowMax(m,0,1);
	console.log(m);
	var rot = matrix.length > 8; rotated : false ? rotated : true;
	var c = 0;


	// var index = addChart();
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],

		data: {

			x : m[0][0],
			columns : m,
			type: 'bar',
			color: function (color, d) {
				return datacolors.getColor(d,names);
			}
		},
		tooltip: {
			show : pollchart.options.tooltip
		},
		legend : {
			show : pollchart.options.legend
		},
		bar: {
			width : 100,
			width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
    },
    axis: {
    	rotated : rot,
    	x: {
    		height : 85,
    		type: 'categorized',
    		tick: {
    			rotate : 70
					// rotate: function(d){
					// 	if(barmax>5){return 70;}
					// 	else {return 0;}},
				},
			},
			y : {
				label : ylabel
			},

			width: {
				ratio: 100
			},
		},
		scroll : {enabled : true},
		zoom : {enabled : false}
	});
	pollchart.data.push({chart : chart, matrix : matrix});
}
function histogram(options){
	console.log(options.matrix);
	var d = disk(options.matrix);
	console.log(d);
	optionHandler.pointer = options.id;
	var names = d[0].slice(0);
	d[0].unshift("Answer");
	var r = rotateText(names, options);
	var xMargin = xHeight(options);
	var chart = c3.generate({
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			x: "Answer",
			columns : d,
			type: 'bar',
			color: function (color, d) {
				var id = d.index;
				if(id != null){
					return datacolors.getColor(names[d.index],names);
				}
				return datacolors.getColor(names[0],names);
			}
		},
		axis: {
			x: {
				height : xMargin,
				type: 'categorized',
				tick : {
					rotate : 55
				}
			}
		}
	});
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
	var chart = c3.generate({
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			x : options.matrix[0][0],
			columns : options.matrix,
			type: 'line',
			color: function (color, d) {
				return datacolors.getColor(d,names);
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
	});
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
	var chart = c3.generate({
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			xs :t,
			columns : options.matrix,
			type: 'line',
			color: function (color, d) {
				return datacolors.getColor(d,names);
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
});
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
	optionHandler.pointer = options.id;
	var t = new Object();
	var title = new Object();
	var names = columnNames(options.matrix);
	t[options.matrix[1][0]]=options.matrix[0][0];
	title["label"] = options.matrix[1][0];
	var chart = c3.generate({
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			xs: t,
			columns :options.matrix,
			type: 'scatter',
			color: function (color, d) {
				return datacolors.getColor(d,names);
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
		
	});
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
	var chart = c3.generate({
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			xs: t,
			columns : options.matrix,
			type: 'scatter',
			color: function (color, d) {
				console.log(d);
				return datacolors.getColor(d,names);
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
		
	});


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
	var chart = c3.generate({
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
	});
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
	optionHandler.pointer = options.id;
	var m = options.matrix.slice(1,options.matrix.length);
	var names = columnNames(options.matrix);
	var chart = c3.generate({
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			columns: m,
			type : 'pie',
			color: function (color, d) {
				console.log(options.color);
				return datacolors.getColor(d,names,options.color);
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
		
	});
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
	var chart = c3.generate({
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
	});
	return chart;
}

/**
* Plots stacked area chart
*/
function stackedArea(matrix){
	var obj = new Object();
	obj[matrix[0][0]] = '#ff0000';

	matrix.shift();
	chart = c3.generate({
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

});
	return chart;
}


/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/
function stackedBar(options){
	optionHandler.pointer = options.id;
	var toggle = 1;
	console.log(options.matrix);
	var r = 0;
	var rot = options.matrix.length > 3; rotated : false ? rotated : true;
	if(rot){r = 70;}
	var names2 = columnNames(options.matrix);
	names = names2.slice(1,names2.length);
		var xMargin = xHeight(options);
	// matrix.unshift(header);

	var chart = c3.generate({
		bindto: options.container,
		interaction: { enabled:  options.interaction },
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

				return datacolors.getColor(d,names2);
			},

			groups :  [names],
		},
		axis: {
			rotated : rot,
			x: {
				show : options.axis,
				height : xMargin,
				type: 'categorized',
				tick: {
					rotate: 75
				},
			},
			y : {
				show : options.axis,
				// label: matrix[0][0]
			}
		},
		tooltip: {
			show : options.tooltip
		},
		legend : {
			show : options.legend
		},

	});
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
	// var sum = getArrayMax(values);
	var chart = c3.generate({
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

});
return chart;
}

function slideBar(matrix){
	createSlider();
	// matrix.unshift(header);
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
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
	});
	return chart;
}
function slidePie(matrix){
	createSlider();
	// matrix.unshift(header);
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		interaction: { enabled:  options.interaction },
		data: {
			x : header[0],
			rows : [header,matrix[0]],
			type: 'pie',

		},
		tooltip: {
			show : pollchart.options.tooltip
		},
		legend : {
			show : pollchart.options.legend
		},
		donut: {
			title: function(){return matrix[1][0];}
		},
		axis: {
			x: {
				type: 'categorized'
			}
		}
	});
	return chart;
	
}
function heatmap(options){
	var m = options.matrix;
	console.log(m);
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

          //antal färger

          var index = options.container.split("charty").slice(-1)[0]-1;
          buckets = 8;
          optionHandler.array[optionHandler.size-1].classname="tumbheat";
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
           .attr("x", function(d) {return (d.row * gridSize); })
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
 function heatmap2(options){
    $(options.container).css("margin-left",0)
    var m = options.matrix;
	var head =  m[0].slice(1,m[0].length);
	m=m.slice(1,m.length);
	var dim_1 = columnNames(m);
	console.log(dim_1);
	var dim_2 = head;
		var longest = getArrayMax(dim_1);
		var longest2 = getArrayMax(dim_2);
	var rowlength = dim_1.length;
	var columnlength = dim_2.length;
	var maxSize = rowlength > columnlength ? rowlength : columnlength;
	var array = matrixToRevArray(copyMatrix(m));
	console.log(array);
	var w = $(options.container).width();
	var fontSize = 12;
	// w=w*2/3;
	


console.log("Longest---->  " +longest);
	console.log("Gridsize ---->  " + gridSize);
console.log("Margin top ---->  " +marginTop);
	var index = options.id;
	// if($("#charty1").height() > 1){
	console.log($(options.container).height() );
	var h = $(options.container).parent().width() - ($(options.container).parent().width() - $(options.container).height())
	// var h = marginTop + gridSize * (columnlength +2);
		console.log("Parent HEIGHT ---> " + $(options.container).parent().height() );
	console.log("info HEIGHT ---> " + $(options.container).height());
	console.log("SVG HEIGHT ---> " + h);
	// $(".tumbchart").height();
	// }else{
		// var h =  w;
	// }
	
	var textLength = fontSize*longest;
	var gridSize = Math.floor((h)/(maxSize + 3));
	var padding = gridSize/maxSize;
var marginTop = 1.2 * gridSize;
	// var h = 900;
	var shiftR = 10;
	var margin = { top: 0, right: 0, bottom: 0, left: 0 },
	width =  w- margin.left - margin.right,
	height = h - margin.top - margin.bottom,

	legendWidth = (gridSize/2);

       	var index = options.container.split("charty").slice(-1)[0]-1;
          //antal färger
          buckets = 8;
          var svg = d3.select(options.container).append("svg")
          .attr("class","heat")
          .attr("id","tumbheat" + index)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var maxNum = Math.round(d3.max(array,function(d){ return d; }));

          // var colors = colorbrewer.RdYlGn[buckets];
          // var colors = datacolors.colors[4];
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

          //Header
          var dim1Labels = svg.selectAll(".dim1Label")
          .data(dim_1)
          .enter().append("text")
          .text(function (d) { 
          	// if(d.length>12){return d.substring(0,12)+"...";} 
          	// else {
          	return d;})
          .attr("x", 0)
          .attr("y", function (d, i) { return i * gridSize + gridSize/2 + marginTop; })
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
                // .attr("x", function(d, i) { return (i * gridSize) + 20; })

                // .attr("y", 0)
                // .style("text-anchor", "middle")
                // .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class","heatlabel")
                // .attr("dy", ".71em")
                .text(function(d) {console.log(d); return d})
                .style("font-weight","bold")
                   .style("font-family","Lato")
                .style("font-size", fontSize+"px")
                .attr("text-anchor","center")
				.attr("transform", function(d,i) {    // transform all the text elements
  return "translate(" + // First translate
  ((i * gridSize) + textLength+gridSize/2)  + ","+marginTop+") " + // Translation params same as your existing x & y 
    "rotate(-45)"            // THEN rotate them to give a nice slope
});
          //heatmap
          var count=0,count2=0;
          var heatMap = svg.selectAll(".dim2")
          .data(array)
          .enter().append("g")
           // .style("fill", colors[0])
           .attr("class", "dim2");
           console.log(heatMap);
           var rec = heatMap.append("rect")
           // .attr("x", function(d) { console.log("x  " + d);count++; return ((count%columnlength - 1) * gridSize) + textLength +gridSize; })
           // .attr("y", function(d) { console.log("y   "+d);count2++; return ( Math.ceil(count2/(columnlength))-1) * gridSize + marginTop; })
 			.attr("x", function(d) {return (d.row * gridSize) + textLength; })
           .attr("y", function(d) { return d.col * gridSize + marginTop; })
           .attr("rx", 4)
           .attr("ry", 4)
           .attr("class", "dim2 bordered")
           .attr("width", gridSize-padding)
           .attr("height", gridSize-padding)
           .attr("class", "square")
           rec.transition()
           .style("fill", function(d) {return colorScale(d.value); });
           heatMap.append("title").text(function(d) {return d.value; });

           var count=0,count2=0;
           heatMap.append("text")

           .text(function(d) { return  Math.round(d.value); })
           // .attr("x", function(d) { count++; return ((count%columnlength - 1) * gridSize) + textLength+ gridSize+ gridSize/2; })
           // .attr("y", function(d) { count2++; return ( Math.ceil(count2/(columnlength))-1) * gridSize + marginTop + gridSize/2; })
           .attr("x", function(d) {return (d.row * gridSize) + textLength + gridSize/2;  })
           .attr("y", function(d) { ; return d.col * gridSize + marginTop + gridSize/2; })
           .attr("text-anchor","end")
          .style("font-size", gridSize/3+"px")
          .style("font-family","Lato")
          // .style("font-family", "Calibri")
          .attr("class", "rectext")

          .style("stroke-width","0px")
          .style("text-shadow","none");



          var ledc=0;
          var legend = svg.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), function(d) {return d; })
          .enter().append("g")
          .attr("class", "legend");

          legend.append("rect")
          .attr("x", function(d, i) { return  (i%4 * legendWidth + textLength) ; })
          .attr("y", function(d, i) {k=0; if(i>3){k=1} return (rowlength) * (gridSize) + k * legendWidth + marginTop; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", legendWidth*0.8)
          .attr("height", legendWidth*0.8)
          .style("fill", function(d, i) { return colors[i]; })
          .attr("class", "square");
          
          legend.append("text")
          .attr("class", "heatlegend")
          .text(function(d) { return  Math.round(d)+"+"; })
 			.attr("x", function(d, i) { return  (i%4 * legendWidth + textLength) ; })
          .attr("y", function(d, i) {k=0; if(i>3){k=1} return (rowlength) * (gridSize) + k * legendWidth + marginTop+ legendWidth/2; })
           .attr("text-anchor","middle")
          .attr("class", "heatlegend")
             .style("font-family","Lato")
          .style("font-size", fontSize/1.5+"px")
                ;
       /*     .attr("x", function(d, i) { return gridSize * 11 + 25; })
            .attr("y", function(d, i) { return (i * legendWidth + 20); })
            */
            var title = svg.append("text")
            .attr("class", "legendtitle")
            .attr("x", 0)
            .attr("y", rowlength * (gridSize) + marginTop + legendWidth)         
            .style("font-size", fontSize+"px")
               .style("font-family","Lato")
            .text("Legend")
            .style("font-weight","bold");
        }