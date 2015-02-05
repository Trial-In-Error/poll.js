var visualizeOpinerPoll = function(){
	this.dataHandler = new dataHandler();
	this.pollsetOptions;
	this.supercontainer;
	// optionHandler = new optionHandler();
	console.log(optionHandler);
	this.getDataHandler = function(){
		return this.dataHandler;
	}
	this.setURL = function(url){
		this.dataHandler.setPollurl(url);
	}
	this.init = function(url,callback){
		this.dataHandler.setPollurl(url);
		var self = this;
		this.dataHandler.getPoll(
			function(data){
				callback();
			});
	}
	this.createGrid = function(ref,container,questions,options){
		opine.init(ref,container,questions,options);
	}
	this.createVis = function(questions,options,container){
		opine.preparePoll(data,questions,container);
	}
	this.visualizePoll = function(self,questions){
		console.log(self.dataHandler);
		opine.visAll(self.dataHandler.polldata,questions);
	}
	this.visualizeChart = function(questions,vis,options,container){

		var id = optionHandler.addChart(container);
			if(options == null){
			options = optionHandler.array[id];
		}
		console.log(this.dataHandler.polldata);
		if(questions.length == 0 ){
			alert("No data");
		}
		else if(questions.length > 1){
			optionHandler.updateOption(id,"matrix",opine.getDoubleMatrix(this.dataHandler.polldata,questions));

		}else{
			optionHandler.updateOption(id,"matrix",opine.getSingleMatrix(this.dataHandler.polldata,questions));

			chartNames[vis](optionHandler.getOption(id));
		}
			optionHandler.updateOption(id,"chart",chartNames[vis]);
			optionHandler.updateOption(id,"color",1)
			optionHandler.updateOption(id,"id",optionHandler.size-1)
			// optionHandler.updateOption(optionHandler.size-1,"answer",answer)
			optionHandler.updateOption(id,"xlabel","Something")
			optionHandler.updateOption(id,"ylabel","frequency")
			optionHandler.pointer = id;

			optionHandler.array[optionHandler.size-1].chartOptions =  options.chartOptions;
			optionHandler.array[optionHandler.size-1] = visGenerator.addOptions(optionHandler.array[optionHandler.size-1],options);
			optionHandler.checkTitle(optionHandler.size-1);
			if(vis=="heatmap"){
				var chart = chartNames[vis](optionHandler.getOption(id),$(container).height());
			}else{
				var chart = chartNames[vis](optionHandler.getOption(id));
			}
		
			optionHandler.updateOption(id,"c3",chart);
	}
}