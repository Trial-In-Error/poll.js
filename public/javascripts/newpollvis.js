!function(){
	var maggio = {
		version : "1.0"
	};
	var flashpoll = {};

	var pollchart = {

		backgroundColors : ["#F7F2E0","#F7F8E0","#F8E0EC","#FAFAFA","#E6E0F8","#E0F8E6","#F8E0E0"],
// backgroundColors : ["#F7F2E0","#F7F8E0","#31B404","#5FB404","#4B8A08","#298A08","#088A08"],
// backgroundColors : ["#F7F2E0","#F7F8E0","#31B404","#5FB404","#4B8A08","#298A08","#088A08"],
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
	[[/*histogram*/],[pie,bar/*,bar2*/],[stackedBar,heatmap,lineCat,bar/*,bar2*/]],
	[[scatter,line,regressionline],[lineCat,stackedBar,bar/*,bar2*/,pie],[bubble]],
	[[bubble]]
	]
	,
	charts2    :[
	[[/*histogram*/],[pie,bar/*,bar2*/],[stackedBar,heatmap2,lineCat,bar/*,bar2*/]],
	[[scatter,line,regressionline],[lineCat,stackedBar,bar/*,bar2*/,pie],[bubble]],
	[[bubble]]
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
/*
* Holds colorscheme for visualizations
*/
var datacolors = {
	colors : [
	['#02A79C','#88CBC4','#1F4557','#8FC043','#D2E090','#5A6C40','#EF921A','#F1DB71','#901F2F'],
	['#8FC043','#D2E090','#5A6C40','#F2F7D8','#EF921A','#F1DB71','#901F2F','#FFF608'],
	['#EF921A','#F1DB71','#901F2F','#FFF608','#D12A09','#6A2383','#9360A4','#5F5858'],
	['#D12A09','#6A2383','#9360A4','#5F5858','#02A79C','#88CBC4','#1F4557','#8FC043'],
	['#02A79C','#D12A09'],
	['#8FC043','#02A79C','#88CBC4','#1F4557']
	],
	tileBackground :  '#FFF6c8',
	curretGroup : 0,
	count : 0,
	getColor : function(group,names,isRow){
	
		// var c = pollchart.options.colorscheme;
		index = 0;
		datacolors.index = (datacolors.index + 1) % (datacolors.colors[0].length);

		if($.inArray(group,names) != -1){
			return datacolors.colors[pollchart.options.colorscheme][getIndex2(names,group)];
			// return "#FFFFFF";
		}else {
			// if(index==2){
			// 	datacolors.count++;
			// 	if(datacolors.count.length == count){
			// 		datacolors.count=0;
			// 	}
			// }
			if(group.id == "frequency" || group.id == "mean" || isRow){
				if(datacolors.colors[pollchart.options.colorscheme][group.index] == null){
						return datacolors.colors[pollchart.options.colorscheme][getIndex2(names,group.id)];
				}
						return datacolors.colors[pollchart.options.colorscheme][group.index];
						// console.log(datacolors.colors[pollchart.options.colorscheme][group.index]);
						// return "#FF0000";
					}else{
									return datacolors.colors[pollchart.options.colorscheme][getIndex2(names,group.id)];

					}
		}

	}
}
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

/**
* Object holding methods handling data from Opine-r
*/
var opine = {

/**
*Data types for questions
*/
dataTypes : {"pick_n":"nominal", "slider" : "ratio"},

readOptions : function(options){
	for(key in options){
		pollchart.options[key] = options[key];
	}
},
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
		console.log(matrix);
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
init : function(data,question){

	//functions + questions
	var visualizationTypes = opine.calculateVisualizations(question,data,false);
	// createTable();
		// pollchart.nrOfCharts = 0;
		for (var i = 0; i < visualizationTypes.length; i++) {
			if(visualizationTypes[i].ids.length==1){
				var matrix = opine.getSingeMatrix(data,visualizationTypes[i].ids[0]);
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
						pollchart.currentCharts[pollchart.chart[pollchart.nrOfCharts-1]] = {chart : [i,u,], data : data, question : question};
						visualizationTypes[i].types[u](matrix);
					};
				}
			}
			else{
				for (var u = 0; u < visualizationTypes[i].types.length; u++) {
					var matrix=opine.getDoubleMatrix(data,visualizationTypes[i].ids);
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
					pollchart.currentCharts[pollchart.chart[pollchart.nrOfCharts-1]] = {chart : [i,u], data : data, question : question};
					visualizationTypes[i].types[u](matrix);
					// addInfo();					
					// pollchart.currentCharts[pollchart.chart[pollchart.nrOfCharts-1]] = {chart : [i,u,], data : data, question : question};
					// chartDataModel(visualizationTypes[i].types[u],matrix);
				};
			}

		}
		console.log(pollchart.optionChart);
		 new Masonry(container, { "columnWidth": ".tumbchart", "itemSelector": ".tumbchart", "gutter": ".gutter-sizer" })
	},
/**
*Visualize one graph from a dataset
*param{json} data - jsonfile with the polldata
*param{array} question - array containing the positions of the qustions in the poll
*param{int} nr - nr of what chart to use
*/
visualizeOne : function(data,question,nr){
	//functions + questions
	console.log(nr);
	var visualizationTypes = opine.calculateVisualizations(question,data,true);
	console.log(visualizationTypes);
	// createTable();
	pollchart.nrOfCharts = 0;
	if(visualizationTypes[nr[0]].ids.length==1){
		var matrix = opine.getSingeMatrix(data,visualizationTypes[nr[0]].ids[0]);
		if(matrix[1][0]!=null){
				// pollchart.nrOfCharts ++;
				addInfo2(data.name,data.question_list[visualizationTypes[nr[0]].ids[0]].body);
				visualizationTypes[nr[0]].types[nr[1]](matrix);
				
			}
		}
		else{
				// pollchart.nrOfCharts ++;
				var matrix=opine.getDoubleMatrix(data,visualizationTypes[nr[0]].ids);
				addInfo2(matrix[0][0],data.question_list[visualizationTypes[nr[0]].ids[0]].body + "<br>"+ data.question_list[visualizationTypes[nr[0]].ids[1]].body);
				visualizationTypes[nr[0]].types[nr[1]](matrix);			
			}

		},

		/**
*Visualize one graph from a dataset
*param{json} data - jsonfile with the polldata
*param{array} question - array containing the positions of the qustions in the poll
*param{int} nr - nr of what chart to use
*/
visualizeChart : function(data,question,chart){
	var matrix;
	// createTable();
	pollchart.nrOfCharts = 0;
	var dt = "frequency";
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
		chartNames[chart](matrix);
	},
		/**
*Function that finds all possiables visualizations from a
* set of questions
*param{json} data - jsonfile with the polldata
*param{q} q - array containing the positions of the qustions in the poll
*/
calculateVisualizations : function(q,data,single){
	console.log(q);
	console.log(data);
	var array = data.question_list;
	var combinations =[];
	for (var i = 0; i < q.length; i++) {
		combinations.push(
		{
			ids:[q[i]],
			types: opine.getListOfCharts([array[q[i]].type.name],single),
		});


		for (var j = i+1; j < q.length; j++) {
			combinations.push(
			{
				ids:[q[i],q[j]],
				types: opine.getListOfCharts([array[q[i]].type.name,array[q[j]].type.name],single),

			});
			if(array[q[i]].type.name=="slider" && array[q[j]].type.name=="slider"){
				for (var u = j+1; u < q.length; u++) {
					combinations.push(
					{
						ids:[q[i],q[j],q[u]],
						types: opine.getListOfCharts([array[q[i]].type.name,array[q[j]].type.name,array[q[u]].type.name],single),

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
	try{
		var type = data.question_list[index].type.name;	
	} catch(err) {
		console.log("question index: "+index);
		console.log(err);
	}
	
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
		matrix.push(d.value);
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
		console.log(type);
		if(type=="pick_n"){
			cat++;
		}else{
			con++;
		}
	};
	if(cat==2){
		console.log("mixed");
		matrix = opine.getDoubleCategorical(data,ids);
	}else if(con>0 && cat ==0){
		matrix = opine.getContinuous(data,ids);
	}else if(con==1 && cat == 1){
		matrix = opine.getMixedMatrix(data,ids);
	}else if(con==2 && cat == 1){
		matrix = opine.getMixedMatrix(data,ids);
	}
	// console.log(matrix);
	return matrix;
},
/**
*pushes continous data into into a matrix
*param{json} data - jsonfile with the polldata
*param{array} visualizationTypes - array containing the questiontypes to visualize
*/
getContinuous : function(data,visualizationTypes){
	var matrix =[];
	for (var i = 0; i < visualizationTypes.length; i++) {
		matrix.push([data.question_list[visualizationTypes[i]].body]);	
		data.question_list[visualizationTypes[i]].type.response_list[0].answers.forEach(function(d){
			matrix[i].push(d.value);
		});
	};
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
									if(c.user.username == p.user.username){
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
						}else{

						}
						ac++;

					});
break;
}

};
console.log(names);
matrix = opine.addSideNames(matrix,names);
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
	console.log(visualizationTypes);
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
									var currentUser =c.user.username;
								//Loops through each continuous response
								data.question_list[continuous].type.response_list[0].answers.forEach(function(l){
									if(currentUser == l.user.username){
										temp.push(parseInt(l.value));
									}

								});
							});
							}
							matrix[position].push(Math.round(ss.mean(temp)));
							position++;
						});	
					matrix.unshift(["Answer","Mean"]);
					console.log(matrix);
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
				getListOfCharts : function(q,single){
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
				},

			}
							/**
*Implement this function i a html page to visulize all options a set of questions
*have to offer. The function
*param{json} data - jsonfile with the polldata
*param{array} visualizationTypes - array containing the questiontypes to visualize
*/
maggio.visualizeSet = function(url,cnt,question,options){
	d3.json(url, function(data) {
		container = cnt;
		opine.readOptions(options);
		console.log(pollchart.options);
		opine.init(data,question);

	});
}
			/*maggio.visualizeSpecific = function(url,cnt,question,nr){
				d3.json(url, function(data) {
					container = cnt;
					opine.initOne(data,question,nr);

				});
}*/
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
		console.log(pollchart.options);
	console.log(pollchart.options.colorscheme);
		container = cnt;
		opine.visualizeOne(data,question,nr);

	});
}
maggio.visualizeChart = function(url,cnt,question,chart){
	d3.json(url, function(data) {
		container = cnt;
		opine.visualizeChart(data,question,chart);
	});
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
/**
* Visualizes the questions
*/
function plotallTypes(data,data2,list,array){
	for (var j = 0; j < list.length; j++) {
		if(list[j].ids.length>1){
			var matrix = getFlashpollmatrix(data,list[j],array);
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

function chartDataModel (callback, matrix) {
	// callback(matrix);
	var temp = normalizeByRow(matrix);
	callback(temp);
}
/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/
function bar(matrix){
	var m = matrix;
	var r = 0;
	console.log(matrix);
	if(matrix.length>4){r = 70;}
					
	var names = columnNames(matrix);
	var rot = matrix.length > 8; rotated : false ? rotated : true;
	var c = 0;
	console.log("#"+pollchart.chart[pollchart.nrOfCharts-1])
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],

		data: {

			x : m[0][0],
			columns : m,
			type: 'bar',
			color: function (color, d) {
				console.log(d);
				return datacolors.getColor(d,names);
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
    	show : pollchart.options.legend
    },
    axis: {
    	rotated : rot,

    	x: {
    		show : pollchart.options.axis,
    		height : 85,
    		type: 'categorized',
    		tick: {
    			rotate : r
    
				// 	rotate: function(){
				// 		if(matrix.length>3){return 70;}
				// 		else {return 0;}}
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
function histogram(matrix){
	// var d = disk(matrix);
	console.log(matrix);
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			rows : matrix,
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
	var names = columnNames(matrix);
	chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			x : matrix[0][0],
			columns : matrix,
			type: 'line',
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
		axis: {
			x: {
				show : pollchart.options.axis,
				height : 100,
				type: 'categorized',
				tick : {
					rotate : 70
				}
			},
			y :{
				show : pollchart.options.axis,
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
	var t = new Object();
	var names=columnNames(matrix);
	t[matrix[1][0]] = matrix[0][0];
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			xs :t,
			columns : matrix,
			type: 'line',
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
		axis: {
			x: {
				// type: 'categorized',
				show : pollchart.options.axis,
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
        	show : pollchart.options.axis,
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
	var names = columnNames(matrix);
	t[matrix[1][0]]=matrix[0][0];
	title["label"] = matrix[1][0];
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			xs: t,
			columns : matrix,
			type: 'scatter',
			color: function (color, d) {
				console.log(d);
				return datacolors.getColor(d,names);
			}

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
				label: matrix[0][0],
				tick: {
					fit: false
				}
			},
			y: {
				show : pollchart.options.axis,
				label: matrix[1][0],
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
	var names = columnNames(matrix);
	var toggle = 0;
	t[matrix[1][0]]=matrix[0][0];
	var y = matrix[1][0];
	var x = matrix[0][0];
	title["label"] = matrix[1][0];
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			xs: t,
			columns : matrix,
			type: 'scatter',
				color: function (color, d) {
				console.log(d);
				return datacolors.getColor(d,names);
			},
			onclick: function (d, i) { 
				console.log(toggle);
				var id = d.x;
				if(toggle==0){
					var data2 = matrixToPoints(matrix);

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
			show : pollchart.options.tooltip
		},
		legend : {
			show : pollchart.options.legend
		},
		axis: {
			x: {
				show : pollchart.options.axis,
				label: matrix[0][0],
				tick : {
					fit : false,
					// count : 8,
					format: function (x) { return Math.floor(x); }
				}
			},
			y: {
				show : pollchart.options.axis,
				label: matrix[1][0],
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
	// m.shift();
	var names = columnNames(matrix);
	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			columns: m,
			type : 'pie',
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
		pie :{
			label :{
				show : pollchart.options.axis,
			}
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
		
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			  // x : label[1],
			  columns: [data[1][1]]
			}
			,
			axis: {
				x: {
					show : pollchart.options.axis,
					label: data[0][0][0],
					tick : {
						count : 8,
						format: function (x) { return Math.floor(x); }
					}
				},
				y: {
					show : pollchart.options.axis,
					label: data[0][1][0],
				}
			},
			tooltip: {
				show : pollchart.options.tooltip
			},
			legend : {
				show : pollchart.options.legend
			},
		});
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
}


/**
* Plots a column/ barchart depending on size of the array
* Column is array is smaller then 10, else bar chart.
*
*param{Array} matrix - array holding the table
*/
function stackedBar(matrix){
	var toggle = 1;
	var rot = matrix.length > 10; rotated : false ? rotated : true;
	var names2 = columnNames(matrix);
	names = names2.slice(1,names2.length);
	// matrix.unshift(header);

	var chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			x : matrix[0][0],
			columns : matrix,
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
				show : pollchart.options.axis,
				height : 120,
				type: 'categorized',
				tick: {
					rotate: 75
				},
			},
			y : {
				show : pollchart.options.axis,
				// label: matrix[0][0]
			}
		},
		tooltip: {
			show : pollchart.options.tooltip
		},
		legend : {
			show : pollchart.options.legend
		},

	});
}

function bubble(matrix){

	var t = new Object();
	var title = new Object();
	t[matrix[1][0]]=matrix[0][0];
	title["label"] = matrix[1][0];

	var values = matrix.pop();
	var my = values.shift();
	var max = ss.max(values);
	max = max/100;
	// var sum = getArrayMax(values);
	chart = c3.generate({
		bindto: "#"+pollchart.chart[pollchart.nrOfCharts-1],
		data: {
			xs: t,
			columns : matrix,
			type: 'scatter',
			label: function(){return "Radie" },
			color: function (color, d) {
            // d will be 'id' when called for legends
            return datacolors.colors[0][0];
        }
    },
    axis: {
    	x: {
    		show : pollchart.options.axis,
    		label: matrix[0][0],
    		tick: {
    			fit: false
    		}
    	},
    	y: {
    		show : pollchart.options.axis,
    		label: matrix[1][0],
    	}
    },
    legend: {
    	show: false
    },
    tooltip: {
    	show : pollchart.options.tooltip,
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
	
}
function heatmap(matrix){
	var m = matrix;
	console.log(m);
	var head =  m[0].slice(1,m[0].length);
	console.log(m);
	m=m.slice(1,m.length);
	var array = matrixToRevArray(m);
	var w = $(".tumbchart").width();
	var gridSize = Math.floor(w / 6);

	if($("#charty1").height() > 100){
		var h = $("#charty1").height()-50;
	}else{
		var h =  w;
	}
	
	// var h = 900;
	var shiftR = 10;
	var margin = { top: 75, right: 0, bottom: 0, left: 0 },
	width =  w- margin.left - margin.right,
	height = h - margin.top - margin.bottom,

	legendWidth = (gridSize/4),
	dim_1 = columnNames(m),
	textLength = 0;
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

          // var colors = colorbrewer.RdYlGn[buckets];
          // var colors = datacolors.colors[5];
          // var colorScale = d3.scale.quantile()
          // .domain([0, buckets - 1, maxNum])
          // .range(colors);

          var colors = [];

// the first color
var color1 = datacolors.colors[0][0];

// the second color
var color2 = datacolors.colors[0][2];

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
//           var dim1Labels = svg.selectAll(".dim1Label")
//           .data(dim_1)
//           .enter().append("text")
//           .text(function (d) { ;return d; })
//           .attr("x", 10)
//           .attr("y", function (d, i) { return i * gridSize; })
//           .style("font-weight","bold")
//           // .style("text-anchor", "end")
//           .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
//           .attr("class","mono");

     //Header
     // var dim2Labels = svg.selectAll(".dim2Label")
     // .data(dim_2)

     // .enter().append("text")

                // .text(function(d) { return d; })
                // .attr("x", function(d, i) { return (i * gridSize) + 20; })

                // .attr("y", 0)
                // .style("text-anchor", "middle")
                // .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                // .attr("class","mono")
                // .attr("dy", ".71em")
                // .text(function(d) {return d})
//                 .style("font-weight","bold")
// 				.attr("transform", function(d,i) {    // transform all the text elements
//   return "translate(" + // First translate
//   ((i * gridSize)+ textLength*(shiftR)+gridSize/2)  + ",-10) " + // Translation params same as your existing x & y 
//     "rotate(-45)"            // THEN rotate them to give a nice slope
// });


          //heatmap
          var count=0,count2=0;
          var heatMap = svg.selectAll(".dim2")
          .data(array)
          .enter().append("g")
           // .style("fill", colors[0])
           .attr("class", "dim2");

           var rec = heatMap.append("rect")
           .attr("x", function(d) { count++; return ((count%columnlength - 1) * gridSize) + textLength*(shiftR)+gridSize; })
           .attr("y", function(d) { count2++; return ( Math.ceil(count2/(columnlength))-1) * gridSize; })
           .attr("rx", 4)
           .attr("ry", 4)
           .attr("class", "dim2 bordered")
           .attr("width", gridSize-2)
           .attr("height", gridSize-2)
           .attr("class", "square")
           rec.transition()
           .style("fill", function(d) {;return colorScale(d); });
           heatMap.append("title").text(function(d) {return d; });

       //     var count=0,count2=0;
       //     heatMap.append("text")
       //    // .attr("class", "mono")
       //    .text(function(d) { return  Math.round(d); })
       //    .attr("x", function(d) { count++; return ((count%columnlength - 1) * gridSize) + textLength*(shiftR)+gridSize + gridSize/3; })
       //    .attr("y", function(d) { count2++; return ( Math.ceil(count2/(columnlength))-1) * gridSize + gridSize/2; })
       //    .style("font-size", gridSize/3+"px")
       //    .style("font-family", "Calibri")
       //    // .style("stroke-width","0px")
       //    .style("text-shadow","none");



       //    var ledc=0;
       //    var legend = svg.selectAll(".legend")
       //    .data([0].concat(colorScale.quantiles()), function(d) {return d; })
       //    .enter().append("g")
       //    .attr("class", "legend");

       //    legend.append("rect")
       //    .attr("x", function(d, i) { return  (i%4 * legendWidth *4+ textLength*(shiftR)+35) ; })
       //    .attr("y", function(d, i) {k=0; if(i>3){k=1} return (rowlength) * (gridSize) + k * 30 + 20; })
       //    .attr("rx", 4)
       //    .attr("ry", 4)
       //    .attr("width", 25)
       //    .attr("height", 25)
       //    .style("fill", function(d, i) { return colors[i]; })
       //    .attr("class", "square");

       //    legend.append("text")
       //    .attr("class", "mono")
       //    .text(function(d) { return  Math.round(d)+"+"; })
       //    .attr("x", function(d, i) { return  (i%4 * legendWidth *4 + textLength*(shiftR)+35) ; })
       //    .attr("y", function(d, i) {k=0; if(i>3){k=1} return (rowlength) * (gridSize) + k * 30 + 35; })
       //    .style("font-size", "13px")
       //    .style("font-family", "Calibri")
       //    .style("font-weight","bold");
       // /*     .attr("x", function(d, i) { return gridSize * 11 + 25; })
       //      .attr("y", function(d, i) { return (i * legendWidth + 20); })
       //      */
       //      var title = svg.append("text")
       //      .attr("class", "mono")
       //      .attr("x", 0)
       //      .attr("y", rowlength * (gridSize+1) + 35)         
       //      // .style("font-size", gridSize/5+"px")
       //      .text("Legend")
       //      .style("font-weight","bold");
   }

   function heatmap2(matrix){
   	var maxwidth = 2000;
   	var m = matrix;
   	console.log(m);
   	var head =  m[0].slice(1,m[0].length);
   	console.log(m);
   	m=m.slice(1,m.length);
   	var array = matrixToRevArray(m);
   	var w =  window.innerWidth;
   	if(w>maxwidth){
   		w=maxwidth;
   	}
   	var gridSize = Math.floor(w / 10);
   	var h = 100 + gridSize * (m.length+2);

	// var h = 900;
	var shiftR = 10;
	var margin = { top: 100, right: 0, bottom: 0, left: 0 },
	width =  w- margin.left - margin.right,
	height = h - margin.top - margin.bottom,
	legendWidth = (gridSize/2 + 4),
	dim_1 = columnNames(m),
	textLength = 12;
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

          // var colors = colorbrewer.RdYlGn[buckets];
          // var colors = datacolors.colors[4];
          // var colorScale = d3.scale.quantile()
          // .domain([0, buckets - 1, maxNum])
          // .range(colors);

                    var colors = [];

// the first color
var color1 = datacolors.colors[0][0];

// the second color
var color2 = datacolors.colors[0][2];

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
          	if(d.length>12){return d.substring(0,12)+"...";} 
          	else {return d;} })
          .attr("x", 10)
          .attr("y", function (d, i) { return i * gridSize; })
          .style("font-weight","bold")
          // .style("text-anchor", "end")
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
                .style("font-weight","bold")
				.attr("transform", function(d,i) {    // transform all the text elements
  return "translate(" + // First translate
  ((i * gridSize)+ textLength*(shiftR)+gridSize/2)  + ",-10) " + // Translation params same as your existing x & y 
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
           .attr("x", function(d) { count++; return ((count%columnlength - 1) * gridSize) + textLength*(shiftR)+gridSize; })
           .attr("y", function(d) { count2++; return ( Math.ceil(count2/(columnlength))-1) * gridSize; })
           .attr("rx", 4)
           .attr("ry", 4)
           .attr("class", "dim2 bordered")
           .attr("width", gridSize-2)
           .attr("height", gridSize-2)
           .attr("class", "square")
           rec.transition()
           .style("fill", function(d) {;return colorScale(d); });
           heatMap.append("title").text(function(d) {return d; });

           var count=0,count2=0;
           heatMap.append("text")
          // .attr("class", "mono")
          .text(function(d) { return  Math.round(d); })
          .attr("x", function(d) { count++; return ((count%columnlength - 1) * gridSize) + textLength*(shiftR)+gridSize + gridSize/3; })
          .attr("y", function(d) { count2++; return ( Math.ceil(count2/(columnlength))-1) * gridSize + gridSize/2; })
          .style("font-size", gridSize/3+"px")
          .style("font-family", "Calibri")
          // .style("stroke-width","0px")
          .style("text-shadow","none");



          var ledc=0;
          var legend = svg.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), function(d) {return d; })
          .enter().append("g")
          .attr("class", "legend");

          legend.append("rect")
          .attr("x", function(d, i) { return  (i%4 * legendWidth + textLength*(shiftR)+30) ; })
          .attr("y", function(d, i) {k=0; if(i>3){k=1} return (rowlength) * (gridSize) + k * 30 + 20; })
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", 25)
          .attr("height", 25)
          .style("fill", function(d, i) { return colors[i]; })
          .attr("class", "square");
          
          legend.append("text")
          .attr("class", "mono")
          .text(function(d) { return  Math.round(d)+"+"; })
          .attr("x", function(d, i) { return  (i%4 * legendWidth + textLength*(shiftR)+35) ; })
          .attr("y", function(d, i) {k=0; if(i>3){k=1} return (rowlength) * (gridSize) + k * 30 + 35; })
          .style("font-size", "13px")
          .style("font-family", "Calibri")
          .style("font-weight","bold");
       /*     .attr("x", function(d, i) { return gridSize * 11 + 25; })
            .attr("y", function(d, i) { return (i * legendWidth + 20); })
            */
            var title = svg.append("text")
            .attr("class", "mono")
            .attr("x", 0)
            .attr("y", rowlength * (gridSize+1) + 35)         
            // .style("font-size", gridSize/5+"px")
            .text("Legend")
            .style("font-weight","bold");
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

function normalizeMatrix(matrix){
	var sum = getSumMatrix(matrix);
	for(var i = 0; i<matrix.length; i++){
		for(var j= 0; j<matrix[i].length; j++){
			matrix[i][j] = (matrix[i][j]/sum).toFixed(2);
		}
	}
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
* ################################ Transformations ##################################################################
*/
maggio.deleteData = function(index, row){
	var matrix = pollchart.data.matrix;
	console.log(matrix);
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
	console.log(array);

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

function chiSquareTest(){
	var sValue = 0.05;
	var test = addTotal();
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
	return pvalue > sValue ? true : false;
}

function calcExp(rowtot, coltot, sampsize){
	return (rowtot*coltot)/sampsize;
}
function calcChiPart(expected,accual){
	return (Math.pow(accual-expected,2))/expected;
}
function addTotal(){
	var m = [];
	m.unshift(header);
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
/**
* adds a container for the next chart
*/
function addInfo(){
	pollchart.nrOfCharts++;
	pollchart.chart.push(pollchart.chartID+pollchart.nrOfCharts);
	// var info = "<div><h2>"+title+"</h2><p id='maggioInfo'>"+info+"</p></div>";
	// $(container).append(info);
	if(container == "#char"){
		$(container).append("<div id='charty' class='tumbchart' style='height : 600px'></div>");
	}else{
		$(container).append("<div class='tumbchart' id='"+pollchart.chart[pollchart.nrOfCharts-1]+"'style ='background-color : #FFF6c8'></div>");

	}
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
* Normalize a datamatrix without a top header as first row
* First coloumn is text
*/
function normalize (matrix){
	var ratio =0;
	var temp;
	var result = [];
	for (var i = 0; i < matrix.length; i++) {
		for (var j = 1; j < matrix[i].length; j++) {
			temp = matrix[i][j];
			if(temp > ratio){
				ratio = temp;
			}
		};
	};
	ratio = ratio/100;
	
	for (var i = 0; i < matrix.length; i++) {
		result[i] = new Array();
		result[i].push(matrix[i][0]);
		for (var j = 1; j < matrix[i].length; j++) {
			result[i][j] = Math.round(matrix[i][j]/ratio);
		};
	};
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
//add maggio to context
this.maggio = maggio;
}();