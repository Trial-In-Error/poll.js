/**
* optionHandler holds all the charts data and functions for
* updating and adding options
*/
var optionHandler = function(){
	this.questionsMatrix  = [];
	this.myDefault = null;
	this.chartOptions = null;
	this.chartID = "charty";
	this.array = [];
	this.size = 0;
	this.pointer = 0;
	this.visTypes = null;
	this.addChart = function(container){
		var c = JSON.parse(JSON.stringify(defaultOptions));
	// c.container = container;
	this.array.push(c);
	var chartyID = this.chartID + (this.size);
<<<<<<< HEAD
	visframes.addBasic(container,"item",chartyID,"tumbchart", chartyID);
=======
	visframes.addBasic(container,"item","topid","tumbchart", chartyID);
>>>>>>> 0c089e8e7c6b18191eebf5cc58645a944976895f
	this.array[this.size].container = "#"+chartyID;
	this.size++;
	return this.array.length-1;
},
this.addGridChart = function(container){
	var c = JSON.parse(JSON.stringify(defaultOptions));
	c.container = container;
	this.array.push(c);
	this.size++;
	return this.array.length-1;
},
this.updateOption = function(index, opt, value ){
	this.array[index][opt] = value;
},
this.addChartOptions = function(index,value){
	for(key in value){
		this.array[index].chartOptions[key] = value[key];
	}

},
this.addOptions = function(id,options){
/*	if(this.myDefault ==null){
		this.myDefault = defaultOptions;
	}*/

	for(key in options){
		this.array[id][key]= options[key];
	}
},
this.isMobile = function(){
	if(window.innerWidth<400){
		defaultOptions.mobile=true;
		defaultOptions.legendOffset = 40;
	}
},
this.getOption = function(index){
	return this.array[index];
}
this.checkTitle = function(id){
	if(this.array[id].title!=null){
		var title = $(this.array[id].container).parent().prepend("<h2 id=charttitle"+id+">"+this.array[id].title+"</h2>");
		this.array[id].chartOptions.size.height-=$("#charttitle"+id).height();
	}
};
this.setSize = function(id){
	var width = $(this.array[id].container).parent().parent().width();
	var height = $(this.array[id].container).parent().parent().height();
	this.array[id].chartOptions.size = 
	{
		width : width,
		height : height
	};
}
}
/**
* if no option is specified default options are used
*/
var defaultOptions = {
	div : null,
	c3 : null,
	classname : null,
	chart : null,
	id: null,
	chartOptions : {},
	container: null,
	orgmatrix : null,
	matrix: null,
	tooltip : true,
	legend : true,
	axis : true,
	colorscheme : 0,
	ylabel: null,
	xlabel: null,
	mobile:false,
	legendOffset : 80,
	visualization: null,
	color:0,
	interaction : true,
	transformation : null,
	answer : null,
	questions : [],
	title:  null,
	info : null,
	title2 : null,
	info2 : null,
	norm : false,
	norm2 : false,
	correlation : null,
	independence: null,
  	legendMargin : 0,
   	swap: false,
}