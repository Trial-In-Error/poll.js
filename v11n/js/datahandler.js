var dataHandler = function  () {

	this.pollurl;
	this.question_url_list = [];

	this.polldata = null;
	this.questionList = [];
	this.pureData = [];
	/**
	*
	*/
	this.setPollurl = function(url){  
		this.pollurl = url;
		
	}

	this.addQuestion = function(url){
		this.question_url_list.push(url);
	}
	/**
	*	
	*/
	this.getPoll = function(callback){
		//No url, method returns
		var self = this;
		if(this.pollurl == null){
			alert("No poll data");
			return;
		}
		//run callback with polldata
		 if(this.polldata != null){
				callback(this.polldata);
		// no data exist, fetch data from url
		}else{
			d3.json(this.pollurl, function(data) {
				self.polldata=data;
				callback(data);
			});
		}
	}


this.getQuestionByIndex = function(numb){
	return questionList[numb];
}


this.pollTemplate = {
	id : null,
	name : null,
	simpleID : null,
	open : null,
	owner : null,
	question_list : []
}

this.questionTemplate = {
	id : null,
	body : "nameOfQuestion",
	type : "questionType",
	response_list : []
}

this.responseTemplate = {
	body : "nameOfResponse",
	answers :[],
	timestamp: null,
	value : null
}
this.userTemplate = {
	anonymous : null,
	token: null,
}
}