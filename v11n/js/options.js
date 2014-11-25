/**
* optionHandler holds all the charts data and functions for
* updating and adding options
*/
var optionHandler = function(){
this.myDefault = null;
this.chartID = "charty";
this.array = [];
this.size = 0;
this.pointer = 0;
this.visTypes = null;
this.addChart = function(container){
	var c = JSON.parse(JSON.stringify(defaultOptions));
	// var c = defaultOptions;
	c.container = container;
	this.size++;
	this.array.push(c);
	return this.array.length-1;
},
this.updateOption = function(index, opt, value ){
	this.array[index][opt] = value;
},
this.addOptions = function(options){
	if(this.myDefault ==null){
		this.myDefault = defaultOptions;
	}

	for(key in options){
		this.myDefault[key] = options[key];
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
	interaction : false,
	answer : null,
	questions : [],
	title:  "no title",
	info : "no info about the visualization",
	title2 : "no title",
	info2 : "no info about the visualization",
	norm : false,
	norm2 : false,
	correlation : null,
	independence: null,
	size: {
       	 width: "50vw",
         height: "50vw"
    },
   legendMargin : 0,
   swap: false,
}