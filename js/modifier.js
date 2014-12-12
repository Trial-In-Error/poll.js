function createSlider(container,id,length){
	var label = '<label for="sliderdonu'+id+'">Input slider:</label>'
	var slider = '<input type="range" name="slider" id="sliderdonu'+id+'" value="1" min="1" max="'+ length +'" data-highlight="true" />'
	// var slider = "<div><input id='sliderdonut"+id+"' type='range' min='1' max='"+ length +"' value='1'/></div>";
	// var label = "<label id='sliderLabel' for='male'>"+ "Current plot: " + getMytitle() + "</label>";
	$(container).parent().append(label);
	$(container).parent().append(slider);
	$(container).trigger("create");
	$("#sliderdonut" + id).on("slidestop", function(e){
		console.log("SLIDE");
		// setBarSet($("#sliderb").val(),matrix);
	});
}
/**
* adds a container for the next chart
*/
function addInfo(qustions,name){
	pollchart.nrOfCharts++;
	pollchart.chart.push(pollchart.chartID+pollchart.nrOfCharts);
	// var info = "<div><h2>"+title+"</h2><p id='maggioInfo'>"+info+"</p></div>";
	// $(container).append(info);
	// if(container == "#char"){
	// 	$(container).append("<div id='charty' class='tumbchart' style='height : 600px'></div>");
	// }else{
	// $(container).append("<div class='tumbchart' id='"+pollchart.chart[pollchart.nrOfCharts-1]+"'></div>");

	var id = "tumb"+(pollchart.nrOfCharts-1);
		console.log(id);
		$(container).append("<div class='item "+name+"' id='"+id+"'></div>");
		$("#"+id).append("<div class='tumbchart' id='"+pollchart.chart[pollchart.nrOfCharts-1]+"'></div>");
		$("#" + pollchart.chart[pollchart.nrOfCharts-1]).height($("#"+id).height());
		console.log($("#" + pollchart.chart[pollchart.nrOfCharts-1]));
		for (var i = 0; i < qustions.length; i++) {
			$("#"+pollchart.chart[pollchart.nrOfCharts-1]).addClass("question-"+qustions[i]);
		};


	// }
}

function addInfo2(title,info){
	pollchart.nrOfCharts++;
	pollchart.chart.push(pollchart.chartID+pollchart.nrOfCharts);
	var info = "<div><h2>"+title+"</h2><p id='maggioInfo'>"+info+"</p></div>";
	$(container).append(info);
	if(container == "#char"){
		$(container).append("<div id='charty' class='tumbchart' style='height : 600px; width : 100px'></div>");
	}else{
		$(container).append("<div class='tumbchart' id='"+pollchart.chart[pollchart.nrOfCharts-1]+"' style='height : 600px; width : 100%'></div>");

	}
}
var tableId = "#tableId";
var tablerow;
var cells = [];
function addSqaure(){
	pollchart.nrOfCharts++;
	pollchart.chart.push(pollchart.chartID+pollchart.nrOfCharts);
	if(pollchart%4 == 0){
		$(tableId).append('<tr></tr>');
	}
	$(tableId).append("<div id='"+pollchart.chart[pollchart.nrOfCharts-1]+"'></div>");
}

function createTable(){
	var myTableDiv = document.getElementById(container);
	var table = document.createElement('TABLE');
	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);


    //TABLE ROWS
    for (i = 0; i < 4; i++) {
    	var tr = document.createElement('TR');
    	for (j = 0; j < 3; j++) {
    		var td = document.createElement('TD')
            // td.appendChild(document.createTextNode("<div id='"+pollchart.chart[pollchart.nrOfCharts-1]+"' background-color='"+pollchart.backgroundColors[(i+j)%pollchart.backgroundColors.length]+"''></div>"));
            td.appendChild(document.createTextNode(i));           
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    }  
    myTableDiv.appendChild(table)

}

function setChartText(text){
	var w = window.innerWidth/2;

	d3.select(container + ' svg').append("text")
	.attr("x", w)
	.attr("y", "55")
	.attr("dy", "-.7em")
	.style("text-anchor", "middle")
	.attr("stroke","#101010")
	.attr("font-size", "10px")
	.attr("font-family", "sans-serif")
	.attr("fill", "Black")
	.text(text);
}
function removeChartText(element){
	console.log("removing...");
	d3.select(element).remove();
}

var set = 0;
function setBarSet(val,matrix){
	set= val-1;
	loadData(matrix);
}
function unload(){
	chart.unload({
		ids: cat,
	});
}
function loadData(matrix){
	changeLabel('#sliderLabel',getMytitle());
	chart.load({
		rows: 
		[header,matrix[set]],

	});
}
function changeLabel(label,value){
	$(label).text("Current plot: " +value);
}
function getMytitle(){
	return matrix[set][0];
}
