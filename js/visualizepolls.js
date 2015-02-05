var visualizeFlashPoll = function(){
	this.flashdata;
	this.pollsetOptions;
	this.supercontainer;
	// this.optionsdata = new optionHandler();

	this.init = function(url,callback){
		this.flashdata = new flashdata();
		var self = this;
		var username = config.user;
		var password = config.password;
		console.log(btoa(username + ":" + password));
		d3.json(url).header("Authorization", "Basic "+btoa(username + ":" + password))
		.get(function(error,structure) {
			d3.json(url+"/results").header("Authorization", "Basic " + btoa(username + ":" + password))
			.get(function(error,data) {
				d3.json(url+"/result").header("Authorization", "Basic " + btoa(username + ":" + password))
				.get(function(error,frequency) {
					self.flashdata.structure = structure;
					self.flashdata.frequency = frequency;
					self.flashdata.data = data;
					callback();
				});
			});
		});
	}
	this.initlocal = function(url,callback){
		this.flashdata = new flashdata();
		this.flashdata.seturl(url);
		var self = this;
		this.flashdata.getDataLocal(function(){
			flashpoll.setDataArray(self.flashdata.structure,self.flashdata.frequency);
			callback();

		});
	}
	this.flashChart = function(url,question,container,chart,options){
		this.flashdata = new flashdata();
		var self = this;
		var username = config.user;
		var password = config.password;
		d3.json(url, function(structure) {
			d3.json(url+"/results", function(data) {
				d3.json(url+"/result", function(frequency) {
					flashpoll.setDataArray(self,structure,frequency,options);
					flashpoll.visualizeChart(self,structure,data,frequency,question,chart,container,options);
				});
			});
		});
	}
	this.chart = function(question,container,chart,options){
		console.log(this.flashdata);
		flashpoll.visualizeChart(this,this.flashdata.structure,this.flashdata.data,this.flashdata.frequency,question,chart,container,options);
	}
	this.flashChartLocal = function(url,question,container,chart,options){
		this.flashdata = new flashdata();
		this.flashdata.seturl(url);
		var self = this;
		this.flashdata.getDataLocal(function(){
			flashpoll.setDataArray(self,structure,frequency,options);
			flashpoll.visualizeChart(self,structure,data,frequency,question,chart,container,options);
		});
	}
	this.quickOverview = function(container,options){
		var q = 0;
		while(this.flashdata.structure.questions[q].questionType == "FREETEXT"){
			q = (q+1)%this.flashdata.structure.questions.length;
		}
		options.xlabel = "question " + this.flashdata.structure.questions[q].orderId;
		var link = this;
		flashpoll.visualizeChart(this,this.flashdata.structure,this.flashdata.data,this.flashdata.frequency,[this.flashdata.structure.questions[q].orderId],"sliderdonut",container,options);
		setInterval(function () {
			$(container).empty();

			q = (q+1)%link.flashdata.structure.questions.length;
			while(link.flashdata.structure.questions[q].questionType == "FREETEXT"){
				q = (q+1)%link.flashdata.structure.questions.length;
			}
			console.log("THIS IS THE QUESTIONTYPE");
			console.log(link.flashdata.structure.questions[q].questionType);

			options.xlabel = "question " + link.flashdata.structure.questions[q].orderId;
			flashpoll.visualizeChart(link,link.flashdata.structure,link.flashdata.data,link.flashdata.frequency,[link.flashdata.structure.questions[q].orderId],"sliderdonut",container,options);
		}, 3000);
	}
}