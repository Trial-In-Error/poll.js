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
	this.flashChart = function(url,question,container,chart,options){
	var self = this;
	d3.json(url+".json", function(structure) {
		d3.json(url+"results.json", function(data) {
			d3.json(url+"result.json", function(frequency) {
						console.log(data);
				console.log(frequency);
				flashpoll.visualizeChart(self,structure,data,frequency,question,chart,container,options);
			});
		});
	});
	}
}