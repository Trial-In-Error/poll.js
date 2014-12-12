/**
*	flashpoll handles fetching and parsing data from flashpoll
*/
var flashpoll = {
	setDataArray : function(structure,frequency,options){
		console.log(structure.questions[0].orderId);
		for(var i = 0; i < structure.questions.length; i++){
			if(structure.questions[i].questionType != "FREETEXT"){
				options.questionsMatrix.push(
					flashpoll.getSingleMatrix(structure,frequency,structure.questions[i].orderId)
					);
			}
		}
	},
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
visualizeChart : function(ref,structure,data,frequency,question,chart,container,options){
	console.log(data);
	var matrix;
	var dt = "frequency";
	ref.optionsdata.addChart(container);

	if(question.length==1){
		matrix =  flashpoll.getSingleMatrix(structure,frequency,question[0]);
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"title",structure.questions[question[0]].questionText)
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"ylabel","score")
	}
	else{
		 matrix=flashpoll.getDoubleMatrix(structure,data,question);
		if(matrix==null){
			return;
		}
		var subtitle = "";
		for(i=0; i<question.length; i++){
			subtitle += "-";
			subtitle += structure.questions[question[i]].questionText;
			subtitle += "<br/>"
		}
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"xlabel",(structure.questions[question[0]].questionText).trunc(25))
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"ylabel",(structure.questions[question[1]].questionText).trunc(25))
	}
	matrix = transformation(matrix, options.transformation);
	ref.optionsdata.updateOption(ref.optionsdata.size-1,"matrix",matrix);


	ref.optionsdata.updateOption(ref.optionsdata.size-1,"chart",chartNames[chart]);
	ref.optionsdata.updateOption(ref.optionsdata.size-1,"color",1);
	ref.optionsdata.updateOption(ref.optionsdata.size-1,"id",ref.optionsdata.size-1);
		// ref.optionsdata.updateOption(ref.optionsdata.size-1,"answer",answer)

		ref.optionsdata.pointer = ref.optionsdata.size-1;
		ref.optionsdata.array[ref.optionsdata.size-1] = visGenerator.addOptions(ref.optionsdata.array[ref.optionsdata.size-1],options);
		

		// ref.optionsdata.array[ref.optionsdata.size-1].chartOptions =  options.chartOptions;
		ref.optionsdata.setSize(ref.optionsdata.size-1);
		ref.optionsdata.checkTitle(ref.optionsdata.size-1);
		console.log(ref.optionsdata.array)
		var chart = chartNames[chart](ref.optionsdata.getOption(ref.optionsdata.size-1));
		ref.optionsdata.updateOption(ref.optionsdata.size-1,"c3",chart);


	},

	calculateVisualizations : function(structure,data,q,single){
		var array = structure.questions;
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
		// header.push();
		var side = [];
		side.push(structure.title);
		var first,second;

		for (var i = 0; i < structure.questions.length; i++) {

			if(structure.questions[i].orderId==ids[0]){
				first = structure.questions[i].questionType;
				rows = structure.questions[i].answers.length;
				for (var y = 0; y < structure.questions[i].answers.length; y++) {
					header.push(structure.questions[i].answers[y].answerText);
				};
			}
			if(structure.questions[i].orderId==ids[1]){
				second = structure.questions[i].questionType;
				columns = structure.questions[i].answers.length;
				for (var y = 0; y < structure.questions[i].answers.length; y++) {
					side.push(structure.questions[i].answers[y].answerText);
				};
			}
		};
		var isOrdnial = flashpoll.checkOrdinal(first, second);

		if(isOrdnial == 0){
			return;
		}
		var matrix = buildEmptyMatrix(rows,columns);
		//For each user
		data.forEach(function(d){
			var tempmatrix = buildEmptyMatrix(rows,columns);
			//For each question the user have answered
			for (var i = 0; i < d.pollResQuestions.length; i++) {
				//If the question is the first one in the searchlist
				if(d.pollResQuestions[i].questionOrderId==ids[0]){
					//for each answer choice
					for (var j = 0; j< d.pollResQuestions[i].pollResultAnswers.length; j++) {
						var answerOrder = d.pollResQuestions[i].pollResultAnswers[j].answerOrderId;
						var score = d.pollResQuestions[i].pollResultAnswers[j].answerScore;
						for (var u = 0; u < columns; u++){
							tempmatrix[answerOrder][u] = score;
						};
					};
				};
				if(d.pollResQuestions[i].questionOrderId==ids[1]){
					// for each answer in q 2
					for (var j = 0; j< d.pollResQuestions[i].pollResultAnswers.length; j++) {
						var answerOrder = d.pollResQuestions[i].pollResultAnswers[j].answerOrderId;		
						var score = d.pollResQuestions[i].pollResultAnswers[j].answerScore;
						for (var u = 0; u < rows; u++){
							//If not out of bounds
							if(u<rows && j<columns){
								if(isOrdnial == 1){
									matrix[u][answerOrder] += flashpoll.mergeOrder(tempmatrix[u][answerOrder],score);
								}else if(isOrdnial == 2){
									matrix[u][answerOrder] += flashpoll.mergeOneOrder(tempmatrix[u][answerOrder],score);
								}else if(isOrdnial == -1 && tempmatrix[u][answerOrder] * score > 0){
									matrix[u][answerOrder] += flashpoll.mergeNominal(tempmatrix[u][answerOrder],score);
								}

							}

						};
					}

				};
			}
		});
addSideNames(matrix,header);
matrix.unshift(side);
return matrix;
},
mergeOrder : function(q1,q2){
	return q1 + q2;
},
mergeOneOrder : function(q1,q2){
	return q1 * q2;
},
mergeNominal : function(q1,q2){
	return 1;
},
checkOrdinal : function(type1, type2){
	if(type1 == "FREETEXT" || type2 == "FREETEXT"){
		return 0;
	}else if(type1 == "ORDER" && type2 == "ORDER"){
		return 1;
	}else if(type1 == "ORDER" || type2 == "ORDER"){
		return 2;
	}else{
		return -1;
	}
}
}

