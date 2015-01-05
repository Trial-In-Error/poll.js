/**
* optionHandler holds all the charts data and functions for
* updating and adding options
*/
var optionHandler = {
	questionsMatrix  : [],
	myDefault : null,
	chartOptions: null,
	chartID :"charty",
	array: [],
	size :0,
	pointer: 0,
	visTypes: null,
	addChart : function(container){
		var c = JSON.parse(JSON.stringify(defaultOptions));
	// c.container = container;
	optionHandler.array.push(c);
	var chartyID = optionHandler.chartID + (optionHandler.size);
	visframes.addBasic(container,"item",chartyID,"tumbchart", chartyID);
	optionHandler.array[optionHandler.size].container = "#"+chartyID;
	optionHandler.size++;
	return optionHandler.array.length-1;
},
	addGridChart : function(container){
	var c = JSON.parse(JSON.stringify(defaultOptions));
	c.container = container;
	optionHandler.array.push(c);
	optionHandler.size++;
	return optionHandler.array.length-1;
},
updateOption : function(index, opt, value ){
	optionHandler.array[index][opt] = value;
},
addChartOptions : function(index,value){
	for(key in value){
		optionHandler.array[index].chartOptions[key] = value[key];
	}

},
addOptions : function(id,options){
/*	if(optionHandler.myDefault ==null){
		optionHandler.myDefault = defaultOptions;
	}*/

	for(key in options){
		optionHandler.array[id][key]= options[key];
	}
},
isMobile : function(){
	if(window.innerWidth<400){
		defaultOptions.mobile=true;
		defaultOptions.legendOffset = 40;
	}
},
getOption : function(index){
	return optionHandler.array[index];
},
checkTitle : function(id){
	if(optionHandler.array[id].title!=null){
		var title = $(optionHandler.array[id].container).parent().prepend("<h2 id=charttitle"+id+">"+optionHandler.array[id].title+"</h2>");
		optionHandler.array[id].chartOptions.size.height-=$("#charttitle"+id).height();
	}
},
setSize : function(id){
	var width = $(optionHandler.array[id].container).parent().parent().width();
	var height = $(optionHandler.array[id].container).parent().parent().height();
	optionHandler.array[id].chartOptions.size = 
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