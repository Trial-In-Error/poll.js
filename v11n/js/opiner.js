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
		// optionHandler.updateOption(optionHandler.size-1,"xlabel","Something")
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