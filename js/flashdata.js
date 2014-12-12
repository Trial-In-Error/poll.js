/**
* This object contain data from a flashpoll and methods for fetching the data
*/
var flashdata = function(){
	this.structure = null;
	this.data = null;
	this.frequency = null;
	this.url;
	this.getDataLocal = function(callback){
		console.log(this.url);
		var self = this;
		d3.json(self.url+".json", function(structure) {
			d3.json(self.url+"results.json", function(data) {
				d3.json(self.url+"result.json", function(frequency) {
					self.structure = structure;
					self.data = data;
					self.frequency = frequency;
					callback();
				});
			});
		});
	};
	this.seturl = function(url){
		this.url = url;
	}
}