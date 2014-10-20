!function(){
	var maggio = {
		version : "1.0"
	};
	var flashpoll = {};
	// maggio.datafunc = {}
	var pollchart = {
		/*
* Object holding the c3 chart 
*/
colorscheme : ["#FF6F00","#6FFF00","#006FFF"],
chart : [],
chartID : "charty",
nrOfCharts : 0,
varibles : {
	container : null
}
};
var tables  ={
	//[con,cat]
	questions : [
	[null,[1,1],[1,2]],
	[[1,0],[1,1],[1,2]],
	[[2,0],[2,1],[2,2]],
	],
	charts    :[
	[[histogram],[pie,bar],[stackedBar,heatmap,lineCat,bar]],
	[[histogram,scatter,line,regressionline],[lineCat,stackedArea],[bubble]]
	]
	,


};
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

var colors = ['#FF0000','#00FF00','#0000FF','#F007F0','#012310','#01930F0'];

var size;

/**
* Varible holding labels for linearregssionfunc
*/
var label = new Array();
/*function chartify(url, container){
	container = container;
	d3.json(url, function(error, json) {
		if (error) return console.warn(error);
		data = json;
		chartChooser(json);
	});
}*/
/**
* ############################ DATA IMPORT ##############################################
*
**/

var ashton = {

	dataTypes : {"pick_n":"nominal", "slider" : "ratio"},
	initOne : function(data,question,nr){
		if(question.length==1){
			var matrix = ashton.getSingeMatrix(data,question[0]);
			if(matrix[1][0]!=null){
				addInfo(data.name,data.question_list[question[0]].body);
				chartFunctions[nr](matrix);
			}
		}else{
			var matrix=ashton.getDoubleMatrix(data,question);
				addInfo("matrix[0][0],data.question_list[question[0]].body "+ "<br>"+ "data.question_list[question[1]].body");
				chartFunctions[nr](matrix);
		}
	},
	init : function(data,question){
		console.log(tables.charts[0][1][0]);
	//functions + questions
	var visualizationTypes = ashton.calculateVisualizations(question,data);
	for (var i = 0; i < visualizationTypes.length; i++) {
		if(visualizationTypes[i].ids.length==1){
			var matrix = ashton.getSingeMatrix(data,visualizationTypes[i].ids[0]);
			if(matrix[1][0]!=null){
					for (var u = 0; u < visualizationTypes[i].types.length; u++) {
				addInfo(data.name,data.question_list[visualizationTypes[i].ids[0]].body);
				visualizationTypes[i].types[u](matrix);
			};
			}
		}
		else{
			for (var u = 0; u < visualizationTypes[i].types.length; u++) {
					var matrix=ashton.getDoubleMatrix(data,visualizationTypes[i].ids);
				addInfo(matrix[0][0],data.question_list[visualizationTypes[i].ids[0]].body + "<br>"+ data.question_list[visualizationTypes[i].ids[1]].body);
				console.log(matrix);
				visualizationTypes[i].types[u](matrix);
			};
		}

	}
},

calculateVisualizations : function(q,data){
	var array = data.question_list;
	var combinations =[];
	for (var i = 0; i < q.length; i++) {
		combinations.push(
		{
			ids:[q[i]],
			types: ashton.getListOfCharts([array[q[i]].type.name]),
		});


		for (var j = i+1; j < q.length; j++) {
			combinations.push(
			{
				ids:[q[i],q[j]],
				types: ashton.getListOfCharts([array[q[i]].type.name,array[q[j]].type.name]),

			});
		}
	}


// console.log(combinations);
return combinations;
},
getSingeMatrix : function(data,visualizationTypes){
	var index = visualizationTypes;
	var matrix = [];
	if(data.question_list[index].type.response_list.length==0){
		return;
	}
	data.question_list[index].type.response_list.forEach(function(d){
		if(d.answers!=null){
					matrix.push([d.body,d.answers.length]);
		}

	});
	matrix.unshift(["title","frequency"]);
	return matrix;
},
getDoubleMatrix : function(data,visualizationTypes){
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
									console.log(matrix);
									first = false;
								}
								if(l.answers != null){
								//for each user	
								l.answers.forEach(function(p){
									if(c.user == p.user){
										matrix[ac][pc]++;
									}
								});	
								}
								pc++;
							});
								break;
							}

						};

						
					});	
						ac++;
					});
					break;
				}
				
			};
			matrix = ashton.addSideNames(matrix,names);
			h.unshift(data.name);
			matrix.unshift(h);
			return matrix;
		},
		addSideNames : function(matrix,names){
			for (var i = 0; i < matrix.length; i++) {
				matrix[i].unshift(names[i]);
			};
			return matrix;
		},
		getQuestionList : function(data){
			data.question_list.forEach(function(d){

			});
		},
		getListOfCharts : function(q){
			var val;
			var categorical = 0;
			var continuous = 0;
			for (var i = 0; i < q.length; i++) {
				val = ashton.dataTypes[q[i]];
				if(val == "nominal" ){
					categorical++
				}else if(val=="ratio"){
					continuous++;
				}
			};
			console.log(q);
			return getvistypes(categorical,continuous);
		}
	}
	maggio.visualizeSet = function(url,cnt,question){
		d3.json(url, function(data) {
			container = cnt;
			ashton.init(data,question);

		});
	}
	maggio.visualizeSpecific = function(url,cnt,question,nr){
			d3.json(url, function(data) {
			container = cnt;
			ashton.initOne(data,question,nr);

		});
	}

/**
*Get data from url and visualize it with chosen graph
*param{String} url - url of csv file
*param{int} chart - which chart to use
*param{int} cnt - id of the div container to the chart
*/
maggio.chart = function(url,nr,cnt){
	container=cnt;
		// getCSV(json.path,chartFunctions[json.type]);
		if(nr == 5)
			getText(url,chartFunctions[nr]);
		else
			getCSV(url,chartFunctions[nr]);
	};
	function getText(url,callback){
		d3.text(url, function(text) {

			var data = d3.csv.parseRows(text).map(function(row) {
				return row.map(function(value,index) {
					if(index==0){
						return value;
					}else{
						return +value;
					}
				});
			});
			callback(data);
		});
		return data;
	};
		/**
*Get data from url and visualize it with chosen graph
*param{String} url - url of csv file
*param{function} callback - which chartfunction to use
*/
function getCSV(url, callback){
	d3.csv(url, function(data) {
		console.log(data);
		matrix = [];
		var row = 0;
		data.forEach( function(d){

			if(row == 0){
				for (var key in d) {
					header.push(key);
				}
			}

			var m = [];
			for(var i = 0; i< Object.keys(d).length;i++){
				if(i>0){
					m.push(parseInt(d[header[i]]));
				}

				else{

					m.push(d[header[i]]);
				}

			}
			matrix.push(m);
			row = row + 1;
		});
		// chiSquareTest();
		addInfo();
		// normalize();
		callback(matrix);
		
		
	});
}

function selectChart(categorical, continuous){
	var pos = table.questions[categorical,continuous];
	return table.charts[pos[0],pos[1]];
}

maggio.flashpollParser = function(url,chart,cnt,question){
	container=cnt;	
	var username = "fp_user";
	var password = "62f1b45156af483d52f5f99c9b764007092193f9";

	var typeArray=[];
	d3.json(url+"/result").header("Authorization", "Basic " + btoa(username + ":" + password))
	.get(function(error,data) {
		data.pollResQuestions.forEach( function(d){
			typeArray.push({id:d.questionType,nr:d.questionOrderId});
			if(d.questionOrderId == question){
				var answers = d;
				d3.json(url).header("Authorization", "Basic " + btoa(username + ":" + password))
				.get(function(error,data) {
					data.questions.forEach( function(d){
						d
						if(d.orderId == question){
							var meta = d;
							mergeQ(answers,meta);
						}

					});

				});
			}

		});
		// getVis(typeArray);
	});
}
function getFreqencyData(callback){
	d3.json(url+"result.json", function(data) {
		data.pollResQuestions.forEach( function(d){

		});
	});
}
maggio.flashpollVis = function(url,chart,cnt,question){
	container=cnt;	
	var username = "fp_user";
	var password = "62f1b45156af483d52f5f99c9b764007092193f9";
	var typeArray=[];
	var count=0;
	d3.json(url).header("Authorization", "Basic " + btoa(username + ":" + password))
	.get(function(error,data) {
		data.questions.forEach( function(d){
			//Add if question is in the questionarray or array is empty/vis all questions
			if($.inArray(d.orderId, question)!= -1 || question.length < 1){
				typeArray.push({id : d.questionType, nr : d.orderId});
			}
			var ans = [];
			d.answers.forEach(function(s){
				ans.push({id:s.answerText,orderId: s.orderId});
			});
			typeArray[count]["qTypes"] = ans;
			count++;
		});
		var combinations = flashpoll.getVis(typeArray);
		plotallTypes(combinations);
	});
}
maggio.localparser = function(url,chart,cnt,question){
	container=cnt;	
	var typeArray=[];
	var count=0;
	var typeArray = [];
	d3.json(url+"result.json", function(data) {
		data.pollResQuestions.forEach( function(d){
			typeArray.push({id:d.questionType,nr:d.questionOrderId});
			if(d.questionOrderId == question){
				var answers = d;
				d3.json(url+".json")
				.get(function(error,data) {
					data.questions.forEach( function(d){
						d
						if(d.orderId == question){
							var meta = d;
							mergeQ(answers,meta);
						}

					});

				});
			}

		});
	});
}

maggio.localparser2 = function(url,chart,cnt,question){
	container=cnt;	
	var typeArray=[];
	var count=0;
	d3.json(url+".json", function(data) {
		data.questions.forEach( function(d){
			typeArray.push({id : d.questionType, nr : d.orderId, nrOfQ : d.answers.length, q : d.answers, questionText: d.questionText});
			var ans = [];
			d.answers.forEach(function(s){
				ans.push({id:s.answerText,orderId: s.orderId});
			});
			typeArray[count]["qTypes"] = ans;
			count++;
		});
		var combinations = flashpoll.getVis(typeArray,question);
		flashpoll.getFlashpollData(url,plotallTypes,combinations, typeArray);
	});
}
flashpoll.getFlashpollData = function(url,callback,comb,typeArray){

	d3.json(url+"results.json", function(data) {
		d3.json(url+"result.json", function(data2) {

			callback(data,data2,comb,typeArray);
		});

	});
}
/**
* Get all possible visualizations of questions "q"
*/
flashpoll.getVis = function(array,q){
	var combinations =[];
	for (var i = 0; i < array.length; i++) {
		if(array[i].id != "FREETEXT" ){
			combinations.push(
			{
				ids:[array[i].nr],
				types: flashpoll.getChartList([array[i]]),
				questionType : [array[i].id]

			});
		}

		for (var j = i+1; j <= array.length-1; j++) {
			if(array[i].id != "FREETEXT" && array[j].id != "FREETEXT"){
				if($.inArray(array[i].nr,q)  != -1 && $.inArray(array[j].nr,q)  != -1){

					combinations.push(
					{
						ids:[array[i].nr,array[j].nr],
						types: flashpoll.getChartList([array[i],array[j]]),
						questionType : [array[i].id,array[j].id]

					});
				}
			};
			
			
		};
	};
	return combinations;
}
/**
* Check datatype
*/
flashpoll.getQuestionType = function (q){
	if(q.id=="FREETEXT"){
		return null;
	}else if(q.id == ("RADIO" || "CHECKBOX" || "ORDER")){
		return 1
	}else{
		0
	}
}
/**
* Returns all types of charts a combination of questions can generate
*/
flashpoll.getChartList = function(qArray){
	var cat = 0;
	var con = 0;
	for (var i = 0; i < qArray.length; i++) {
		if(qArray[i].id != "FREETEXT" ){
			cat++;
		}else{
			return null;
		}			
	};
	return getvistypes(cat,con);
}

function getvistypes(cat,con){
	console.log(cat +"  " + con);
	var r = tables.questions[con][cat];
	return getvistable(r[0],r[1]);
}
function getvistable(con,cat){
	return tables.charts[con-1][cat];
}
/**
* Visualizes the questions
*/
function plotallTypes(data,data2,list,array){
	for (var j = 0; j < list.length; j++) {
		if(list[j].ids.length>1){
			var matrix = getFlashpollmatrix(data,list[j],array);
			console.log(matrix);
			for (var i = 0; i < list[j].types.length; i++) {
				addInfo("Combined","y-axis: " + getQuestionText(list[j].ids[0],array)+"/ x-axis:  "+ getQuestionText(list[j].ids[1],array));
				list[j].types[i](matrix);
			};
		}else{
			data2.pollResQuestions.forEach( function(d){
				if(d.questionOrderId == list[j].ids[0]){
					var answers = d;
					var  matrix = buildDataMatrix(answers);
					// header = addTopHeadToMatrix(getNames(list[j].ids[0],array));
					matrix = addToSideHeadMatrix(getNames(list[j].ids[0],array),matrix);

					matrix.unshift(["X","frequency"]);
					for (var i = 0; i < list[j].types.length; i++) {	
						console.log(matrix);
						addInfo(getQuestionText(list[j].ids[0],array));
						list[j].types[i](matrix);
					}
				}	
			});
		}
	};
}
/**
* Returns the questionText of i question
*/
function getQuestionText(id,array){
	for (var i = array.length - 1; i >= 0; i--) {
		if(id == array[i].nr){
			return array[i].questionText;
		}
	};
}
/**
* Takes the id and returns the question nr
*/
function getNr(id,array){
	for (var i = array.length - 1; i >= 0; i--) {
		if(id == array[i].nr){
			return array[i].nrOfQ;
		}
	};
}

function getNames(id,array){
	for (var i = array.length - 1; i >= 0; i--) {
		if(id == array[i].nr){
			return array[i].q;
		}
	};
}
/**
* Creates the matrix and visualizes it from 2 questions
*/
function getFlashpollmatrix(data,comb,array){
	var ids = comb;
	var matrix = buildEmptyMatrix(getNr(ids.ids[0],array),getNr(ids.ids[1],array));
	// For each user
	data.forEach(function(d){
		
		if(ids.questionType[0] != "ORDER" && ids.questionType[1] !="ORDER"){
			console.log("EJ ORDER");
			matrix = twoNominal(d,matrix,ids);
		}
		/*else if(ids.questionType[0] == "ORDER" && ids.questionType[1] == "ORDER"){

		}*/
		else if(ids.questionType[0] == "ORDER"){
			matrix = ordinalMatrix(d,matrix,ids.ids[0],ids.ids[1]);
		}
		else if(ids.questionType[1] == "ORDER"){
			matrix = ordinalMatrix(d,matrix,ids.ids[1],ids.ids[0]);
		}
		
		
		

	});
	header = addTopHeadToMatrix(getNames(ids.ids[1],array));
	// matrix.unshift(addTopHeadToMatrix(getNames(ids.ids[1],array)));
	matrix = addToSideHeadMatrix(getNames(ids.ids[0],array),matrix);
	matrix.unshift(header);
	return matrix;
}
function ordinalMatrix(d,matrix,id1,id2){
	var row = 0;
	var col = 0;
	var score = []
		//for each question the user as answered
		d.pollResQuestions.forEach(function(c){
			if(id1 == c.questionOrderId){

					//For each answer
					for (var i = 0; i < c.pollResultAnswers.length; i++) {
						// if(c.pollResultAnswers[i].answerScore > score){
							// row = i;
							score.push(c.pollResultAnswers[i].answerScore )
						// }
					};
					// c.pollResultAnswers.forEach(function(s){
					// 	if(s.score > 0){
					// 		row = s.answerOrderid;
					// 	}
					// });
	}
	else if(id2 == c.questionOrderId){
		for (var i = 0; i < c.pollResultAnswers.length; i++) {
			if(c.pollResultAnswers[i].answerScore > 0){
				col = i;
			}
		};
						//For each answer
						// c.pollResultAnswers.forEach(function(s){
						// 	if(s.score > 0){
						// 		col = s.answerOrderid;
						// 	}
						// });
	}
});
		for (var i = 0; i < score.length; i++) {
			matrix[i][col] += score[i];
		};
		

		return matrix;
	}
	function twoNominal(d,matrix,ids){
		var row = 0;
		var col = 0;
		//for each question the user as answered
		d.pollResQuestions.forEach(function(c){
			if(ids.ids[0] == c.questionOrderId){

					//For each answer
					for (var i = 0; i < c.pollResultAnswers.length; i++) {
						if(c.pollResultAnswers[i].answerScore > 0){
							row = i;
						}
					};
					// c.pollResultAnswers.forEach(function(s){
					// 	if(s.score > 0){
					// 		row = s.answerOrderid;
					// 	}
					// });
	}
	else if(ids.ids[1] == c.questionOrderId){
		for (var i = 0; i < c.pollResultAnswers.length; i++) {
			if(c.pollResultAnswers[i].answerScore > 0){
				col = i;
			}
		};
						//For each answer
						// c.pollResultAnswers.forEach(function(s){
						// 	if(s.score > 0){
						// 		col = s.answerOrderid;
						// 	}
						// });
	}
});
		matrix[row][col]++;

		return matrix;
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
/**
*############################################ CHART FUNCTIONS ##################################################
*/
/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/
function bar(matrix){
	var m = matrix;
	// matrix.unshift(header);
	var rot = matrix.length > 8; rotated : false ? rotated : true;
	var c = 0;
	console.log(m);
	// var index = addChart();
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			x : m[0][0],
			columns : m,
			type: 'bar'
		},
		axis: {
			rotated : rot,
			x: {
				// height : 85,
				type: 'categorized',
				tick: {
					// rotate: 40
				},
			},
			// y :{
			// 	max : 10
			// },
			width: {
				ratio: 100
			},
		}
	});
}
function histogram(matrix){
	// console.log(matrix);
	// var dd = getAverage(matrix);
	// dd.unshift(header);
	// console.log(matrix);
	pollchart.chart = c3.generate({
		bindto: container,
		data: {
			x : dd[0][0],
			columns : dd,
			type: 'bar',
		},
		axis: {
			x: {
				type: 'categorized'
			}
		}
	});
}

/**
* Plots a line chart
*param{Array} matrix - array holding the table
*/
function lineCat(matrix){
	// matrix.unshift(header);
	chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			x : matrix[0][0],
			columns : matrix,
			type: 'line',

		},
		axis: {
			x: {
				height : 100,
				type: 'categorized',
				tick : {
					rotate : 70
				}
			}
		}
	});

}

	/**
* Plots a line chart
*param{Array} matrix - array holding the table
*/
function line(matrix){
	// matrix.unshift(header);
	console.log(matrix);
	var t = new Object();
	t[matrix[1][0]] = matrix[0][0];
	console.log(matrix);
	chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			xs :t,
			columns : matrix,
			type: 'line'
		},

		axis: {
			x: {
				// type: 'categorized',
				label : matrix[0][0],
				height : 100,
				tick: {
					fit: false,
					culling: {
                    max: 6 // the number of tick texts will be adjusted to less than this value
                }
            }
        },
        y:{
        	label: matrix[1][0]
        }
    },
    point : {
    	show: false
    },
});

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
function scatter(matrix){
	var t = new Object();
	var title = new Object();
	t[matrix[1][0]]=matrix[0][0];
	title["label"] = matrix[1][0];
	console.log(title);
	chart = c3.generate({
		bindto: container,
		data: {
			xs: t,
			columns : matrix,
			type: 'scatter'

		},
		axis: {
			x: {
				label: matrix[0][0],
				tick: {
					fit: false
				}
			},
			y: {
				label: matrix[1][0],
			}
		},
		legend: {
			show: false
		},
		tooltip: {
			show : false
		}
		
	});
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
function regressionline(matrix){
	var t = new Object();
	var title = new Object();
	var toggle = 0;
	t[matrix[1][0]]=matrix[0][0];
	var y = matrix[1][0];
	var x = matrix[0][0];
	title["label"] = matrix[1][0];
	console.log(matrix);

	chart = c3.generate({
		bindto: container,
		data: {
			xs: t,
			columns : matrix,
			type: 'scatter',
			onclick: function (d, i) { 
				
				var id = d.x;
				if(toggle==0){
					var data2 = matrixToPoints(matrix);
					setChartText(y + " increses " + increase + " for each " +  x);
					chart.load({
						columns: 

						data2[1]

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
		axis: {
			x: {
				label: matrix[0][0],
				tick : {
					fit : false,
					// count : 8,
					format: function (x) { return Math.floor(x); }
				}
			},
			y: {
				label: matrix[1][0],
			}
		},
		legend: {
			show: false
		},
		tooltip: {
			show : false
		}
		
	});


	
}


/**
* Takes an array of values, and plots the distribution
*param{Array} array - array with numeric values
* Data convention:
* [name,value1, value2, ... ,value-n]
*/
function normalLine(array){
	console.log(array);
	var buckets = disk(array);
	var chart = c3.generate({
		bindto: container,
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
				type: 'category',
				categories : buckets[0],
				tick: {
					rotate: 75
				},
				height: 100
			}
		}
	});
}

/**
* Plots composition in a piechart
*param{Array} array - array with numeric values in percent
*
* Data convention:
* [name,value1, value2, ... ,value-n]
*/

function pie(matrix){
	var m = matrix.slice(1,matrix.length);
	console.log(matrix);
	// m.shift();
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			columns: m,
			type : 'pie',
		}
	});
}
/**
* Plots a regression line of the relation av two datasets
*param{Array} array - array with numeric values in percent
* Data convention
* [[x, x1, x2,..,xn],[y,y1,y2,...,yn]]
*/
function regLine(matrix){
	
	var data = matrixToPoints(matrix);
	chart = c3.generate({
		
		bindto: container,
		data: {
			  // x : label[1],
			  columns: [data[1][1]]
			}
			,
			axis: {
				x: {
					label: data[0][0][0],
					tick : {
						count : 8,
						format: function (x) { return Math.floor(x); }
					}
				},
				y: {
					label: data[0][1][0],
				}
			},
			legend: {
				show: false
			},
		});
}

/**
* Plots stacked area chart
*/
function stackedArea(matrix){
	var obj = new Object();
	obj[matrix[0][0]] = '#ff0000';
	console.log(matrix);


	matrix.shift();
	chart = c3.generate({
		bindto: container,
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
	label : header[0],
}
},

});
}


/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/
function stackedBar(matrix){
	console.log(matrix);
	var toggle = 1;
	var rot = matrix.length > 10; rotated : false ? rotated : true;
	var names = columnNames(matrix);
	names = names.slice(1,names.length);
	// matrix.unshift(header);

	chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			x : matrix[0][0],
			columns : matrix,
			onclick: function (d, i) { 
				var id = d.x;
				console.log("click");
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

			groups :  [names],
		},
		axis: {
			rotated : rot,
			x: {
				height : 120,
				type: 'categorized',
				tick: {
					rotate: 75
				},
			},
			y : {
				// label: matrix[0][0]
			}
		},

	});
}

function bubble(matrix){
	console.log(matrix);
	var t = new Object();
	var title = new Object();
	t[matrix[1][0]]=matrix[0][0];
	title["label"] = matrix[1][0];
	console.log(t);
	var bubbles = matrix.pop();
	chart = c3.generate({
		bindto: container,
		data: {
			xs: t,
			columns : matrix,
			type: 'scatter',
			label: function(){return "Radie" },
			color: function (color, d) {
            // d will be 'id' when called for legends
            return d3.rgb(255-bubbles[d.index +1],0,0);
        }
    },
    axis: {
    	x: {
    		label: matrix[0][0],
    		tick: {
    			fit: false
    		}
    	},
    	y: {
    		label: matrix[1][0],
    	}
    },
    legend: {
    	show: false
    },
    tooltip: {
    	format: {
    		title: function (d) { return 'Radie'; },
    		name:  function () { return bubbles[0] },
    		value: function (value, ratio, id,d) {

    			return bubbles[getIndex(matrix[1],value) ];
    		}
    	},
    	contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
    		console.log(d);
    		var $$ = this, config = $$.config,
    		titleFormat = config.tooltip_format_title || defaultTitleFormat,
    		nameFormat = config.tooltip_format_name || function (name) { return name; },
    		valueFormat = config.tooltip_format_value || defaultValueFormat,
    		text, i, title, value, name, bgcolor;
    		for (i = 0; i < d.length; i++) {
    			if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

    			if (! text) {
    				title = titleFormat ? titleFormat(d[i].x) : d[i].x;
    				text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
    			}

    			name = nameFormat(d[i].name);
    			value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
              // bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
              bgcolor = "#ff0000";
              text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
              text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
              text += "<td class='value'>" + value + "</td>";
              text += "</tr>";
          }
          return text + "</table>";
      },
  },
  point: {
  	r: function(d){return 100/bubbles[d.index + 1]}
  }

});
}

function slideBar(matrix){
	createSlider();
	// matrix.unshift(header);
	chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			x : header[0],
			rows : [header,matrix[0]],
			type: 'bar',

		},
		axis: {
			x: {
				type: 'categorized'
			}
		}
	});

}
function slidePie(matrix){
	createSlider();
	// matrix.unshift(header);
	chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			x : header[0],
			rows : [header,matrix[0]],
			type: 'pie',

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
	console.log(matrix);

}

/*function heatmap(){
	var dd = normalize();
	var c = 0, u=0;
	var tet = [2,4];
	// var names = columnNames(matrix);
	dd.unshift(header);
	console.log(dd);
	chart = c3.generate({
		bindto: container,
		data: {
			columns : [
			[matrix[0][0],2,2],
			[matrix[1][0],4,4],
			[matrix[2][0],6,6]],
			type: 'scatter',

// 			  labels: {
//            format: {
//            	y: function (v, id) { console.log(v); console.log(id); return "Default Format on ";} },
//             // format: {
//                 // y: d3.format('$'),
// //                y: function (v, id) { return "Y Format on " + id; },
// //                y2: function (v, id) { return "Y2 Format on " + id; }

//         }

			// groups :  [names]
		},
		axis: {
			x: {
				type: 'category',
		// categories: [header[1],header[2]],
		categories: function(d){

			return [header[1],header[2]];
		},
	},
	y: {
		
		show : false,
				// categories: [matrix[0][0],matrix[1][0],matrix[2][0]]
			}
		},
		point: {
			r: function(d){ return dd[d.value/2][d.x +1] * 0.5},
			focus: { 
				expand: {
					enabled: false } } ,
				},
				tooltip: {
					format: {
						title: function (d) { return 'Radie'; },
						name:  function (d) { return d; },
						value: function (value, ratio, id) {
    			// console.log(ratio);
    			return dd[value/2][0];
    		}
    	},
    	contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
    		console.log(d);
    		var $$ = this, config = $$.config,
    		titleFormat = config.tooltip_format_title || defaultTitleFormat,
    		nameFormat = config.tooltip_format_name || function (name) { return name; },
    		valueFormat = config.tooltip_format_value || defaultValueFormat,
    		text, i, title, value, name, bgcolor;
    		for (i = 0; i < d.length; i++) {
    			if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

    			if (! text) {
    				title = titleFormat ? titleFormat(d[i].x) : d[i].x;
    				text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
    			}

    			name = nameFormat(d[i].name);
    			value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
    			bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
              // bgcolor = "#ff0000";
              text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
              text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
              text += "<td class='value'>" + value + "</td>";
              text += "</tr>";
          }
          return text + "</table>";
      },
  },

});*/
// }
function heatmap(matrix){
	console.log(matrix);
	var head =  matrix[0].slice(1,matrix[0].length);
	matrix.shift();
	var array = matrixToRevArray(matrix);
	console.log(head);
	var w = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	console.log(array);
	console.log(matrix);
	var margin = { top: 100, right: 0, bottom: 20, left: 75 },
	width =  w- margin.left - margin.right,
	height = 400 - margin.top - margin.bottom,
	gridSize = Math.floor(width / 10),
	legendWidth = (gridSize/2 + 4),
	dim_1 = columnNames(matrix),
	dim_2 = head,
	rowlength = dim_1.length;
	columnlength = dim_2.length;
          //antal färger
          buckets = 8;
          var svg = d3.select("#"+pollchart.chart[pollchart.nrOfCharts-1]).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var maxNum = Math.round(d3.max(array,function(d){ return d; }));

          var colors = colorbrewer.RdYlGn[buckets];

          var colorScale = d3.scale.quantile()
          .domain([0, buckets - 1, maxNum])
          .range(colors);

          //Header
          var dim1Labels = svg.selectAll(".dim1Label")
          .data(dim_1)
          .enter().append("text")
          .text(function (d) { ;return d; })
          .attr("x", 20)
          .attr("y", function (d, i) { return i * gridSize; })
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
          .attr("class","mono");

     //Header
     var dim2Labels = svg.selectAll(".dim2Label")
     .data(dim_2)

     .enter().append("text")

                // .text(function(d) { return d; })
                // .attr("x", function(d, i) { return (i * gridSize) + 20; })

                // .attr("y", 0)
                // .style("text-anchor", "middle")
                // .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                // .attr("class","mono")
                // .attr("dy", ".71em")
                .text(function(d) {return d})
				.attr("transform", function(d,i) {    // transform all the text elements
  return "translate(" + // First translate
  ((i * gridSize)+30)  + ",-10) " + // Translation params same as your existing x & y 
    "rotate(-45)"            // THEN rotate them to give a nice slope
});
          //heatmap
          var count=0,count2=0;
          var heatMap = svg.selectAll(".dim2")
          .data(array)
          .enter().append("rect")
          .attr("x", function(d) { count++; return ((count%columnlength - 1) * gridSize) +50; })
          .attr("y", function(d) { count2++; return ( Math.ceil(count2/(columnlength))-1) * gridSize; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("class", "dim2 bordered")
          .attr("width", gridSize-2)
          .attr("height", gridSize-2)
          .style("fill", colors[0])
          .attr("class", "square")
          heatMap.transition()
          .style("fill", function(d) {return colorScale(d); });
          heatMap.append("title").text(function(d) {return d; });

          var ledc=0;
          var legend = svg.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), function(d) {return d; })
          .enter().append("g")
          .attr("class", "legend");

          legend.append("rect")
          .attr("x", function(d, i) { return  (i%4 * legendWidth*2 + 20 ) ; })
          .attr("y", function(d, i) {k=0; if(i>3){k=1} return (k+rowlength) * (gridSize+1) + 15; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", gridSize)
          .attr("height", gridSize)
          .style("fill", function(d, i) { return colors[i]; })
          .attr("class", "square");
          
          legend.append("text")
          .attr("class", "mono")
          .text(function(d) { return  Math.round(d)+"+"; })
          .attr("x", function(d, i) { return  (i%4 * legendWidth*2 + 25 ) ; })
          .attr("y", function(d, i) {k=0; if(i>3){k=1} return (k+rowlength) * (gridSize+1) + 30; })
          .style("font-size", "13px")
          .style("font-family", "Times New Roman")
          .style("font-weight","bold")
       /*     .attr("x", function(d, i) { return gridSize * 11 + 25; })
            .attr("y", function(d, i) { return (i * legendWidth + 20); })
            */
            var title = svg.append("text")
            .attr("class", "mono")
            .attr("x", -40)
            .attr("y", rowlength * (gridSize+1) + 35)         
            .style("font-size", "16px")
            .text("Legend")
        }
/**
* ##################################### MATRIX FUNCTINOS ###############################################
*/ 

function matrixToRevArray(matrix){
	var ret = [];
	for (var i = 0; i < matrix.length; i++) {
		for (var j = matrix[i].length-1; j > 0; j--) {
			ret.push(matrix[i][j]);
		};
	};
	return ret;
}
	/**
* Makes histogram of data **
*param{Array} matrix - array holding the table
*/
function disk(data){
	var header = [];
	var bucketsize =5;
	console.log(data);
	var head = data[0].splice(0,1);
	var buckets = new Array(bucketsize);
	var min = Math.min.apply(Math, data[0]),
	max = Math.max.apply(Math, data[0]);
	var diff = max - min;
	var step = diff/bucketsize;
	for(var i = 0; i <= bucketsize; i++){
		buckets[i]=0;
		var minm =  (step*i).toString();
		var maxm =  (step*(i+1)).toString();
		header[i] = minm.substring(0,4) + "-" +maxm.substring(0,4);
		for(var j = 0; j < data[0].length; j++){
			if(step*i<data[0][j] && step*(i+1) > data[0][j]){
				buckets[i]++;
			}
		}
	}
	buckets.unshift(head[0])
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
	console.log(matrix);
	var data= new Array();
	var max = 0;
	for(var j = 0; j<2; j++){
		for(var i = 0; i<matrix[0].length; i++){
			if(j==0){
				data[i]=new Array();
			}
			data[i].push(matrix[j][i]);
			// console.log(matrix[j][i]);
			
		}
		if(max < ss.max(matrix[0])){
			max = ss.max(matrix[0]);
		}
	}
	console.log(data);
	return [label,linearRegression(data, max)];
}
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
	console.log(mat);
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
	// console.log(matrix);
	for(var i = 0; i<matrix.length; i++){
		for(var j = 1; j<matrix[i].length; j++){
			if(i != 0){

				matrix[i][j] += matrix[i-1][j];
			}
		}
	}
	return matrix;
}

function normalizeMatrix(matrix){
	var sum = getSumMatrix(matrix);
	for(var i = 0; i<matrix.length; i++){
		for(var j= 0; j<matrix[i].length; j++){
			matrix[i][j] = (matrix[i][j]/sum).toFixed(2);
		}
	}
	console.log(matrix);
	return matrix;
}
/**
* Adds a chart to the array of charts and returns the position of the chart
*/
function addChart(chart){
	matrixArray.push(chart);
	return matrixArray.length-1;
}

/**
* ################################ DATA FUNCTIONS ##################################################################
*/
/**
* Returns the position of the value in the array
*param{Array} array - array to be searched
*param{var} value - value of the object whoms position is searched
*/
function getIndex(array, value){
	// console.log(array);
	for(var i = 1; i < array.length; i++){
		// console.log(value + " ||  " + array[i]);
		if(value == array[i]){
			
			return i;
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
function getSumArray(array){
	var sum = 0 ;
	for(var j= 0; j<array.length; j++){
		sum += array[j];
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

/**
*
*/ 
function mergeQ(answers,meta){
	var returnvalue = addMetaToMatrix(buildDataMatrix(answers),meta);
	console.log(returnvalue);
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
	console.log(linear_regression_line(1));
	console.log(linear_regression_line(max));
	console.log(max);
	increase = (linear_regression_line(1) -linear_regression_line(0)).toFixed(1);
	var d = new Array();
	var h = new Array();
	h.push(label[0][0]);
	d.push(label[1][0]);
	for(var i = 0; i<=max; i++){
		d.push(linear_regression_line(i));
		h.push(i);
	}
	console.log(label[1][0]);
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

function chiSquareTest(){
	var sValue = 0.05;
	var test = addTotal();
	console.log(test);
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
	// console.log("chiSquare" + chiSquare);
		// console.log("df " + df);
		pvalue = ChiSq(chiSquare,df);
	// console.log("P-value : " + pvalue);
	// console.log(chimatrix);
	// return [chimatrix,chiSquare,pvalue];
	return pvalue > sValue ? true : false;
}

function calcExp(rowtot, coltot, sampsize){
	return (rowtot*coltot)/sampsize;
}
function calcChiPart(expected,accual){
	// console.log("EXP: " + (accual-expected));
	// console.log("CHI PART: " + Math.pow(accual-expected,2)/expected);
	return (Math.pow(accual-expected,2))/expected;
}
function addTotal(){
	var m = [];
	m.unshift(header);
	console.log(header);
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
	console.log(m);
	return m;
}

/**
* ################################ HTML ADD ONS ##################################################################
*/

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
function addInfo(title,info){
	pollchart.nrOfCharts++;
	pollchart.chart.push(pollchart.chartID+pollchart.nrOfCharts);
	var info = "<div><h2>"+title+"</h2><p id='maggioInfo'>"+info+"</p></div>";
	$(container).append(info);
	if(container == "#char"){
		$(container).append("<div id='charty' style='height : 600px'></div>");
	}else{
		$(container).append("<div id='"+pollchart.chart[pollchart.nrOfCharts-1]+"'></div>");

	}
}
function setChartText(text){
	d3.select(container + ' svg').append("text")
	.attr("x", "200")
	.attr("y", "55")
	.attr("dy", "-.7em")
	.style("text-anchor", "middle")
	.attr("stroke","#101010")
	.attr("font-size", "10px")
	.attr("font-family", "sans-serif")
	.attr("fill", "Black")
	.text(text);
}
function removeChartText(){
	console.log("removing...");
	console.log(d3.select("#chart1"));
	d3.select("text").remove();
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
	console.log(value);
	$(label).text("Current plot: " +value);
}
function getMytitle(){
	console.log(set);
	return matrix[set][0];
}
/**
* Normalize a datamatrix without a top header as first row
* First coloumn is text
*/
function normalize(matrix,hop){
	var ratio =0;
	var temp;
	var result = [];
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 1; j < matrix[i].length; j++) {
			temp = matrix[i][j];
			console.log(temp);
			if(temp > ratio){
				ratio = temp;
			}
		};
	};
	ratio = ratio/100;
	
	for (var i = 0; i < matrix.length; i++) {
		result[i] = new Array();
		for (var j = 1; j < matrix[i].length; j++) {
			result[i][j] = Math.round(matrix[i][j]/ratio);
		};
	};
	return result;
}


//add maggio to context
this.maggio = maggio;
}();