var visframes = {
	container : null,
	basicFrame : function(topclass,topid,chartclass,chartid){
		return $("<div class='"+topclass+"' id='"+topid+"'></div>").append("<div class='"+chartclass+"'' id='"+chartid+"'></div>");
	},
	addBasic: function(container,topclass,topid,chartclass,chartid){
<<<<<<< HEAD
=======
	
>>>>>>> 0c089e8e7c6b18191eebf5cc58645a944976895f
			$(container).append(visframes.basicFrame(topclass,topid,chartclass,chartid));
		

	}
}
