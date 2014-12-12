var visualizeOpinerPoll = function(){
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
		opine.preparePoll(data,questions,container, self.optionsdata);
	}
	this.visualizePoll = function(self,questions){
		console.log(self.dataHandler);
		opine.visAll(self.dataHandler.polldata,self.optionsdata,questions);
	}
	this.visualizeChart = function(questions,vis,options,container){
		var id = this.optionsdata.addChart(container);
		console.log(this.dataHandler.polldata);
		if(questions.length == 0 ){
			alert("No data");
		}
		else if(questions.length > 1){
			this.optionsdata.updateOption(id,"matrix",opine.getDoubleMatrix(this.dataHandler.polldata,questions));

		}else{
			this.optionsdata.updateOption(id,"matrix",opine.getSingleMatrix(this.dataHandler.polldata,questions));

			chartNames[vis](this.optionsdata.getOption(id));
		}
		this.optionsdata.updateOption(id,"chart",chartNames[vis]);
			this.optionsdata.updateOption(id,"color",1)
			this.optionsdata.updateOption(id,"id",optionHandler.size-1)
			// this.optionsdata.updateOption(this.optionsdata.size-1,"answer",answer)
			this.optionsdata.updateOption(id,"xlabel","Something")
			this.optionsdata.updateOption(id,"ylabel","frequency")
			this.optionsdata.pointer = id;
			this.optionsdata.array[this.optionsdata.size-1].chartOptions =  options.chartOptions;
			this.optionsdata.array[this.optionsdata.size-1] = visGenerator.addOptions(this.optionsdata.array[this.optionsdata.size-1],options);
			this.optionsdata.checkTitle(this.optionsdata.size-1);
			
		var chart = chartNames[vis](this.optionsdata.getOption(id));
			this.optionsdata.updateOption(id,"c3",chart);
	}
}