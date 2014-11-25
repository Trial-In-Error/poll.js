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

		if(questions.length == 0 ){
			alert("No data");
		}
		else if(questions.length > 1){
			ref.optionsdata.updateOption(id,"matrix",opine.getDoubleMatrix(ref.dataHandler.polldata,questions));
			chartNames[vis](ref.optionsdata.getOption(id));

		}else{
			ref.optionsdata.updateOption(id,"matrix",opine.getSingleMatrix(ref.dataHandler.polldata,questions));
			chartNames[vis](ref.optionsdata.getOption(id));
		}

	}
}