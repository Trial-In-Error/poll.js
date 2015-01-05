var visframes = {
	container : null,
	basicFrame : function(topclass,topid,chartclass,chartid){
		return $("<div class='"+topclass+"' id='"+topid+"' style='height:" + $('#grid-sizer').width() + "'; width='"  + $('#grid-sizer').width() + "'></div>").append("<div class='"+chartclass+"'' id='"+chartid+"'></div>");
	},
	addBasic: function(container,topclass,topid,chartclass,chartid){
			$(container).append(visframes.basicFrame(topclass,topid,chartclass,chartid));
		

	}
}
