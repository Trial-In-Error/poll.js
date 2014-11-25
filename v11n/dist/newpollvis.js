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
	[[histogram],[pie,bar/*,bar2*/],[stackedBar,heatmap2,lineCat,bar/*,bar2*/]],
	[[scatter,line,regressionline],[/*lineCat*/stackedBar,bar/*,bar2*//*,pie*/],[bubble]],
	[[bubble]]
	]
	,
	charts2    :[
	[[histogram],[pie,bar/*,bar2*/],[stackedBar,heatmap2,lineCat,bar/*,bar2*/]],
	[[scatter,line,regressionline],[/*lineCat*/stackedBar,bar/*,bar2*/,pie],[bubble]],
	[[bubble]]
	]
	,
};
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
	"slidepie" : slidePie,
	"histogram" : histogram,
	"tempBar" : tempBar
}
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
	getColor : function(group,names,options){
		var currColor = options.color;
		index = 0;
		datacolors.index = (datacolors.index + 1) % (datacolors.colors[0].length);
		if($.inArray(group,names) != -1){
			console.log("COLOR");
			console.log(datacolors.colors[currColor][getIndex2(names,group)]);
			return datacolors.colors[currColor][getIndex2(names,group)];
		}else {
			//if users choice
/*			if(options.answer != null){
				console.log(options.answer);
				if(group.id==options.answer || group == options.answer){
				var answer = stripPunctuationAndHyphenate(options.answer);
				$(".c3-legend-item-" +answer+"- .c3-legend-item-tile").css("fill",this.highlightColor)
				return this.highlightColor;
			}
		}*/
			console.log("COLOR");
			console.log(datacolors.colors[currColor][getIndex2(names,group)]);
				return datacolors.colors[currColor][getIndex2(names,group.id)];

					// }
				}

			}
		}

function stripPunctuationAndHyphenate(string) {
return string.replace(/[\.,\\/#!$%\^&\*;:{}=_`~()]/g,"").replace(/\s{2,}/g,"-");
}

var dataHandler = function  () {

	this.pollurl;
	this.question_url_list = [];

	this.polldata = null;
	this.questionList = [];
	this.pureData = [];
	/**
	*
	*/
	this.setPollurl = function(url){  
		this.pollurl = url;
		
	}

	this.addQuestion = function(url){
		this.question_url_list.push(url);
	}
	/**
	*	
	*/
	this.getPoll = function(callback){
		//No url, method returns
		var self = this;
		if(this.pollurl == null){
			alert("No poll data");
			return;
		}
		//run callback with polldata
		 if(this.polldata != null){
				callback(this.polldata);
		// no data exist, fetch data from url
		}else{
			d3.json(this.pollurl, function(data) {
				self.polldata=data;
				callback(data);
			});
		}
	}


this.getQuestionByIndex = function(numb){
	return questionList[numb];
}


this.pollTemplate = {
	id : null,
	name : null,
	simpleID : null,
	open : null,
	owner : null,
	question_list : []
}

this.questionTemplate = {
	id : null,
	body : "nameOfQuestion",
	type : "questionType",
	response_list : []
}

this.responseTemplate = {
	body : "nameOfResponse",
	answers :[],
	timestamp: null,
	value : null
}
this.userTemplate = {
	anonymous : null,
	token: null,
}
}
var buttons ={
	swap : "växla",
	normalize : "Q1 i %",
	normalize2 : "Q2 i %" ,
	share : "dela"
}
var titles = {
  QUESTIONCOMBO : "Två frågor",
  Q1 : "Q1: ",
  Q2 : "Q2: ",
  FREQUENCY : "Frekvens av svar",
  DISTRIBUTION : "Fördelning av svar",
  MEAN : "Medelvärde"
}

var errorMessages = {
	share : "Denna funkion är inte tillgänglig än"
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
visualizeChart : function(ref,structure,data,frequency,question,chart,container){
	var matrix;

	var dt = "frequency";
	if(question.length==1){
		matrix =  flashpoll.getSingleMatrix(structure,frequency,question[0]);
		console.log(matrix);
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
		}

		
		ref.optionsdata.addChart(container);
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"matrix",matrix);
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"chart",chartNames[chart]);
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"color",1)
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"id",optionHandler.size-1)
		// ref.optionsdata.updateOption(ref.optionsdata.size-1,"answer",answer)
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"xlabel","Something")
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"ylabel","frequency")
		ref.optionsdata.pointer = ref.optionsdata.size-1;
		var chart = chartNames[chart](ref.optionsdata.getOption(ref.optionsdata.size-1));
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"c3",chart);
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
	getSingleMatrix : function(structure,frequency,id){
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
	if(sum==0){
		return 1;
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
function getArrayMaxElement(a,offset){
	var max = 0;
	var ret = "";
	for (var i = offset; i < a.length; i++) {
		if(max<a[i].length){
			max=a[i].length
			ret=a[i];
		}
	}
	return ret;
}
function getArrayMax(a,offset){
	var max = 0;
	for (var i = 1; i < a.length; i++) {
		if(max<a[i].length){
			max=a[i].length;
			console.log(max);
		}
	}
	return max;
}
function getMatrixMax(matrix){
	var max = 0;
		for (var i = 1; i < matrix.length; i++) {
				if(max < getMax(matrix[i])){
					max = getMax(matrix[i]);
				} 
		}
	console.log("MATRIX MAX  " + max);
	return max;
}
function getMax(a){
		var max = 0;
	for (var i = 1; i < a.length; i++) {
		if(max<a[i]){
			max=a[i];
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
	var header = new Array();
	var bucketsize =5;
	var head = data.splice(0,1);
	var buckets = new Array(bucketsize);
	var min = Math.min.apply(Math, data),
	max = Math.max.apply(Math, data);
	console.log(min);
		console.log(max);
	var diff = max - min;
	var step = parseInt(max/bucketsize);
	console.log(step);
	for(var i = 0; i <= bucketsize; i++){
		buckets[i]=0;
		var minm =  (step*i).toString();
		console.log(minm);
		var maxm =  (step*(i+1)).toString();
		// header[i] = minm.substring(0,4) + "-" +maxm.substring(0,4);
		header[i] = minm.split('.')[0] + "-" +maxm.split('.')[0];
				console.log("min " + step*i);
			console.log("max " + step*(i+1));
		for(var j = 0; j < data.length; j++){
	// console.log("data " + data[j]);
			if(step*i<data[j] && step*(i+1) > data[j]){
				buckets[i]+=1;
			}
		}
		console.log(buckets);
	}
	// buckets.unshift(head[0])
	buckets.unshift("Freqency")
	var ret = [];
	ret.push(header);
	ret.push(buckets);
	return [ret,step];
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
function normalizeColumns(matrix){
	var m = swapCategorical(matrix);
	m = normalizeByRow(m);
	return swapCategorical(m);
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
function addToSideHeader(matrix,add){
	for(var i = 0; i<matrix.length;i++){
		matrix[i][0]+=add;
	} 
		return matrix;
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
function addInfo(qustions,name){
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
		$(container).append("<div class='item "+name+"' id='"+id+"'></div>");
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

	dataTypes : {"pick_n":"nominal", "slider" : "ratio","RADIO":"nominal","ORDER":"nominal","CHECKBOX":"nominal"},

/*
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
preparePoll : function(data,questions,container,optionHandler){
	visframes.container = container;
	// var performance = new Timetool();
	
	// var matrixMemory = buildEmptyMatrix(data.question_list.length,data.question_list.length);

	optionHandler.isMobile();

	var visualizationTypes = opine.calculateVisualizations(opine.reduceQuestionArray(data,[]),data,false);
	optionHandler.visTypes = visualizationTypes;
	//sets all data for the visualizations
	opine.setOptions(data,visualizationTypes, optionHandler);
		

	

	// new Masonry("#"+container, { "columnWidth": ".item", "itemSelector": ".item", "gutter": ".gutter-sizer" })
},

setOptions : function(data,visualizationTypes,optionHandler){
	for (var i = 0; i < visualizationTypes.length; i++) {
		if(visualizationTypes[i].ids.length==1){
			// var matrix;
			matrix = opine.getSingeMatrix(data,parseInt(visualizationTypes[i].ids[0]));

			for (var u = 0; u < visualizationTypes[i].types.length; u++) {
					var rnd = Math.floor(Math.random()*4);
					var variable = {};
					optionHandler.addChart("#charty"+(optionHandler.size));
					var chartyID = optionHandler.chartID + (optionHandler.size-1);
					console.log(optionHandler.chartID);
					console.log(optionHandler.size-1);
					visframes.addBasic("item","topid","tumbchart", chartyID);
					optionHandler.updateOption(optionHandler.size-1,"matrix", matrix.slice(0));
					optionHandler.updateOption(optionHandler.size-1,"orgmatrix",matrix.slice(0));
					optionHandler.updateOption(optionHandler.size-1,"chart",visualizationTypes[i].types[u]);
					optionHandler.updateOption(optionHandler.size-1,"color",rnd);
					optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1);
					optionHandler.updateOption(optionHandler.size-1,"ylabel", visualizationTypes[i].ylabel);
					optionHandler.updateOption(optionHandler.size-1,"xlabel", visualizationTypes[i].xlabel);
					optionHandler.array[optionHandler.size-1].questions.push(data.question_list[visualizationTypes[i].ids[0]].type.name);
					optionHandler.updateOption(optionHandler.size-1,"title", data.question_list[visualizationTypes[i].ids[0]].body);
					var chartTitle = getTitle(visualizationTypes[i].types[u]);
					optionHandler.updateOption(optionHandler.size-1,"info", chartTitle);
				};
			}
			else{
/*				for (var u = 0; u < visualizationTypes[i].types.length; u++) {
				var rnd = Math.floor(Math.random()*4);
				optionHandler.addChart("#charty"+(optionHandler.size+1));
			
				optionHandler.updateOption(optionHandler.size-1,"chart",visualizationTypes[i].types[u]);
				optionHandler.updateOption(optionHandler.size-1,"color",rnd);
				optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1);
				optionHandler.updateOption(optionHandler.size-1,"ylabel", visualizationTypes[i].ylabel);
				optionHandler.updateOption(optionHandler.size-1,"xlabel", visualizationTypes[i].xlabel);

				optionHandler.updateOption(optionHandler.size-1,"title", titles.QUESTIONCOMBO);
				optionHandler.updateOption(optionHandler.size-1,"info", 
					titles.Q1 + data.question_list[visualizationTypes[i].ids[0]].body);
				optionHandler.updateOption(optionHandler.size-1,"info2", 
					titles.Q2  + data.question_list[visualizationTypes[i].ids[1]].body
					);
				optionHandler.array[optionHandler.size-1].questions.push(data.question_list[visualizationTypes[i].ids[0]].type.name);
				optionHandler.array[optionHandler.size-1].questions.push(data.question_list[visualizationTypes[i].ids[1]].type.name);

			};*/
		}
	}
	},

	visAll : function(data, optionHandler,question){
	console.log(data);
	console.log(optionHandler);
	// var performance = new Timetool();
	
	// var matrixMemory = buildEmptyMatrix(data.question_list.length,data.question_list.length);
	// console.log("MATRIX MEMORY");
	// console.log(matrixMemory);
	// optionHandler.isMobile();

	// var visualizationTypes = opine.calculateVisualizations(opine.reduceQuestionArray(data,question),data,false);
	var visualizationTypes = optionHandler.visTypes;
	for (var i = 0; i < visualizationTypes.length; i++) {
		if(visualizationTypes[i].ids.length==1){
			var matrix;
				matrix = opine.getSingeMatrix(data,parseInt(visualizationTypes[i].ids[0]));
				for (var u = 0; u < visualizationTypes[i].types.length; u++) {

				var chart = visualizationTypes[i].types[u](optionHandler.getOption(optionHandler.size-1));
				optionHandler.updateOption(optionHandler.size-1,"c3",chart);
				};
			// }
		}
		else{
/*			for (var u = 0; u < visualizationTypes[i].types.length; u++) {
				var matrix;

					matrix=opine.getDoubleMatrix(data,visualizationTypes[i].ids);
				var rnd = Math.floor(Math.random()*4);

				var chart = visualizationTypes[i].types[u](optionHandler.getOption(optionHandler.size-1));
				optionHandler.updateOption(optionHandler.size-1,"c3",chart);

			};*/
		}

	}
	// new Masonry(container, { "columnWidth": ".item", "itemSelector": ".item", "gutter": ".gutter-sizer" })
	
},

/**
*Visualizes all posible graphs from a set of questions from a poll
*and render the visualizations in a grid
*param{json} data - jsonfile with the polldata
*param{array} question - array containing the positions of the qustions in the poll
*/
init : function(ref,container,question,options){
	var data = ref.dataHandler.polldata;
	var optionHandler = ref.optionsdata;
	// var performance = new Timetool();
	console.log(ref);
	// var matrixMemory = buildEmptyMatrix(data.question_list.length,data.question_list.length);
	// console.log("MATRIX MEMORY");
	// console.log(matrixMemory);
	// optionHandler.isMobile();
	visframes.container = container;
	var visualizationTypes = opine.calculateVisualizations(opine.reduceQuestionArray(data,question),data,false);
	console.log(visualizationTypes);
	for (var i = 0; i < visualizationTypes.length; i++) {
		if(visualizationTypes[i].ids.length==1){
			var matrix;
			
	
				matrix = opine.getSingleMatrix(data,parseInt(visualizationTypes[i].ids[0]));

				for (var u = 0; u < visualizationTypes[i].types.length; u++) {
					var rnd = Math.floor(Math.random()*4);
					optionHandler.addChart("#charty"+(optionHandler.size));
					var chartyID = optionHandler.chartID + (optionHandler.size-1);
					console.log(optionHandler.chartID);
					console.log(optionHandler.size-1);
					visframes.addBasic("item","topid","tumbchart", chartyID);

					optionHandler.updateOption(optionHandler.size-1,"matrix", matrix.slice(0));
					optionHandler.updateOption(optionHandler.size-1,"orgmatrix",matrix.slice(0));
					optionHandler.updateOption(optionHandler.size-1,"chart",visualizationTypes[i].types[u]);
					optionHandler.updateOption(optionHandler.size-1,"color",rnd);
					optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1);
					optionHandler.updateOption(optionHandler.size-1,"ylabel", visualizationTypes[i].ylabel);
					optionHandler.updateOption(optionHandler.size-1,"xlabel", visualizationTypes[i].xlabel);
					optionHandler.array[optionHandler.size-1].questions.push(data.question_list[visualizationTypes[i].ids[0]].type.name);
					optionHandler.updateOption(optionHandler.size-1,"title", data.question_list[visualizationTypes[i].ids[0]].body);
					var chartTitle = getTitle(visualizationTypes[i].types[u]);
					optionHandler.updateOption(optionHandler.size-1,"info", chartTitle);
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
					matrix=opine.getDoubleMatrix(data,visualizationTypes[i].ids);
				var rnd = Math.floor(Math.random()*4);
				optionHandler.addChart("#charty"+(optionHandler.size));
				var chartyID = optionHandler.chartID + (optionHandler.size-1);
					visframes.addBasic("item","topid","tumbchart", chartyID);

				optionHandler.updateOption(optionHandler.size-1,"matrix",copyMatrix(matrix));
				optionHandler.updateOption(optionHandler.size-1,"orgmatrix",copyMatrix(matrix));
				optionHandler.updateOption(optionHandler.size-1,"chart",visualizationTypes[i].types[u]);
				optionHandler.updateOption(optionHandler.size-1,"color",rnd);
				optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1);
				optionHandler.updateOption(optionHandler.size-1,"ylabel", visualizationTypes[i].ylabel);
				optionHandler.updateOption(optionHandler.size-1,"xlabel", visualizationTypes[i].xlabel);

				optionHandler.updateOption(optionHandler.size-1,"title", titles.QUESTIONCOMBO);
				optionHandler.updateOption(optionHandler.size-1,"info", 
					titles.Q1 + data.question_list[visualizationTypes[i].ids[0]].body 
					+ "<br>" + 
					titles.Q2  + data.question_list[visualizationTypes[i].ids[1]].body
					);
				optionHandler.array[optionHandler.size-1].questions.push(data.question_list[visualizationTypes[i].ids[0]].type.name);
				optionHandler.array[optionHandler.size-1].questions.push(data.question_list[visualizationTypes[i].ids[1]].type.name);

				var chart = visualizationTypes[i].types[u](optionHandler.getOption(optionHandler.size-1));
				optionHandler.updateOption(optionHandler.size-1,"c3",chart);

			};
		}

	}
	// console.log(matrixMemory);
	// console.log(performance.stopTimer());
	new Masonry(container, { "columnWidth": ".item", "itemSelector": ".item", "gutter": ".gutter-sizer" })
	// if(callback){
	// 	callback();
	// }
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
	var visualizationTypes = opine.calculateVisualizations(opine.reduceQuestionArray(data,question),data,true);
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
		console.log(answer);
		optionHandler.addChart(container);
		optionHandler.updateOption(optionHandler.size-1,"matrix",matrix);
		optionHandler.updateOption(optionHandler.size-1,"chart",chartNames[chart]);
		optionHandler.updateOption(optionHandler.size-1,"color",color)
		optionHandler.updateOption(optionHandler.size-1,"id",optionHandler.size-1)
		optionHandler.updateOption(optionHandler.size-1,"answer",answer)
		optionHandler.updateOption(optionHandler.size-1,"xlabel","Something")
		optionHandler.updateOption(optionHandler.size-1,"ylabel","frequency")
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
			ylabel : "Frekvens",
			xlabel : "Categories"
		});


		for (var j = i+1; j < q.length; j++) {
			if((array[q[i]].type.name=="slider" && array[q[j]].type.name=="pick_n") || (array[q[j]].type.name=="slider" && array[q[i]].type.name=="pick_n")){
				combinations.push(
				{
					ids:[q[i],q[j]],
					types: getListOfCharts([array[q[i]].type.name,array[q[j]].type.name],single),
					ylabel : titles.mean,
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
getSingleMatrix : function(data,visualizationTypes){
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
											console.log("TOKEN  ");
											console.log(parseInt(l.value));
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
			if(array.length == 0){
				for (var i = 0; i < data.question_list.length; i++) {
					if(data.question_list[i].type.name != "not_a_question" ){
						questions.push(i);
					}
				};
			}else{
				for (var i = 0; i < array.length; i++) {
					if(data.question_list[array[i]].type.name != "not_a_question" ){
						questions.push(array[i]);
					}
				};
			}
			console.log("QUESTIONs");
			console.log(questions);
			return questions;
		}
	}
	function getTitle(func){ 
		if(functionName(func) == "pie"){
			return titles.DISTRIBUTION;
			getTitle}
			else{
				return titles.FREQUENCY;
			}     
		}
/**
* optionHandler holds all the charts data and functions for
* updating and adding options
*/
var optionHandler = function(){
this.myDefault = null;
this.chartID = "charty";
this.array = [];
this.size = 0;
this.pointer = 0;
this.visTypes = null;
this.addChart = function(container){
	var c = JSON.parse(JSON.stringify(defaultOptions));
	// var c = defaultOptions;
	c.container = container;
	this.size++;
	this.array.push(c);
	return this.array.length-1;
},
this.updateOption = function(index, opt, value ){
	this.array[index][opt] = value;
},
this.addOptions = function(options){
	if(this.myDefault ==null){
		this.myDefault = defaultOptions;
	}

	for(key in options){
		this.myDefault[key] = options[key];
	}
},
this.isMobile = function(){
	if(window.innerWidth<400){
		defaultOptions.mobile=true;
		defaultOptions.legendOffset = 40;
	}
},
this.getOption = function(index){
	return this.array[index];
}
}
/**
* if no option is specified default options are used
*/
var defaultOptions = {
	div : null,
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
	interaction : true,
	answer : null,
	questions : [],
	title:  "no title",
	info : "no info about the visualization",
	title2 : "no title",
	info2 : "no info about the visualization",
	norm : false,
	norm2 : false,
	correlation : null,
	independence: null,
  	legendMargin : 0,
   	swap: false,
}

var mytest = "my_testfile";
var visframes = {
	container : null,
	basicFrame : function(topclass,topid,chartclass,chartid){
		return $("<div class='"+topclass+"' id='"+topid+"'></div>").append("<div class='"+chartclass+"'' id='"+chartid+"'></div>");
	},
	addBasic: function(topclass,topid,chartclass,chartid){
		if(visframes.container==null){
			$('#container').append(basicFrame(topclass,topid,chartclass,chartid));
		}else{
			console.log(visframes.container);
			$(visframes.container).append(visframes.basicFrame(topclass,topid,chartclass,chartid));
		}

	}
}

var visGenerator = function(options){
	
}

var visualizations = {


}
/**
* 
*/
var getWordWidth = function(word){
	console.log("THIS IS THE WORD");
	console.log(word);
	$('body').append("<div class='c3' id='textw'>"+word+"</div>");
	var width = $('#textw').width();
	console.log(width);
	$('#textw').remove();
	return width;
}
var getWordWidth2 = function(word){
	console.log("THIS IS THE WORD");
	console.log(word);
	$('body').append("<div class='c3-axis' id='textw'>"+word+"</div>");
	var width = $('#textw').width();
	$('#textw').remove();
	console.log(width);
	return width;
}
var getWordHeight = function(word){
	$('body').append("<div class='c3' id='textw'>"+word+"</div>");
	var height = $('#textw').height();
	$('#textw').remove();
	return height;
}

function rotateText(names){
	/*var max = getArrayMax(names);
	var max2 = getArrayMax(cnames);
	console.log(names);
	console.log("MAX  "  + max);*/
	if(names.length > 4 ){
		return 40;
	}else{
		return 0;
	}
}
function xHeight(names,r){
	console.log(r);
	// console.log(getArrayMaxElement(names,1));
	var word = getArrayMaxElement(names,1);
	console.log("MY WORD");
	console.log(word);
		// word +=" ";
		if(r>10){
			return getWordWidth2(word);
		}else{
			return getWordHeight(word) * 2;
		}

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
	// var names = m[0];
	var r;
	console.log("IS SWAPED ???? "  + options.swap);
	if(options.swap){
		r= rotateText(names);
	}else{
		r= rotateText([""]);
		// r= rotateText(m[0]);
	}

	var rot = m.length > 7; rotated : false ? rotated : true;
	for (var i = 1; i < m[0].length; i++) {
		names.push(m[0][i]);
	};
	options.legendMargin = xHeight(names,r);
	console.log(options.legendMargin);
	// options.legendMargin = textWidth(getArrayMaxElement(),)
	var c = 0;
	var chart = c3.generate({
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
			width : 0.9,
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


});
	// Removes side text
	if(rot && m.length > 2){
		$(options.container+" .c3-axis-x .tick text").remove();
		// $("#charty2 .c3-axis-x .tick text").remove();
	}
	return chart;
	// pollchart.data.push({chart : chart, matrix : matrix});
}

function tempBar(options){
	optionHandler.pointer = options.id;
	var m = options.matrix;
	if(m[0].length>4){r = 70;}
	var names = columnNames(m);
	// var names = m[0];
	var r;
	console.log("IS SWAPED ???? "  + options.swap);
	if(options.swap){
		r= rotateText(names);
	}else{
		r= rotateText([""]);
		// r= rotateText(m[0]);
	}

	var rot = m.length > 7; rotated : false ? rotated : true;
	for (var i = 1; i < m[0].length; i++) {
		names.push(m[0][i]);
	};
	options.legendMargin = xHeight(names,r);
	console.log(options.legendMargin);
	// options.legendMargin = textWidth(getArrayMaxElement(),)
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
			width : 0.9,
			width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
    },

    tooltip: {
    	show : options.tooltip,
    	grouped : false
    },
    legend : {
    	show : options.legend,
    	item : {
    		onclick : function(d){ 
    			return
    		}
    	}
    	
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


});
	// Removes side text
	if(rot && m.length > 2){
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
	var ma = disk(options.matrix);
	var d=ma[0];
	console.log(d);
	optionHandler.pointer = options.id;
	var names = d[0].slice(0);
	d[0].unshift("Answer");
	var r = rotateText(names, options);

	// var rot = true;
	// console.log(r);
	options.legendMargin = xHeight(names,70);
	console.log(options.legendMargin);
	var chart = c3.generate({
		bindto: options.container,
		interaction: { enabled:  options.interaction },
		data: {
			x: "Answer",
			columns : d,
			type: 'bar',
			color: function (color, d) {
				console.log(d);

				console.log(ma[1]);
				var myInt = parseInt(options.answer);
				console.log(options.answer);
				if(d.index != null){
					if(myInt >= ma[1]*d.index && myInt < ma[1]*(d.index+1)){
						// console.log("INSIDE");
						return "#EE474D";
					}
				}

				return "#1F4557"
				// return datacolors.colors[options.color][0];
			/*	console.log(d);
				var id = d.index;
				if(id != null){
					return datacolors.getColor(names[d.index],names);
				}
				return datacolors.getColor(names[0],names);*/
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
	});
	// $(".c3-legend-item-" +options.answer+"- .c3-legend-item-tile").css("fill","#EE474D")
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
	var chart = c3.generate({
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
	// optionHandler.pointer = options.id;
	var toggle = 1;
	console.log(options.matrix);
	var r = 0;
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
	options.legendMargin = xHeight(names,r);
	// matrix.unshift(header);

	var chart = c3.generate({
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
				show : options.axis,
				height: options.legendMargin,
				// height : 1000,
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
		padding : {
			left : 100
		}
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

          var index = options.container.split("charty").slice(-1)[0]-1;
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
		// var h =nHeight;
		var	h = $(options.container).parent().height();
		var titleHight = getWordWidth2("T") * 3;
		var topWord = getArrayMaxElement(dim_2,0).trunc(MAXWORDLENGHT);
		var marginTop = getWordWidth2(topWord);
		var longestElement = getArrayMaxElement(dim_1,0).trunc(MAXWORDLENGHT)+"  %";
		var textLength = getWordWidth2(longestElement);
		// var gridSize = Math.floor((h-marginTop)/(maxSize+2));
		var gridSize = Math.floor((w-textLength)/(maxSize+2));
		var gridSize2 = Math.floor((h-marginTop-gridSize-titleHight)/(maxSize));
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


	var centerPadding = ($(options.container).width()-(textLength + (gridSize * cc)))/2;
	// var centerPadding = 0;
	var index = options.container.split("charty").slice(-1)[0]-1;
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
            .style("text-anchor","middle")
            .style("fill","#FF0000")
            .text(options.ylabel)
            .style("font-weight","bold");

    	var question1Title = svg.append("text")
            .attr("class", "heatquestiontitle")
            .style("font-size", fontSize+"px")
            .style("fill","#FF0000")
            .style("font-family","Lato")
            .style("text-anchor","middle")
            .text(options.xlabel)
            .style("font-weight","bold")
           .attr("transform", function(d,i) {    // transform all the text elements
  return "translate(" + // First translate
  (titleHight/2+ centerPadding) + ","+((h/2)-marginTop)+") " + // Translation params same as your existing x & y 
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
           console.log(heatMap);
           var rec = heatMap.append("rect")
           // .attr("x", function(d) { console.log("x  " + d);count++; return ((count%columnlength - 1) * gridSize) + textLength +gridSize; })
           // .attr("y", function(d) { console.log("y   "+d);count2++; return ( Math.ceil(count2/(columnlength))-1) * gridSize + marginTop; })
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
            return  (d.value/reduceNum).toFixed(1); })
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
            .text("Enhet " + valueLabel)
            .style("font-weight","bold");

          var ledc=0;
          var legend = svg.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), function(d) {return d; })
          .enter().append("g")
          .attr("class", "legend");
          console.log(legend);
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
          .style("font-size", fontSize/1.5+"px");
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
var visualizepolls = function(){
	this.dataHandler = new dataHandler();
	this.pollsetOptions;
	this.supercontainer;
	this.optionsdata = new optionHandler();
	console.log(this.optionsdata);
	this.getDataHandler = function(){
		return this.dataHandler;
	}
	this.setURL = function(url){
		this.dataHandler.setPollurl(url);
	}
	this.start = function(callback){
		var self = this;
		this.dataHandler.getPoll(
			function(data){
				callback(self);
			});
	}
	this.createGrid = function(ref,container,questions,options){
		opine.init(ref,container,questions,options);
	}
	this.createVis = function(questions,options,container){
		opine.preparePoll(data,questions,container, self.optionsdata);
	}
	this.visualizePoll = function(self,questions){
		console.log(self.dataHandler);
		opine.visAll(self.dataHandler.polldata,self.optionsdata,questions);
	}
	this.visualizeChart = function(ref,questions,vis,options,container){
		var id = ref.optionsdata.addChart(container);
		console.log(ref.dataHandler.polldata);
		if(questions.length == 0 ){
			alert("No data");
		}
		else if(questions.length > 1){
			ref.optionsdata.updateOption(id,"matrix",opine.getDoubleMatrix(ref.dataHandler.polldata,questions));
			ref.optionsdata.updateOption(id,"chart",chartNames[vis]);
			ref.optionsdata.updateOption(id,"color",1)
			ref.optionsdata.updateOption(id,"id",optionHandler.size-1)
			// ref.optionsdata.updateOption(ref.optionsdata.size-1,"answer",answer)
			ref.optionsdata.updateOption(id,"xlabel","Something")
			ref.optionsdata.updateOption(id,"ylabel","frequency")
			ref.optionsdata.pointer = id;
			var chart = chartNames[vis](ref.optionsdata.getOption(id));
			ref.optionsdata.updateOption(id,"c3",chart);

		}else{
			ref.optionsdata.updateOption(id,"matrix",opine.getSingleMatrix(ref.dataHandler.polldata,questions));

			chartNames[vis](ref.optionsdata.getOption(id));
		}

	}
	this.flashChart = function(url,question,container,chart){
	var self = this;
	d3.json(url+".json", function(structure) {
		d3.json(url+"results.json", function(data) {
			d3.json(url+"result.json", function(frequency) {
						console.log(data);
				console.log(frequency);
				flashpoll.visualizeChart(self,structure,data,frequency,question,chart,container);
			});
		});
	});
	}
}
var numberText = {
	hundred : "Hundra",
	thousand : "K",
	tenthousand : "10K",
	hundredthousand : "100K"
}

var textformat = {
		numberShorten : function(value){
			var length = value.toString().length;
			if(value < 100){
				return [1,numberText.hundred];
			}else if(value < 1000){
				return [100,numberText.hundred];
			}else if (value < 10000){
				return [1000,numberText.thousand];
			}else if (value < 100000){
				return [10000,numberText.tenthousand];
			}else if (value < 100000){
				return [100000,numberText.hundredthousand];
			}
		}
		
}

String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return this.length>n ? this.substr(0,n-1)+'...' : this.toString();
      };