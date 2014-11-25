var tables  ={
	//[con,cat]
	questions : [
	// 	Cat    0      1     2
	/*Con 0*/[null,[1,1],[1,2]],
	/*Con 1*/[[1,0],[2,1],[2,2]],
	/*Con 2*/[[2,0],[3,1],[3,2]],
	/*Con 3*/[[3,0]]
	],

	charts    :[
	[[histogram],[pie,bar/*,bar2*/],[stackedBar,heatmap2,lineCat,bar/*,bar2*/]],
	[[scatter,line,regressionline],[/*lineCat*/stackedBar,bar/*,bar2*//*,pie*/],[bubble]],
	[[bubble]]
	]
	,
	charts2    :[
	[[histogram],[pie,bar/*,bar2*/],[stackedBar,heatmap2,lineCat,bar/*,bar2*/]],
	[[scatter,line,regressionline],[/*lineCat*/stackedBar,bar/*,bar2*/,pie],[bubble]],
	[[bubble]]
	]
	,
};
var chartNames = {
	"bar" : bar,
	"line" : line,
	"scatter" : scatter,
	"regressionline" : regressionline,
	"pie" : pie,
	"stackedbar"  : stackedBar,
	"bubble" : bubble,
	"heatmap" : heatmap2,
	"slidebar" : slideBar,
	"slidepie" : slidePie,
	"histogram" : histogram,
	"tempBar" : tempBar
}
function getvistypes(cat,con,single){
	var r = tables.questions[con][cat];
	if(single){
		return getvistable2(r[0],r[1]);
	}else{
		return getvistable(r[0],r[1]);
	}
	
}
function getvistable(con,cat){
	console.log(con +" - " + cat);
	return tables.charts[con-1][cat];
}
function getvistable2(con,cat){
	console.log(con +" - " + cat);
	return tables.charts2[con-1][cat];
}