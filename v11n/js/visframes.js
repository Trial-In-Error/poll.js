var visframes = {
	container : null,
	basicFrame : function(topclass,topid,chartclass,chartid){
		return $("<div class='"+topclass+"' id='"+topid+"'></div>").append("<div class='"+chartclass+"'' id='"+chartid+"'></div>");
	},
	addBasic: function(topclass,topid,chartclass,chartid){
		if(visframes.container==null){
			$('#container').append(basicFrame(topclass,topid,chartclass,chartid));
		}else{
			console.log(visframes.container);
			$(visframes.container).append(visframes.basicFrame(topclass,topid,chartclass,chartid));
		}

	}
}
