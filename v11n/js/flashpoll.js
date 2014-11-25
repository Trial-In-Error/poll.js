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